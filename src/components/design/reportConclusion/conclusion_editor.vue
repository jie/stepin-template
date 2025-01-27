<template>
    <div>
        <div>{{ $t('base.EditComponent') }} {{ baseForm?.title }}</div>
        <div>
            <BaseForm ref="baseForm" />
        </div>
        <div style="padding-left: 80px">
            <div style="margin-top:10px;">
                <a-form-item :label="$t('base.Title')" name="title">
                    <a-select v-model:value="itemData.languageType" style="width: 200px;">
                        <a-select-option value="single">{{ $t('base.SingleLanguage') }}</a-select-option>
                        <a-select-option value="multiple">{{ $t('base.MultipleLanguage') }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('base.ParentConclusion')" name="parent_com_key">
                    <a-select v-model:value="itemData.parent_com_key" style="width: 100%;" @change="onChangeParentComKey">
                        <a-select-option v-for="item in conclustionComponents" :key="item.key" :value="item.key">
                            {{ item.title }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('base.ParentConclusionItem')" name="parent_key" v-if="conclustionComponentRecords && conclustionComponentRecords.length > 0">
                    <a-select v-model:value="itemData.parent_key" style="width: 100%;">
                        <a-select-option v-for="item in conclustionComponentRecords" :key="item.key" :value="item.key">
                            {{ item.title }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('base.StatusOptions')" name="options">
                    <div v-for="(item, index) in itemData.options">
                        <a-tag :color="colorMap[item.value]" @click="onClickOption(index)" style="cursor: pointer;">
                            {{ item.label }} / {{ item.value }}
                            <template #icon>
                                <edit-outlined />
                            </template>
                        </a-tag>
                    </div>
                </a-form-item>
            </div>
            <div>
                <a-form-item :label="$t('base.Conclusion')" name="Conclusion">
                    <div style="border: 1px solid #f0f0f0; padding: 0 20px 20px 20px">
                        <a-list item-layout="vertical" :data-source="itemData.conclusions">
                            <template #renderItem="{ item, index }">
                                <a-list-item>
                                    <template #actions>
                                        <span style="cursor: pointer;" v-for="{ type, text } in actions" :key="type"
                                            @click="onClickAction(type, text, index)">
                                            <component :is="type" style="margin-right: 8px" />
                                            {{ text }}
                                        </span>
                                    </template>
                                    <a-list-item-meta :description="item.title">
                                        <template #title>{{ item.remark }}</template>
                                    </a-list-item-meta>
                                </a-list-item>
                            </template>
                        </a-list>
                        <hr>
                        <a-button type="primary" @click="onClickAddConclusion">{{ $t('base.AddConclusion') }}</a-button>
                    </div>
                </a-form-item>
            </div>
        </div>
        <a-modal :getContainer="() => document.body" v-model:visible="isShowOptionDialogRef"
            :title="$t('base.EditOption')" @ok="handleOptionOK">
            <a-form :model="optionFormData" layout="vertical">
                <a-form-item :label="$t('base.Label')" name="label">
                    <a-input v-model:value="optionFormData.label"></a-input>
                </a-form-item>
                <a-form-item :label="$t('base.Value')" name="value">
                    <a-input v-model:value="optionFormData.value"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal :getContainer="() => document.body" v-model:visible="isShowConclusionDialogRef"
            :title="$t('base.EditConclusion')" @ok="handleConclusionOK">
            <a-form :model="conclusionFormData" layout="vertical">
                <a-form-item :label="$t('base.Title')" name="title">
                    <a-input v-model:value="conclusionFormData.title"></a-input>
                </a-form-item>
                <a-form-item :label="$t('base.Key')" name="key">
                    <a-input v-model:value="conclusionFormData.key"></a-input>
                </a-form-item>
                <a-form-item :label="$t('base.Remark')" name="remark">
                    <a-textarea v-model:value="conclusionFormData.remark"></a-textarea>
                </a-form-item>
                <a-form-item :label="$t('base.hasCollector')" name="hasCollector">
                    <a-switch v-model:checked="conclusionFormData.hasCollector"></a-switch>
                </a-form-item>
                <a-form-item :label="$t('base.hasStatus')" name="hasStatus">
                    <a-switch v-model:checked="conclusionFormData.hasStatus"></a-switch>
                </a-form-item>
                <a-form-item :label="$t('base.hasImages')" name="hasImages">
                    <a-switch v-model:checked="conclusionFormData.hasImages"></a-switch>
                </a-form-item>
                <a-form-item :label="$t('base.hasRemarks')" name="hasRemarks">
                    <a-switch v-model:checked="conclusionFormData.hasRemarks"></a-switch>
                </a-form-item>
                <a-form-item :label="$t('base.IsDefect')" name="IsDefect">
                    <a-switch v-model:checked="conclusionFormData.IsDefect"></a-switch>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { ref, PropType, reactive, toRaw } from "vue"
import BaseForm from "../base_editor.vue"
import { i18n } from '@/lang/i18n';
import { ReportTemplateStore } from "@/store/reportTemplate"
import { Modal } from 'ant-design-vue';
import { newJsonObject, generateUUID } from "@/utils/helpers";
const reportTemplateStore = ReportTemplateStore()
const isShowOptionDialogRef = ref(false)
const isShowConclusionDialogRef = ref(false)
const isEditConclusionRef = ref(false)
const currentEditOptionIndexRef = ref(null)
const currentEditConclusionIndexRef = ref(null)

const conclustionComponents = ref([])
const conclustionComponentRecords = ref([])
const props = defineProps({
    item: {
        type: Object
    }
})

const document = window.document
const actions: Record<string, string>[] = [
    { type: 'EditOutlined', text: i18n.global.t('base.Edit') },
    { type: 'PlusCircleOutlined', text: i18n.global.t('base.Add') },
    { type: 'MinusCircleOutlined', text: i18n.global.t('base.Delete') },
];
const conclusionFormData = reactive({
    title: "",
    key: "",
    remark: "",
    hasCollector: true,
    hasStatus: true,
    hasImages: true,
    hasRemarks: true,
    isDefect: false
})

const optionFormData = reactive({
    label: "",
    value: ""
})


const colorMap = {
    conformed: '#87d068',
    not_conformed: '#f50',
    pending: '#108ee9',
    not_applicable: '#3b5999'
}
const singleLanguageOptions = [
    {
        label: 'Conformed',
        value: 'conformed',
        default: true
    },
    {
        label: 'Not Conformed',
        value: 'not_conformed'
    },
    {
        label: 'Pending',
        value: 'pending'
    },
    {
        label: 'Not Applicable',
        value: 'not_applicable'
    }
]

const multipleLanguageOptions = [
    {
        label: 'Conformed 合格',
        value: 'conformed',
        default: true
    },
    {
        label: 'Not Conformed 不合格',
        value: 'not_conformed'
    },
    {
        label: 'Pending 待确认',
        value: 'pending'
    },
    {
        label: 'Not Applicable 不适用',
        value: 'not_applicable'
    }
]

const baseForm = ref(null)
const itemData = ref({
    parent_com_key: '',
    parent_key: '',
    languageType: 'single',
    conclusions: [],
    options: []
})

const switchLanguageType = () => {
    if (itemData.value.languageType === 'single') {
        itemData.value.languageType = 'multiple'
        // itemData.value.options = newJsonObject(multipleLanguageOptions)
    } else {
        itemData.value.languageType = 'single'
        // itemData.value.options = newJsonObject(singleLanguageOptions)
    }
}

const onChangeParentComKey = () => {
    conclustionComponentRecords.value = reportTemplateStore.reportTemplate.items.find(c => c.key === itemData.value.parent_com_key).data.conclusions
}

const resetConclusionFormData = () => {
    conclusionFormData.key = generateUUID()
    conclusionFormData.title = ""
    conclusionFormData.remark = ""
    conclusionFormData.hasCollector = true
    conclusionFormData.hasStatus = true
    conclusionFormData.hasImages = true
    conclusionFormData.hasRemarks = true
    conclusionFormData.isDefect = false
}

const onClickAction = (type: string, text: string, index) => {
    console.log('onClickAction:', type, text)
    if (type == 'EditOutlined') {
        currentEditConclusionIndexRef.value = index
        onClickEditConclusion()
    } else if (type == 'PlusCircleOutlined') {
        currentEditConclusionIndexRef.value = index
        onClickAddConclusion()
    } else if (type == 'MinusCircleOutlined') {

        Modal.confirm({
            title: 'Delete',
            zIndex: 1001,
            content: 'Are you sure to delete this conclusion?',
            onOk() {
                console.log('OK')
                itemData.value.conclusions.splice(index, 1)
                currentEditConclusionIndexRef.value = null
            },
            onCancel() {
                console.log('Cancel')
            }
        })
    }
}

const onClickAddConclusion = () => {
    isEditConclusionRef.value = false
    isShowConclusionDialogRef.value = true
    resetConclusionFormData()
}

const onClickEditConclusion = () => {
    isEditConclusionRef.value = true
    isShowConclusionDialogRef.value = true
    const conclusion = itemData.value.conclusions[currentEditConclusionIndexRef.value]
    conclusionFormData.title = conclusion.title
    conclusionFormData.remark = conclusion.remark
    conclusionFormData.hasCollector = conclusion.hasCollector
    conclusionFormData.hasStatus = conclusion.hasStatus
    conclusionFormData.hasImages = conclusion.hasImages
    conclusionFormData.hasRemarks = conclusion.hasRemarks
    conclusionFormData.isDefect = conclusion.isDefect
    conclusionFormData.key = conclusion.key
}

const onClickOption = (index: number) => {
    isShowOptionDialogRef.value = true
    currentEditOptionIndexRef.value = index
    optionFormData.label = itemData.value.options[index].label
    optionFormData.value = itemData.value.options[index].value
}

const handleOptionOK = () => {
    itemData.value.options[currentEditOptionIndexRef.value] = newJsonObject(optionFormData)
    isShowOptionDialogRef.value = false
    currentEditOptionIndexRef.value = null
}

const handleConclusionOK = () => {
    if (isEditConclusionRef.value === true) {
        itemData.value.conclusions[currentEditConclusionIndexRef.value] = newJsonObject(conclusionFormData)
    } else {
        if (currentEditConclusionIndexRef.value !== null) {
            itemData.value.conclusions.splice(currentEditConclusionIndexRef.value + 1, 0, newJsonObject(conclusionFormData))
        } else {
            itemData.value.conclusions.push(newJsonObject(conclusionFormData))
        }
    }
    currentEditConclusionIndexRef.value = null
    isShowConclusionDialogRef.value = false
    resetConclusionFormData()
}

// const setFormState = (formState: any) => {
//     console.log('setFormState:', formState.value)
// }




const initializeData = (item: any) => {

    console.log('conclusion.initializeData:', toRaw(item), toRaw(props))
    itemData.value = item
    baseForm.value.initializeData(item)

    itemData.value.languageType = item?.data?.languageType || 'single'
    itemData.value.conclusions = item?.data?.conclusions || []
    itemData.value.parent_key = item?.data?.parent_key || ''
    itemData.value.parent_com_key = item?.data?.parent_com_key || ''

    if (itemData.value.languageType === 'single') {
        itemData.value.options = newJsonObject(singleLanguageOptions)
    } else {
        itemData.value.options = newJsonObject(multipleLanguageOptions)
    }

    conclustionComponents.value = reportTemplateStore.reportTemplate.items.filter(c=>c.type === 'conclusion' && c.key != item.key)
    if(itemData.value.parent_key) {
        conclustionComponentRecords.value = reportTemplateStore.reportTemplate.items.find(c => c.key === itemData.value.parent_com_key).data.conclusions
    }
}
const exportData = () => {
    let baseData = baseForm.value.exportData()
    return {...baseData, ...itemData.value}
}



defineExpose({
    // setFormState,
    initializeData,
    exportData
})
</script>