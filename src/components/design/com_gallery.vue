<template>
  <div class="p-10 flex flex-wrap">
    <div v-for="item in items" class="com" @click="onClickAddComponent(item)">
      <div class="flex-1 text-center" style="font-size: 30px;">
        <component :is="item.icon" />
        <div style="font-size: 14px;color: #333">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { defineEmits, defineProps, ref, h } from 'vue';
import { BorderOutlined, FieldStringOutlined, TableOutlined, ExpandOutlined, CheckSquareOutlined, CheckCircleOutlined, FileImageOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { i18n } from '@/lang/i18n';
// const item = {
//     icon: BorderOutlined
// }

const items = ref([
  {
    name: i18n.global.t('base.Input'),
    type: 'input',
    icon: h(BorderOutlined, {
    }),
    defaultData: { title: "Here is the title", sort: "0", desc: "Here is the description", type: "input", data: {value: ""} }
  },
  {
    name: i18n.global.t('base.InputGroup'),
    type: 'input_group',
    icon: h(BorderOutlined, {
    }),
    defaultData: { title: "Here is the title", sort: "0", desc: "Here is the description", type: "input_group", data: {value: [], hasAddRowButton: false} }
  },
  // {
  //   name: 'Text',
  //   type: 'text',
  //   icon: h(FieldStringOutlined, {
  //   })
  // },
  {
    name: i18n.global.t('base.Radio'),
    type: 'radio',
    icon: h(CheckCircleOutlined, {
    }),
    defaultData: {
      title: "Here is the radio", sort: "0", desc: "Here is the description", type: "radio", data: {
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' },
          { label: 'Option 4', value: '4' },
        ]
      }
    }
  },
  {
    name: i18n.global.t('base.Checkbox'),
    type: 'checkbox',
    icon: h(CheckSquareOutlined, {
    }),
    defaultData: {
      title: "Here is the checkbox", sort: "0", desc: "Here is the description", type: "checkbox", data: {
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' },
          { label: 'Option 4', value: '4' },
        ]
      }
    }
  },
  {
    name: i18n.global.t('base.Table'),
    type: 'table',
    icon: h(TableOutlined, {
    }),
    defaultData: {
      title: "Here is the table", sort: "0", desc: "Here is the description", type: "table", data: {
        pageSize: 0,
        addRowCount: 1,
        columns: [{
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          fixed: 'left',
          fieldType: 'text',
          children: []
        }], rows: [{
          name: 'Name',
          fieldOptions: {
            name: {
              fieldType: "text",
              value: "",
              placeholder: ""
            }
          }
        }]
      }
    }
  },
  {
    name: i18n.global.t('base.Image'),
    type: 'image',
    icon: h(FileImageOutlined, {
    }),
    defaultData: {

      title: "Here is the image", sort: "0", desc: "Here is the description", type: "image", data: {
        images: [
          // {
          //   width: 240,
          //   url: "https://aliyuncdn.antdv.com/vue.png"
          // },
          // {
          //   width: 240,
          //   url: "https://aliyuncdn.antdv.com/logo.png"
          // }
        ],
        accept: "image/*,application/pdf",
        isFullWidth: true,
        width: 0,
        columns: 1
      }
    }
  },
  {
    name: i18n.global.t('base.Upload'),
    type: 'upload',
    icon: h(UploadOutlined, {
    }),
    defaultData: { title: "Here is the image upload", sort: "0", desc: "Here is the description", type: "image_upload" }
  },
  // {
  //   name: 'Container',
  //   type: 'container',
  //   icon: h(ExpandOutlined, {
  //   }),
  //   defaultData: { title: "Here is the Container", sort: "0", desc: "Here is the description", type: "container" }
  // }
])


const onClickAddComponent = (com: any) => {
  emits('add-component', { com: com })
}


const emits = defineEmits(["add-component"])


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