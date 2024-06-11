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
                        <RemoteSelect ref="orderSelectRef" type="order" v-model:value="store.reimMealPoint.order"
                            searchKey="name" display_key="order_no" v-on:updateSelected="onUpdateOrderSelect" />
                    </a-form-item>
                    <a-form-item label="factory_name" v-bind="validateInfos.factory_name">
                        <a-input v-model:value="store.reimMealPoint.factory_name" />
                    </a-form-item>
                    <a-form-item label="amount" v-bind="validateInfos.amount">
                        <a-input-number v-model:value="store.reimMealPoint.amount" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="time" v-bind="validateInfos.start_at">
                        <a-date-picker v-model:value="store.reimMealPoint.start_at" format="YYYY-MM-DD"
                            style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="meal_criteria" v-bind="validateInfos.meal_criteria">
                        <a-input v-model:value="store.reimMealPoint.meal_criteria" />
                    </a-form-item>
                    <a-form-item label="remark">
                        <a-textarea v-model:value="store.reimMealPoint.remark" />
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
    meal_criteria: [
        {
            required: true,
            message: 'Please select meal_criteria',
        },
    ],
    factory_name: [
        {
            required: true,
            message: 'Please select factory_name',
        },
    ],
});
const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(store.reimMealPoint, rulesRef);
const errorInfos = computed(() => {
    return mergeValidateInfo(toArray(validateInfos));
});


const toggleModal = (item: any) => {
    baseModal.value.toggleModal(item)
}

const afterClose = () => {
    console.log('afterClose')
    store.resetItem('meal')
}

const handleCancel = () => {
    modelVisible.value = false

}

const handleOk = () => {
    console.log('store.reimMealPoint:', toRaw(store.reimMealPoint))
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
                store.reimRecordItem.items[editIndexRef.value] = { ...store.reimMealPoint }
                editIndexRef.value = null
            } else {
                store.reimRecordItem.items.push({ ...store.reimMealPoint })
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
        store.reimMealPoint.order = selected[0].id
        store.reimMealPoint.factory_name = selected[0].factory_name
        store.reimMealPoint.start_at = dayjs(selected[0].inspect_date)
    }
}

const onEdit = (index: number) => {
    editIndexRef.value = index
    store.reimMealPoint.order = store.reimRecordItem.items[index].order
    store.reimMealPoint.amount = store.reimRecordItem.items[index].amount
    store.reimMealPoint.meal_criteria = store.reimRecordItem.items[index].meal_criteria
    store.reimMealPoint.start_at = store.reimRecordItem.items[index].start_at
    store.reimMealPoint.end_location = store.reimRecordItem.items[index].end_location
    store.reimMealPoint.remark = store.reimRecordItem.items[index].remark
    store.reimMealPoint.factory_name = store.reimRecordItem.items[index].factory_name
    modelVisible.value = true
}
const onDelete = (index: number) => {
    store.reimRecordItem.items.splice(index, 1)
}

defineExpose({ toggleModal })
</script>