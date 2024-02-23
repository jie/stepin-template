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