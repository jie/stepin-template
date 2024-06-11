<template>
    <BaseComponent :title="props.title" ref="baseModal">
        <template #inner>
            <a-form-item label="">
                <a-button type="primary" @click="modelVisible = true">add</a-button>
            </a-form-item>
            <div v-for="item in store.reimRecordItem.items">
                {{ item }}
            </div>
            <a-modal width="100%" wrap-class-name="full-modal" v-model:visible="modelVisible" :title="props.title"
                :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
                <a-form ref="formRef" style="max-width: 600px; margin: 0 auto;" layout="vertical">
                    <a-form-item label="amount">
                        <a-input-number v-model:value="store.reimShoppingPoint.amount" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="product_name">
                        <a-input v-model:value="store.reimShoppingPoint.product_name" />
                    </a-form-item>
                    <a-form-item label="price">
                        <a-input v-model:value="store.reimShoppingPoint.price" />
                    </a-form-item>
                    <a-form-item label="num">
                        <a-input v-model:value="store.reimShoppingPoint.num" />
                    </a-form-item>
                    <a-form-item label="start_at">
                        <a-date-picker v-model:value="store.reimShoppingPoint.start_at" />
                    </a-form-item>
                    <a-form-item label="purpose">
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
import { toRaw, defineProps, ref } from "vue";
import BaseComponent from "./index.vue";
import { ReimRecordStore } from "@/store/record";
import RemoteSelect from '@/components/remote_select/index.vue';
const orderSelectRef = ref<any>(null);
const baseModal = ref<any>(null);
const modelVisible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const editIndexRef = ref(null)
const props = defineProps({
    formValues: {
        type: Object,
    },
    title: {
        type: String,
        default: ''
    }
})
const store = ReimRecordStore();

const dateRange = ref([store.reimMealPoint.start_at, store.reimMealPoint.end_at])
const toggleModal = (item:any) => {
    baseModal.value.toggleModal(item)
}

const handleCancel = () => {
    modelVisible.value = false
}

const handleOk = () => {
    store.reimRecordItem.items.push({ ...store.reimMealPoint })
    confirmLoading.value = true
    setTimeout(() => {
        confirmLoading.value = false
        modelVisible.value = false
        store.resetItem('shopping')
    }, 2000)
}

defineExpose({ toggleModal })
</script>