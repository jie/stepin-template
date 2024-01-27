<template>
    <div>
        <div> edit {{ props.item.title }}</div>
        <div>
            <a-radio-group v-model:value="checkedOption" :options="options" />
        </div>
    </div>

</template>
<script lang="ts" setup>
import { defineProps, ref, PropType } from 'vue'
const props = defineProps({
    item: {
        type: Object,
    },
    options: {
        type: [Array] as PropType<Option[]>,
    }
})

const defaultOptions = [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' }
]

type Option = {
    label: string;
    value: string;
}

const options = ref<Option[]>([])
const checkedOption = ref<Option>()

const initialize = () => {
    options.value = props.options || defaultOptions
    checkedOption.value = props.item.value || ""
}

initialize()
</script>