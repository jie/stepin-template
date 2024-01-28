<template>
    <div>
        <div>{{ props.item.title }}</div>
        <div>
            <a-image-preview-group>
                <a-image :width="item.width" :src="item.url" v-for="item in props?.item?.data?.images" style="border: 1px solid #999"/>
            </a-image-preview-group>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, ref, PropType } from 'vue'
const props = defineProps({
    item: {
        type: Object,
    },
})


defineExpose({
    props
})
</script>