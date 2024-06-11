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
                                <div>[{{ item?.dateRange[0]?.format('YYYY-MM-DD') }} ~ {{ item?.dateRange[1]?.format('YYYY-MM-DD') }}] {{ item.factory_name }}, hours: {{ item.overtime_hours }}</div>
                            </div>
                        </a-list-item>
                    </template>
                </a-list>
            </a-form-item>
            <a-modal width="100%" wrap-class-name="full-modal" v-model:visible="modelVisible" :title="props.title"
                :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel" :afterClose="afterClose">
                <a-form ref="formRef" style="max-width: 600px; margin: 0 auto;" layout="vertical"
                    :validateOnRuleChange="true" :scrollToFirstError="true">
                    <a-form-item label="order">
                        <RemoteSelect ref="orderSelectRef" type="order" v-model:value="store.reimOvertimePoint.order"
                            searchKey="name" display_key="order_no" v-on:updateSelected="onUpdateOrderSelect" />
                    </a-form-item>
                    <a-form-item label="amount" v-bind="validateInfos.amount">
                        <a-input-number v-model:value="store.reimOvertimePoint.amount" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="dateRange" v-bind="validateInfos.dateRange">
                        <a-range-picker v-model:value="store.reimOvertimePoint.dateRange" format="YYYY-MM-DD"
                            style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="overtime_criteria" v-bind="validateInfos.overtime_criteria">
                        <a-input v-model:value="store.reimOvertimePoint.overtime_criteria" />
                    </a-form-item>
                    <a-form-item label="overtime_hours" v-bind="validateInfos.overtime_hours">
                        <a-input v-model:value="store.reimOvertimePoint.overtime_hours" />
                    </a-form-item>
                    <a-form-item label="factory_name" v-bind="validateInfos.factory_name">
                        <a-input v-model:value="store.reimOvertimePoint.factory_name" />
                    </a-form-item>
                    <a-form-item label="remark">
                        <a-textarea v-model:value="store.reimOvertimePoint.remark" />
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
    dateRange: [
        {
            required: true,
            message: 'Please select dateRange',
        },
    ],
    overtime_criteria: [
        {
            required: true,
            message: 'Please enter overtime_criteria',
        },
        {
            min: 1,
            message: 'Please enter end_location',
        },
    ],
    overtime_hours: [
        {
            required: true,
            message: 'Please enter overtime_hours',
        }
    ],
    factory_name: [
        {
            required: true,
            message: 'Please enter factory_name',
        }
    ],
});
const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(store.reimOvertimePoint, rulesRef);
const errorInfos = computed(() => {
    return mergeValidateInfo(toArray(validateInfos));
});

const toggleModal = (item: any) => {
    baseModal.value.toggleModal(item)
}

const afterClose = () => {
    console.log('afterClose')
    store.resetItem('overtime')
}

const handleCancel = () => {
    modelVisible.value = false

}

const handleOk = () => {
    console.log('store.reimOvertimePoint:', toRaw(store.reimOvertimePoint))
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
                store.reimRecordItem.items[editIndexRef.value] = { ...store.reimOvertimePoint }
                editIndexRef.value = null
            } else {
                store.reimRecordItem.items.push({ ...store.reimOvertimePoint })
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


const onUpdateOrderSelect = (selected: any) => {
    if (selected && selected.length > 0) {
        store.reimOvertimePoint.order = selected[0].id
        store.reimOvertimePoint.factory_name = selected[0].factory_name
        store.reimOvertimePoint.dateRange = [dayjs(selected[0].inspect_date), dayjs(selected[0].inspect_date)]
    }
}

const onEdit = (index: number) => {
    editIndexRef.value = index
    store.reimOvertimePoint.order = store.reimRecordItem.items[index].order
    store.reimOvertimePoint.amount = store.reimRecordItem.items[index].amount
    store.reimOvertimePoint.factory_name = store.reimRecordItem.items[index].factory_name
    store.reimOvertimePoint.overtime_criteria = store.reimRecordItem.items[index].overtime_criteria
    store.reimOvertimePoint.overtime_hours = store.reimRecordItem.items[index].overtime_hours
    store.reimOvertimePoint.remark = store.reimRecordItem.items[index].remark
    store.reimOvertimePoint.dateRange = [...store.reimRecordItem.items[index].dateRange]
    modelVisible.value = true
}
const onDelete = (index: number) => {
    store.reimRecordItem.items.splice(index, 1)
}

defineExpose({ toggleModal })
</script>