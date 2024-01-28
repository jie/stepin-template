<template>
  <div class="p-10 flex flex-wrap">
    <div v-for="item in items" class="com" @click="onClickAddComponent(item)">
      <div class="flex-1 text-center" style="font-size: 30px;">
        <component :is="item.icon" />
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
    }),
    defaultData: { title: "Here is the title", desc: "Here is the description", type: "input" }
  },
  // {
  //   name: 'Text',
  //   type: 'text',
  //   icon: h(FieldStringOutlined, {
  //   })
  // },
  {
    name: 'Radio',
    type: 'radio',
    icon: h(CheckCircleOutlined, {
    }),
    defaultData: {
      title: "Here is the radio", desc: "Here is the description", type: "radio", data: {
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
    name: 'Checkbox',
    type: 'checkbox',
    icon: h(CheckSquareOutlined, {
    }),
    defaultData: {
      title: "Here is the checkbox", desc: "Here is the description", type: "checkbox", data: {
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
    name: 'Table',
    type: 'table',
    icon: h(TableOutlined, {
    }),
    defaultData: {
      title: "Here is the table", desc: "Here is the description", type: "table", data: {
        columns: [{
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          fixed: 'left',
          fieldType: 'input',
          children: []
        }], rows: [{
          name: 'Name',
          fieldOptions: {
            name: {
              fieldType: "input",
              value: "",
              placeholder: ""
            }
          }
        }]
      }
    }
  },
  {
    name: 'Image',
    type: 'image',
    icon: h(FileImageOutlined, {
    }),
    defaultData: {
      title: "Here is the image", desc: "Here is the description", type: "image", data: {
        images: [
          {
            width: 240,
            url: "https://aliyuncdn.antdv.com/vue.png"
          },
          {
            width: 240,
            url: "https://aliyuncdn.antdv.com/logo.png"
          }
        ]
      }
    }
  },
  {
    name: 'Upload',
    type: 'upload',
    icon: h(UploadOutlined, {
    }),
    defaultData: { title: "Here is the image upload", desc: "Here is the description", type: "image_upload" }
  },
  // {
  //   name: 'Container',
  //   type: 'container',
  //   icon: h(ExpandOutlined, {
  //   }),
  //   defaultData: { title: "Here is the Container", desc: "Here is the description", type: "container" }
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