<template>
    <div>
        <BaseSlot :item="props?.item">
            <a-radio-group :required="props?.item?.data?.required" v-model:value="props.value" :options="props?.item?.data?.options" @change="onChange" v-if="props?.item?.layout == 'horizontal '"/>
            <a-radio-group :required="props?.item?.data?.required" v-model:value="props.value" @change="onChange" v-else>
                <a-radio :style="radioStyle" :value="option.value" v-for="option in props?.item?.data?.options">{{option.label}}</a-radio>
            </a-radio-group>
        </BaseSlot>
    </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineProps, ref, PropType, toRaw, reactive } from 'vue'
const props = defineProps({
    item: {
        type: Object,
    },
    value: {
        type: String,
        default: ""
    }
})

type Option = {
    label: string;
    value: string;
}
const radioStyle = reactive({
      display: 'flex',
      height: '30px',
      lineHeight: '30px',
    });
const itemValue = ref<string>('')
const emits = defineEmits(["update:value"])
// const exportData = () => {
//   return reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key)
// }

const onChange = (e) => {
    emits('update:value', e.target.value)
}

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