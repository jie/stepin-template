<template>
    <div class="p-10 flex flex-wrap">
        <div v-for="item in items" class="com">
            <div class="flex-1 text-center" style="font-size: 30px;">
                <component :is="item.icon"/>
                <div style="font-size: 14px;color: #333">{{ item.type }}</div>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { defineEmits, defineProps, ref, h } from 'vue';
import { BorderOutlined, FieldStringOutlined, TableOutlined, ExpandOutlined, CheckSquareOutlined, CheckCircleOutlined, FileImageOutlined, UploadOutlined } from '@ant-design/icons-vue';
// const item = {
//     icon: BorderOutlined
// }
const items = ref([
    {
        name: 'Input',
        type: 'input',
        icon: h(BorderOutlined, {
        })
    },
    {
        name: 'Text',
        type: 'text',
        icon: h(FieldStringOutlined, {
        })
    },
    {
        name: 'Radio',
        type: 'radio',
        icon: h(CheckCircleOutlined, {
        })
    },
    {
        name: 'Checkbox',
        type: 'checkbox',
        icon: h(CheckSquareOutlined, {
        })
    },
    {
        name: 'Table',
        type: 'table',
        icon: h(TableOutlined, {
        })
    },
    {
        name: 'Image',
        type: 'image',
        icon: h(FileImageOutlined, {
        })
    },
    {
        name: 'Upload',
        type: 'upload',
        icon: h(UploadOutlined, {
        })
    },
    {
        name: 'Container',
        type: 'container',
        icon: h(ExpandOutlined, {
        })
    }
])
</script>

<style scoped>
.com {
    width: 148px;
    height: 148px;
    border: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: #000;
    background-color: #f9f9f9;
}

.com:hover {
    background-color: #e6e6e6;
    cursor: pointer;
}
</style>