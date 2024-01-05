<template>
    <div>
        <div> text {{ props.item.title }}</div>
        <div>{{ props.item.desc }}</div>
    </div>

</template>
<script lang="ts" setup>
const props = defineProps({
    item: {
        type: Object,
    }
})
</script>