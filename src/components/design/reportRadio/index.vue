<template>
    <div>
        <BaseSlot :item="props?.item">
            <a-radio-group v-model:value="itemValue" :options="props?.item?.data?.options" />
        </BaseSlot>
    </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineProps, ref, PropType, toRaw } from 'vue'
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

// const exportData = () => {
//   return reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key)
// }

const exportData = () => {
    console.log('radio-export:', toRaw(props.item))
  return {
    ...props.item,
    data: {value: itemValue.value, options: props?.item?.data?.options}
  }
}


const exportValue = () => {
    return {value: itemValue.value, options: props?.item?.data?.options}
}

const refreshValue = (data: any) => {
    itemValue.value = data.value

}

defineExpose({
    props,
    itemValue,
    exportValue,
    exportData,
    refreshValue
})
</script>