<template>
    <div>
        <BaseSlot :item="props?.item">
            <a-radio-group v-model:value="props.value.value"
                :options="props?.item?.data?.options" @change="onChange" v-if="props?.item?.layout == 'horizontal '" />
            <a-radio-group v-model:value="props.value.value" @change="onChange" v-else>
                <a-radio :style="radioStyle" :value="option.value"
                    v-for="option in props?.item?.data?.options">{{ option.label }}</a-radio>
            </a-radio-group>
            <div v-if="props?.item?.hasResult" style="margin-top:10px;">
                <p v-if="props.value.result">{{ props.value.result }}</p>
            </div>
            <div v-if="props?.item?.hasRemark" style="margin-top:10px;">
                <p v-if="props.value.remark">{{ props.value.remark }}</p>
            </div>
        </BaseSlot>

    </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineProps, ref, PropType, toRaw, reactive } from 'vue'



interface RadioValueType {
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
        type: Object as PropType<RadioValueType>,
        default: { value: '', options: [], result: '', remark: '' }
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


const onChange = (e) => {
    emits('update:value', exportValue())
}


const exportData = () => {
    console.log('radio-export:', toRaw(props.item))
    return {
        ...props.item,
        data: { value: props.value.value, options: props?.item?.data?.options, result: props.value.result, remark: props.value.remark }
    }
}


const exportValue = () => {
    return { value: props.value.value, options: props?.item?.data?.options, result: props.value.result, remark: props.value.remark }
}

const refreshValue = (data: any) => {
    console.log('data:', toRaw(data))
}

defineExpose({
    props,
    itemValue,
    exportValue,
    exportData,
    refreshValue
})
</script>