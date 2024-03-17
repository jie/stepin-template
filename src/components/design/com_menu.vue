<template>
    <a-dropdown placement="bottom">
        <span class="ant-dropdown-link" @click.prevent>
            <SettingOutlined />
        </span>
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    <span @click="onClickEdit(props.item)" class="block">
                        <EditOutlined /> {{ $t('base.Edit') }}
                    </span>
                </a-menu-item>
                <a-menu-item>
                    <span @click="onClickDuplicate(props.item)" class="block">
                        <CopyOutlined /> {{ $t('base.Duplicate') }}
                    </span>
                </a-menu-item>
                <a-menu-item>
                    <span @click="onClickMoveUp(props.item)" class="block">
                        <VerticalAlignTopOutlined /> {{ $t('base.MoveUp') }}
                    </span>
                </a-menu-item>
                <a-menu-item>
                    <span @click="onClickMoveDown(props.item)" class="block">
                        <VerticalAlignBottomOutlined /> {{ $t('base.MoveDown') }}
                    </span>
                </a-menu-item> 
                <a-menu-item>
                    <a-popconfirm :title="$t('base.ConfirmDelete')" :ok-text="$t('base.Yes')" :cancel-text="$t('base.No')"
                        @confirm="onClickDel(props.item)">
                        <span class="block">
                            <DeleteOutlined /> {{ $t('base.Remove') }}
                        </span>
                    </a-popconfirm>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>


<script lang="ts" setup>
import { VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from '@ant-design/icons-vue';
import { defineEmits, defineProps, ref } from 'vue';
const props = defineProps(["item"])
const emits = defineEmits(['onEditComponent', 'onDelComponent', 'onAddComponent', 'onMoveUpComponent', 'onMoveDownComponent'])
const onClickEdit = (item: any) => {
    emits('onEditComponent', item)
}
const onClickDel = (item: any) => {

    emits('onDelComponent', item)
}
const onClickDuplicate = (item: any) => {
    emits('onAddComponent', item)
}
const onClickMoveUp = (item: any) => {
    emits('onMoveUpComponent', item)
}
const onClickMoveDown = (item: any) => {
    emits('onMoveDownComponent', item)
}
</script>