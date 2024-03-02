<template>
    <a-spin :indicator="indicator" />
</template>
<script lang="ts" setup>

import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
const props = defineProps(["fontSize"])
const indicator = h(LoadingOutlined, {
    style: {
        fontSize: props.fontSize || '24px',
    },
    spin: true,
});
</script>