<template>
    <a-dropdown placement="bottom">
        <a class="ant-dropdown-link" @click.prevent>
            <SettingOutlined />
        </a>
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    <a href="javascript:;" @click="onClickEdit(props.item)">
                        <EditOutlined /> Edit
                    </a>
                </a-menu-item>
                <a-menu-item>
                    <a href="javascript:;" @click="onClickRemove(props.item)">
                        <DeleteOutlined /> Remove
                    </a>
                </a-menu-item>
                <a-menu-item>
                    <a href="javascript:;" @click="onClickAdd(props.item)">
                        <PlusOutlined /> Add
                    </a>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>


<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue';
const props = defineProps(["item"])
const emits = defineEmits(['onEditComponent', 'onRemoveComponent', 'onAddComponent'])
const onClickEdit = (item:any) => {
    emits('onEditComponent', item)
}
const onClickRemove = (item:any) => {
    emits('onRemoveComponent', item)
}
const onClickAdd = (item:any) => {
    emits('onAddComponent', item)
}
</script>