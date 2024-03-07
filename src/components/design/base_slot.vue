<template>
    <div>
        <a-form-item :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}` }]" :label="props?.item?.title" :extra="props?.item?.summary" :required="props?.item?.required" :name="props?.item?.key">
            <slot></slot>
            <div style="height: 5px;"></div>
            <div v-if="props?.item?.desc" style="color: #666">{{ props?.item?.desc }}</div>
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