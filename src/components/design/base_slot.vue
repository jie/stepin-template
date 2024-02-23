<template>
    <div>
        <div v-if="props?.item?.title" style="color: #000">{{ props?.item?.title }}</div>
        <div v-if="props?.item?.summary" style="font-size: 80%; color: #999;">{{ props?.item?.summary }}</div>
        <div class="mt-1 mb-1">
            <slot></slot>
        </div>
        <div v-if="props?.item?.desc" style="color: #666">{{ props?.item?.desc }}</div>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps({
    item: {
        type: Object,        
    }
})
</script>