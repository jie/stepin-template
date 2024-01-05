<template>
    <div>
        <div> edit {{ props.item.title }}</div>
        <div><a-input></a-input></div>
    </div>

</template>
<script lang="ts" setup>
const props = defineProps({
    item: {
        type: Object,
    }
})
</script>