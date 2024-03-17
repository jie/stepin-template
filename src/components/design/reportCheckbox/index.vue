<template>
    <div>
        <BaseSlot :item="props?.item">
            <a-form-item :label="props?.item?.data?.label" :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}`, trigger: 'change' }]">
                <a-checkbox-group v-model:value="props.value.value" :options="props?.item?.data?.options" @change="onChange" v-if="props?.item?.layout == 'horizontal'" />
                <a-checkbox-group v-else v-model:value="props.value.value" @change="onChange">
                    <a-checkbox :style="checkboxStyle" :value="option.value" v-for="option in props?.item?.data?.options">{{option.label}}</a-checkbox>
                </a-checkbox-group>
            </a-form-item>
            <div v-if="props?.item?.hasResult" style="margin-top:10px;">
                <a-input v-model:value="props.value.result" @change="onChange" :placeholder="$t('base.PleaseEnterResult')" />
            </div>
            <div v-if="props?.item?.hasRemark" style="margin-top:10px;">
                <a-textarea v-model:value="props.value.remark" @change="onChange" :placeholder="$t('base.PleaseEnterRemark')"/>
            </div>
        </BaseSlot>
    </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineProps, ref, PropType, reactive } from 'vue'

interface CheckboxValueType {
    value?: string;
    options?: Option[];
    result?: string;
    remark?: string;
}
const props = defineProps({
    item: {
        type: Object,
    },
    value: {
        type: Array as PropType<CheckboxValueType[]>,
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
    emits('update:value', exportValue())
}

// const exportData = () => {
//   const data = {
//         ...props.item,
//         data: {
//             options: props?.item?.data?.options,
//             value: .value
//         }
//     }
//   return data
// }
// const exportValue = () => {
//     return {value: itemValue.value, options: props?.item?.data?.options}
// }


const exportData = () => {
    return {
        ...props.item,
        data: { value: props.value.value, options: props?.item?.data?.options, result: props.value.result, remark: props.value.remark }
    }
}


const exportValue = () => {
    return { value: props.value.value, options: props?.item?.data?.options, result: props.value.result, remark: props.value.remark }
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