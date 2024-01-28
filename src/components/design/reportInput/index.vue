<template>
    <div>
        <div v-if="props?.item?.title">{{ props?.item?.title }}</div>
        <div class="mt-1 mb-1"><a-input></a-input></div>
        <div v-if="props?.item?.desc">{{ props?.item?.desc }}</div>
    </div>

</template>
<script lang="ts" setup>
const props = defineProps({
    item: {
        type: Object,        
    }
})

defineExpose({
    props
})
</script>