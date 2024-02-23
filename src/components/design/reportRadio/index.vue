<template>
    <div>
        <BaseSlot :item="props?.item">
            <a-radio-group v-model:value="itemValue" :options="props?.item?.data?.options" />
        </BaseSlot>
    </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineProps, ref, PropType } from 'vue'
import { ReportTemplateStore } from "@/store/reportTemplate"
const reportTemplateStore = ReportTemplateStore()
const props = defineProps({
    item: {
        type: Object,
    }
})

type Option = {
    label: string;
    value: string;
}

const itemValue = ref<Option[]>([])

const exportData = () => {
  return reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key)
}

const exportValue = () => {
    return itemValue.value
}
defineExpose({
    props,
    itemValue,
    exportValue,
    exportData
})
</script>