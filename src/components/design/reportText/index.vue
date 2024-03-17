<template>
    <div>
        <div v-if="props?.item?.data?.text" :style="{fontSize: `${props?.item?.data?.font_size || '13'}px`, fontWeight: `${props?.item?.data?.is_bold ? 'bold': 'normal'}`, textAlign:`${props?.item?.data?.alignment}`}" v-html="computedText"></div>
        <a-empty v-else>{{ $t('base.Text') }}</a-empty>
    </div>

</template>
<script lang="ts" setup>
import {toRaw, computed} from 'vue'
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


const computedText = computed(() => {
    let text = props?.item?.data?.text
    if(text) {
        return text.replace(/\n/g, '<br />')
    } else {
        return text
    }
})


const refreshValue = (data: any) => {
    console.log('data:', toRaw(data))
}


defineExpose({
    props,
    exportData,refreshValue
})
</script>