<template>
    <div>
        <div>{{ props?.item?.title }}</div>
        <div>{{ props?.item?.desc }}</div>
    </div>

</template>
<script lang="ts" setup>
import { ReportTemplateStore } from "@/store/reportTemplate"
const reportTemplateStore = ReportTemplateStore()
const props = defineProps({
    item: {
        type: Object,
    }
})

const exportData = () => {
  return props.item
}

defineExpose({
    props,
    exportData
})
</script>