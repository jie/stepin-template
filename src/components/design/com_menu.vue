<template>
    <a-dropdown placement="bottom">
        <span class="ant-dropdown-link" @click.prevent>
            <SettingOutlined />
        </span>
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    <span @click="onClickEdit(props.item)">
                        <EditOutlined /> Edit
                    </span>
                </a-menu-item>
                <a-menu-item>
                    <span @click="onClickRemove(props.item)">
                        <DeleteOutlined /> Remove
                    </span>
                </a-menu-item>
                <a-menu-item>
                    <span @click="onClickAdd(props.item)">
                        <PlusOutlined /> Add
                    </span>
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