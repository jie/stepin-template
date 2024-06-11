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
                        <a-input-number v-model:value="store.reimOtherPoint.amount" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="date">
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
import { toRaw, defineProps, ref } from "vue";
import BaseComponent from "./index.vue";
import { ReimRecordStore } from "@/store/record";
import RemoteSelect from '@/components/remote_select/index.vue';
const orderSelectRef = ref<any>(null);
const baseModal = ref<any>(null);
const modelVisible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
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

const toggleModal = (item:any) => {
    baseModal.value.toggleModal(item)
}

const handleCancel = () => {
    modelVisible.value = false
}

const handleOk = () => {
    store.reimRecordItem.items.push({ ...store.reimOtherPoint })
    confirmLoading.value = true
    setTimeout(() => {
        confirmLoading.value = false
        modelVisible.value = false
        store.resetItem('other')
    }, 2000)
}

defineExpose({ toggleModal })
</script>