<template>
    <div>
        <div>{{ props?.item?.title }}</div>
        <div>
            <a-checkbox-group v-model:value="checkedList" :options="props?.item?.data?.options" />
        </div>
    </div>
</template>
<script lang="ts" setup>
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

const checkedList = ref<Option[]>([])

defineExpose({
    props
})
</script>