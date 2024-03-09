<template>
    <div>
        <BaseSlot :item="props?.item">
            <a-form-item :label="props?.item?.data?.label" :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}`, trigger: 'change' }]">
                <a-checkbox-group v-model:value="props.value" :options="props?.item?.data?.options" @change="onChange" v-if="props?.item?.layout == 'horizontal'" />
                <a-checkbox-group v-else v-model:value="props.value" @change="onChange">
                    <a-checkbox :style="checkboxStyle" :value="option.value" v-for="option in props?.item?.data?.options">{{option.label}}</a-checkbox>
                </a-checkbox-group>
            </a-form-item>
        </BaseSlot>
    </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineProps, ref, PropType, reactive } from 'vue'
const props = defineProps({
    item: {
        type: Object,
    },
    value: {
        type: Array as PropType<string[]>,
        default: []
    }
})

type Option = {
    label: string;
    value: string;
}

const checkboxStyle = reactive({
    display: 'flex',
    height: '30px',
    lineHeight: '30px',
    marginLeft: '0px'
})

const emits = defineEmits(["update:value"])

const itemValue = ref<Option[]>([])

const onChange = (e) => {
    console.log(e)
    emits('update:value', e)
}

const exportData = () => {
  const data = {
        ...props.item,
        data: {
            options: props?.item?.data?.options,
            value: itemValue.value
        }
    }
  return data
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