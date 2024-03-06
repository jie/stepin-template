<template>
    <div>
        <BaseSlot :item="props?.item">
            <a-checkbox-group v-model:value="itemValue" :options="props?.item?.data?.options" />
        </BaseSlot>
    </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineProps, ref, PropType } from 'vue'
const props = defineProps({
    item: {
        type: Object,
    }
})

type Option = {
    label: string;
    value: string;
}

const itemValue = ref<Option[]>([])

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