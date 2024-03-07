<template>
    <div>
        <a-form-item :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}`, type:'string' }]" :label="props?.item?.title" :extra="props?.item?.summary" :required="props?.item?.required" :name="props?.item?.key">
            <a-input v-model:value="props.value" @change="onChange" clearable></a-input>
        </a-form-item>
    </div>

</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import {ref} from "vue"
import { ReportFillStore } from "@/store/report_fill"
const store = ReportFillStore()
const props = defineProps({
    item: {
        type: Object,        
    },
    value: {
        type: String,
        default: ""
    }
})

const itemValue = ref("")
const emits = defineEmits(["update:value"])
const exportData = () => {
  return {
    ...props.item,
    data: {
      value: itemValue.value
    }
  }
//   return reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key)
}

const onChange = (e) => {
    emits('update:value', e.target.value)
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