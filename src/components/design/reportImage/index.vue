<template>
    <div>
        <BaseSlot :item="props?.item">
            <div v-if="props?.item?.data?.images && props?.item?.data?.images.length != 0">
                <a-image-preview-group v-if="props?.item?.data?.isFullWidth">
                    <a-image width="100%" :src="item.url" v-for="item in props?.item?.data?.images" style="border: 1px solid #999"/>
                </a-image-preview-group>
                <a-image-preview-group v-else-if="props?.item?.data?.columns != 1">
                    <a-image :width="`${100/props?.item?.data?.columns}%`" :src="item.url" v-for="item in props?.item?.data?.images" style="padding-right: 10px; padding-bottom: 10px"/>
                </a-image-preview-group>
                <a-image-preview-group v-else>
                    <a-image :width="props?.item?.data?.width" :src="item.url" v-for="item in props?.item?.data?.images" style="border: 1px solid #999"/>
                </a-image-preview-group>
            </div>
            <div v-else>
                <a-empty />
            </div>

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
    },
})

const exportData = () => {
  return reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key)
}

const exportValue = () => {
    return props.item.value
}


defineExpose({
    props,
    exportData
})
</script>