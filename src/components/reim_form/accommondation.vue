<template>
    <BaseComponent :title="props.title" :props-values="store.reimAccommondationPoint" ref="baseModal">
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
                    <a-form-item label="order">
                        <RemoteSelect ref="orderSelectRef" type="order" v-model:value="store.reimAccommondationPoint.order"
                            searchKey="name" display_key="order_no" v-on:updateSelected="onUpdateOrderSelect" />
                    </a-form-item>
                    <a-form-item label="amount">
                        <a-input-number v-model:value="store.reimAccommondationPoint.amount" style="width: 100%;"/>
                    </a-form-item>
                    <a-form-item label="time">
                        <a-range-picker v-model:value="dateRange" format="YYYY-MM-DD" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="factory_name">
                        <a-input v-model:value="store.reimAccommondationPoint.factory_name" />
                    </a-form-item>
                    <a-form-item label="people_num">
                        <a-input v-model:value="store.reimAccommondationPoint.people_num" />
                    </a-form-item>
                    <a-form-item label="hotel_name">
                        <a-input v-model:value="store.reimAccommondationPoint.hotel_name" />
                    </a-form-item>
                    <a-form-item label="location">
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
import { toRaw, defineProps, ref } from "vue";
import BaseComponent from "./index.vue";
import RemoteSelect from '@/components/remote_select/index.vue';
import { ReimRecordStore } from "@/store/record";
import { i18n } from '@/lang/i18n';
import dayjs from 'dayjs';
const modelVisible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const baseModal = ref<any>(null);
const orderSelectRef = ref<any>(null);
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
const dateRange = ref([store.reimAccommondationPoint.start_at, store.reimAccommondationPoint.end_at])
const toggleModal = (item:any) => {
    baseModal.value.toggleModal(item)
}
const handleCancel = () => {
    modelVisible.value = false
}

const handleOk = () => {
    store.reimRecordItem.items.push({ ...store.reimAccommondationPoint })
    confirmLoading.value = true
    setTimeout(() => {
        confirmLoading.value = false
        modelVisible.value = false
        store.resetItem('accommondation')
    }, 2000)
}

const onUpdateOrderSelect = (selected: any) => {
    if (selected && selected.length > 0) {
        store.reimAccommondationPoint.order = selected[0].id
        store.reimAccommondationPoint.start_at = dayjs(selected[0].inspect_date)
        store.reimAccommondationPoint.end_at = dayjs(selected[0].inspect_date)
        store.reimAccommondationPoint.factory_name = selected[0].factory_name
        if(selected[0].address?.country?.code == '1') {
            store.reimAccommondationPoint.start_location = selected[0].address?.province?.name + ' ' + selected[0].address?.city?.name
        } else {
            store.reimAccommondationPoint.start_location = selected[0].address?.country?.name
        }
    }
}

defineExpose({ toggleModal })
</script>