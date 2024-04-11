<template>
    <div>
        <a-form-item :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}` }]" :label="props?.item?.title" :required="props?.item?.required" :name="props?.item?.key">
            <div v-if="props?.item?.summary" style="color: #999; margin-bottom: 10px;font-size: 85%;">{{ props?.item?.summary }}</div>
            <slot></slot>
            <div v-if="props?.item?.desc" style="color: #666;margin-top: 10px;">{{ props?.item?.desc }}</div>
        </a-form-item>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps({
    item: {
        type: Object,        
    }
})
</script>