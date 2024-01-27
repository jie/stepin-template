<template>
    <div>
        <div> edit {{ props.item.title }}</div>
        <div>
            <a-image-preview-group>
                <a-image :width="item.width" :src="item.url" v-for="item in images" style="border: 1px solid #999"/>
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
    images: {
        type: [Array] as PropType<ImageObj[]>,
    }
})

const defaultOptions = [
    {
        width: 240,
        url: "https://aliyuncdn.antdv.com/vue.png"
    },
    {
        width: 240,
        url: "https://aliyuncdn.antdv.com/logo.png"
    }
]

type ImageObj = {
    url: string,
    width: number
}

const images = ref<ImageObj[]>([])

const initialize = () => {
    images.value = props.images || defaultOptions
}

initialize()
</script>