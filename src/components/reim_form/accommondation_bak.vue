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
                                        <a href="#">{{ item.trans_type }}</a>
                                    </template>
                                    <template #avatar>
                                        <dollar-circle-outlined style="font-size: 32px;" />
                                    </template>
                                </a-list-item-meta>
                                <!-- <div>expense: {{ item.amount }}, start_at: {{ item?.dateRange[0]?.format('YYYY-MM-DD HH:mm') }},
                    end_at: {{ item?.dateRange[1]?.format('YYYY-MM-DD HH:mm') }}</div> -->
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
                        <RemoteSelect ref="orderSelectRef" type="order" v-model:value="store.reimAccommondationPoint.order"
                            searchKey="name" display_key="order_no" v-on:updateSelected="onUpdateOrderSelect" />
                    </a-form-item>
                    <a-form-item label="amount" v-bind="validateInfos.amount">
                        <a-input-number v-model:value="store.reimAccommondationPoint.amount" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="time" v-bind="validateInfos.dateRange">
                        <a-range-picker v-model:value="store.reimAccommondationPoint.dateRange" format="YYYY-MM-DD" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="factory_name" v-bind="validateInfos.factory_name">
                        <a-input v-model:value="store.reimAccommondationPoint.factory_name" />
                    </a-form-item>
                    <a-form-item label="people_num" v-bind="validateInfos.people_num">
                        <a-input v-model:value="store.reimAccommondationPoint.people_num" />
                    </a-form-item>
                    <a-form-item label="hotel_name" v-bind="validateInfos.hotel_name">
                        <a-input v-model:value="store.reimAccommondationPoint.hotel_name" />
                    </a-form-item>
                    <a-form-item label="location" v-bind="validateInfos.start_location">
                        <a-textarea v-model:value="store.reimAccommondationPoint.start_location" />
                    </a-form-item>
                    <a-form-item label="remark">
                        <a-textarea v-model:value="store.reimAccommondationPoint.remark" />
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
const driverRules = {
    gas_criteria: [
        {
            required: true,
            message: 'Please select gas_criteria',
            type: 'array',
        },
    ],
    distance: [
        {
            required: true,
            message: 'Please select distance',
            type: 'array',
        },
    ],
}
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
    start_location: [
        {
            required: true,
            message: 'Please enter start_location',
        },
        {
            min: 1,
            message: 'Please enter start_location',
        },
    ],
    factory_name: [
        {
            required: true,
            message: 'Please enter factory_name',
        },
        {
            min: 1,
            message: 'Please enter factory_name',
        },
    ],
    people_num: [
        {
            required: true,
            message: 'Please enter people_num',
        },
    ],
    hotel_name: [
        {
            required: true,
            message: 'Please enter hotel_name',
        },
    ],
});
// const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(store.reimAccommondationPoint, rulesRef, {
//   onValidate: (...args) => {console.log('onValidate:', ...args); console.log('store:', toRaw(store.reimAccommondationPoint))},
// });
const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(store.reimAccommondationPoint, rulesRef);
const errorInfos = computed(() => {
    return mergeValidateInfo(toArray(validateInfos));
});



const toggleModal = (item: any) => {
    baseModal.value.toggleModal(item)
}

const afterClose = () => {
    console.log('afterClose')
    store.resetItem('accommondation')
}

const handleCancel = () => {
    modelVisible.value = false

}

const handleOk = () => {
    console.log('store.reimAccommondationPoint:', toRaw(store.reimAccommondationPoint))
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
                store.reimRecordItem.items[editIndexRef.value] = { ...store.reimAccommondationPoint }
                editIndexRef.value = null
            } else {
                store.reimRecordItem.items.push({ ...store.reimAccommondationPoint })
            }
            store.reimRecordItem.items.push({ ...store.reimAccommondationPoint })
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
        store.reimAccommondationPoint.order = selected[0].id
        store.reimAccommondationPoint.factory_name = selected[0].factory_name
        store.reimAccommondationPoint.dateRange = [dayjs(selected[0].inspect_date), dayjs(selected[0].inspect_date)]
    }
}

const onEdit = (index: number) => {
    editIndexRef.value = index
    store.reimAccommondationPoint.order = store.reimRecordItem.items[index].order
    store.reimAccommondationPoint.amount = store.reimRecordItem.items[index].amount
    store.reimAccommondationPoint.start_location = store.reimRecordItem.items[index].start_location
    store.reimAccommondationPoint.factory_name = store.reimRecordItem.items[index].factory_name
    store.reimAccommondationPoint.hotel_name = store.reimRecordItem.items[index].hotel_name
    store.reimAccommondationPoint.people_num = store.reimRecordItem.items[index].people_num
    store.reimAccommondationPoint.remark = store.reimRecordItem.items[index].remark
    store.reimAccommondationPoint.dateRange = [...store.reimRecordItem.items[index].dateRange]
    modelVisible.value = true
}
const onDelete = (index: number) => {
    store.reimRecordItem.items.splice(index, 1)
}

defineExpose({ toggleModal })
</script>