<template>
    <div>
        <BaseSlot :item="props.item">
            <a-input v-model:value="itemValue"></a-input>
        </BaseSlot>
    </div>

</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import {ref} from "vue"
import { ReportTemplateStore } from "@/store/reportTemplate"
const reportTemplateStore = ReportTemplateStore()
const props = defineProps({
    item: {
        type: Object,        
    }
})

const itemValue = ref("")

const exportData = () => {
  return {
    ...props.item,
    data: {
      value: itemValue.value
    }
  }
//   return reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key)
}

const exportValue = () => {
    return {value: itemValue.value}
}

const refreshValue = (data: any) => {
    console.log('refreshValue:', data)
    itemValue.value = data.value
    console.log('itemValue:', itemValue.value)
}

defineExpose({
    props,
    itemValue,
    exportValue,
    exportData,
    refreshValue
})
</script>