<template>
    <BaseComponent :title="props.title" ref="baseModal">
        <template #inner>
            <a-form-item label="">
                <a-list class="demo-loadmore-list" item-layout="horizontal" :data-source="store.reimRecordItem.items">
                    <template #header>
                        <div :style="{ textAlign: 'left', height: '32px', lineHeight: '32px' }">
                            <a-button @click="modelVisible = true">Add transportation</a-button>
                        </div>
                    </template>
                    <template #renderItem="{ item, index }">
                        <a-list-item>
                            <template #actions>
                                <edit-outlined key="edit" @click="onEdit(index)" />
                                <delete-outlined key="delete" @click="onDelete(index)" />
                            </template>
                            <div>
                                <a-list-item-meta :description="item.remark">
                                    <template #title>
                                        <a href="#">{{ item.amount }}</a>
                                    </template>
                                    <template #avatar>
                                        <dollar-circle-outlined style="font-size: 32px;" />
                                    </template>
                                </a-list-item-meta>
                                <div>[{{ item?.start_at?.format('YYYY-MM-DD') }}]</div>
                            </div>
                        </a-list-item>
                    </template>
                </a-list>
            </a-form-item>
            <a-modal width="100%" wrap-class-name="full-modal" v-model:visible="modelVisible" :title="props.title"
                :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel" :afterClose="afterClose">
                <a-form ref="formRef" style="max-width: 600px; margin: 0 auto;" layout="vertical"
                    :validateOnRuleChange="true" :scrollToFirstError="true">
                    <a-form-item label="amount" v-bind="validateInfos.amount">
                        <a-input-number v-model:value="store.reimOtherPoint.amount" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="start_at" v-bind="validateInfos.start_at">
                        <a-date-picker v-model:value="store.reimOtherPoint.start_at" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="remark">
                        <a-textarea v-model:value="store.reimOtherPoint.remark" />
                    </a-form-item>
                </a-form>
            </a-modal>

        </template>
    </BaseComponent>
</template>
<script lang="ts" setup>
import { toRaw, defineProps, ref, reactive, computed } from "vue";
import { toArray } from 'lodash-es';
import BaseComponent from "./index.vue";
import { ReimRecordStore } from "@/store/record";
import RemoteSelect from '@/components/remote_select/index.vue';
import { i18n } from '@/lang/i18n';
import dayjs from 'dayjs';
import { Form } from 'ant-design-vue';
const useForm = Form.useForm;
const orderSelectRef = ref<any>(null);
const baseModal = ref<any>(null);
const modelVisible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const editIndexRef = ref(null)
const props = defineProps({
    expense_type_id: {
        type: String,
    },
    title: {
        type: String,
        default: ''
    }
})

const store = ReimRecordStore();
const rulesRef = reactive({
    amount: [
        {
            required: true,
            message: 'Please input amount',
        },
        {
            type: 'number',
            message: 'Please input amount as number',
        },
    ],
    start_at: [
        {
            required: true,
            message: 'Please select start_at',
        },
    ],
});
const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(store.reimOtherPoint, rulesRef);
const errorInfos = computed(() => {
    return mergeValidateInfo(toArray(validateInfos));
});


const toggleModal = (item: any) => {
    baseModal.value.toggleModal(item)
}

const afterClose = () => {
    console.log('afterClose')
    store.resetItem('other')
}

const handleCancel = () => {
    modelVisible.value = false

}

const handleOk = () => {
    console.log('store.reimOtherPoint:', toRaw(store.reimOtherPoint))
    validate()
        .then((result) => {
            console.log('result:', result)

            let hasError = false

            for (let item of toArray(validateInfos)) {
                console.log('key:', item)
                // if(validateInfos[key].errors.length > 0) {
                //   hasError = true
                //   break
                // }
            }
            if(editIndexRef.value !== null) {
                store.reimRecordItem.items[editIndexRef.value] = { ...store.reimOtherPoint }
                editIndexRef.value = null
            } else {
                store.reimRecordItem.items.push({ ...store.reimOtherPoint })
            }
            confirmLoading.value = true
            setTimeout(() => {
                confirmLoading.value = false
                modelVisible.value = false
            }, 2000)

        })
        .catch(err => {
            console.log('error', err);
        });
}



const onEdit = (index: number) => {
    editIndexRef.value = index
    store.reimOtherPoint.amount = store.reimRecordItem.items[index].amount
    store.reimOtherPoint.start_at = store.reimRecordItem.items[index].start_at
    store.reimOtherPoint.remark = store.reimRecordItem.items[index].remark
    modelVisible.value = true
}
const onDelete = (index: number) => {
    store.reimRecordItem.items.splice(index, 1)
}

defineExpose({ toggleModal })
</script>