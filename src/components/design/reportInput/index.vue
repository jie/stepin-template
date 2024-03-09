<template>
    <div>
        <a-form-item :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}`, type:'string' }]" :label="props?.item?.title" :extra="props?.item?.summary" :required="props?.item?.required" :name="props?.item?.key">
            <a-auto-complete
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                v-if="props.item?.is_defect"
                v-model:value="props.value"
                style="width: 100%"
                placeholder="input here"
                :options="defectOptions"
                @change="onDefectChange"
                @search="handleSearchDefect"
                allowClear

            >
                <template #option="{ content_en: content_en, id: id }">
                <div style="display:flex" @click="onDefectSelect(id)">
                    <span style="flex: 1">{{ content_en }}</span>
                    <span style="font-weight: bold; width: 150px;">{{ content_en }}</span>
                </div>
                </template>
            </a-auto-complete>
            <a-input v-model:value="props.value" @change="onChange" allowClear v-else></a-input>
        </a-form-item>
    </div>

</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import {ref, toRaw} from "vue"
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
const defectOptions = ref([])
const handleSearchDefect = (value) => {
    defectOptions.value = value ? store.defects.filter((s) => s.content_en.toLowerCase().includes(value.toLowerCase())) : []
}
const onDefectSelect = (e) => {
    emits('update:value', store.defects.find((s) => s.id == e).content_en)
}
const onDefectChange = (e) => {
    emits('update:value', e)
}

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