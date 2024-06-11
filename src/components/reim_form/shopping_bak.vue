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
                    <a-form-item label="amount" v-bind="validateInfos.amount">
                        <a-input-number v-model:value="store.reimShoppingPoint.amount" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="product_name"  v-bind="validateInfos.product_name">
                        <a-input v-model:value="store.reimShoppingPoint.product_name" />
                    </a-form-item>
                    <a-form-item label="price" v-bind="validateInfos.price">
                        <a-input v-model:value="store.reimShoppingPoint.price" />
                    </a-form-item>
                    <a-form-item label="num" v-bind="validateInfos.num">
                        <a-input v-model:value="store.reimShoppingPoint.num" />
                    </a-form-item>
                    <a-form-item label="start_at" v-bind="validateInfos.start_at">
                        <a-date-picker v-model:value="store.reimShoppingPoint.start_at" />
                    </a-form-item>
                    <a-form-item label="purpose" v-bind="validateInfos.purpose">
                        <a-textarea v-model:value="store.reimShoppingPoint.purpose" />
                    </a-form-item>
                    <a-form-item label="remark">
                        <a-textarea v-model:value="store.reimShoppingPoint.remark" />
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
    product_name: [
        {
            required: true,
            message: 'Please select product_name',
        },
    ],
    price: [
        {
            required: true,
            message: 'Please select price',
        },
    ],
    num: [
        {
            required: true,
            message: 'Please select num',
        },
    ],
    purpose: [
        {
            required: true,
            message: 'Please select purpose',
        },
    ]
});
// const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(store.reimShoppingPoint, rulesRef, {
//   onValidate: (...args) => {console.log('onValidate:', ...args); console.log('store:', toRaw(store.reimShoppingPoint))},
// });
const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(store.reimShoppingPoint, rulesRef);
const errorInfos = computed(() => {
    return mergeValidateInfo(toArray(validateInfos));
});

const toggleModal = (item: any) => {
    baseModal.value.toggleModal(item)
}

const afterClose = () => {
    console.log('afterClose')
    store.resetItem('shopping')
}

const handleCancel = () => {
    modelVisible.value = false

}

const handleOk = () => {
    console.log('store.reimShoppingPoint:', toRaw(store.reimShoppingPoint))
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
                store.reimRecordItem.items[editIndexRef.value] = { ...store.reimShoppingPoint }
                editIndexRef.value = null
            } else {
                store.reimRecordItem.items.push({ ...store.reimShoppingPoint })
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
    store.reimShoppingPoint.order = store.reimRecordItem.items[index].order
    store.reimShoppingPoint.amount = store.reimRecordItem.items[index].amount
    store.reimShoppingPoint.product_name = store.reimRecordItem.items[index].product_name
    store.reimShoppingPoint.price = store.reimRecordItem.items[index].price
    store.reimShoppingPoint.num = store.reimRecordItem.items[index].num
    store.reimShoppingPoint.purpose = store.reimRecordItem.items[index].purpose
    store.reimShoppingPoint.remark = store.reimRecordItem.items[index].remark
    store.reimShoppingPoint.start_at = store.reimRecordItem.items[index].start_at
    modelVisible.value = true
}
const onDelete = (index: number) => {
    store.reimRecordItem.items.splice(index, 1)
}

defineExpose({ toggleModal })
</script>