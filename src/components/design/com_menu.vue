<template>
    <a-dropdown placement="bottom">
        <span class="ant-dropdown-link" @click.prevent>
            <SettingOutlined />
        </span>
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    <span @click="onClickEdit(props.item)" class="block">
                        <EditOutlined /> Edit
                    </span>
                </a-menu-item>
                <a-menu-item>
                    <a-popconfirm title="Please confirm remove component?" ok-text="Yes" cancel-text="No"
                        @confirm="onClickDel(props.item)">
                        <span class="block">
                            <DeleteOutlined /> Remove
                        </span>
                    </a-popconfirm>
                </a-menu-item>
                <a-menu-item>
                    <span @click="onClickAdd(props.item)" class="block">
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
const emits = defineEmits(['onEditComponent', 'onDelComponent', 'onAddComponent'])
const onClickEdit = (item: any) => {
    emits('onEditComponent', item)
}
const onClickDel = (item: any) => {

    emits('onDelComponent', item)
}
const onClickAdd = (item: any) => {
    emits('onAddComponent', item)
}
</script>