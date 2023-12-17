<template>
  <div>
    <div>
      <div class="pb-6">
        <!-- <a-row>
          <a-col :span="6" style="text-align: right;">Column</a-col>
          <a-col :span="18">
            <a-tree-select v-model:value="value" show-search style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allow-clear
              tree-default-expand-all :tree-data="treeData" tree-node-filter-prop="label">
              <template #title="{ value: val, label }">
                <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
                <template v-else>{{ label }}</template>
              </template>
            </a-tree-select>
          </a-col>
        </a-row> -->

      </div>
      <div class="">
        <a-form :model="itemParam" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed">
          <a-form-item label="Column" name="column">
            <a-tree-select v-model:value="value" show-search style="width: 100%" @clear="clearTreeSelect" @change="onTreeSelect"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allow-clear
              tree-default-expand-all :tree-data="treeData" tree-node-filter-prop="label">
              <template #title="{ value: val, label }">
                <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
                <template v-else>{{ label }}</template>
              </template>
            </a-tree-select>
          </a-form-item>
          <a-form-item label="Title" name="title">
            <a-input v-model:value="itemParam.title" />
          </a-form-item>
          <a-form-item label="DataIndex" name="dataIndex">
            <a-input v-model:value="itemParam.dataIndex" />
          </a-form-item>
          <a-form-item label="Key" name="key">
            <a-input v-model:value="itemParam.key" />
          </a-form-item>
          <a-form-item label="Width" name="width">
            <a-input-number v-model:value="itemParam.width" placeholder="Basic usage" />
          </a-form-item>
          <a-form-item label="Postion" name="position">
            <a-radio-group v-model:value="itemParam.fixed">
              <a-radio-button value="left">Large</a-radio-button>
              <a-radio-button value="center">Center</a-radio-button>
              <a-radio-button value="right">Right</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
      <div class="p-5">
        <a-button type="primary" class="mr-2" @click="onClickAdd">Add New Item</a-button>
        <a-button type="primary" class="mr-2" @click="onClickChildAdd" ghost>Add Child Item</a-button>
        <a-button type="default" class="mr-2" @click="onClickEdit">Edit Item</a-button>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { notification } from 'ant-design-vue';
import { defineProps, ref, toRaw } from 'vue';
import type { TreeSelectProps } from 'ant-design-vue';
import { on } from 'events';
const props = defineProps(["index", "params"])
const value = ref<string>();
const itemParam = ref<any>({
  title: '',
  dataIndex: '',
  key: '',
  width: 100,
  fixed: 'center',
})

const resetItemParam = () => {
  itemParam.value = {
    title: '',
    dataIndex: '',
    key: '',
    width: 100,
    fixed: 'center',
  }
}

const clearTreeSelect = () => {
  value.value = ""
  resetItemParam()
}

const onTreeSelect = () => {
  console.log(toRaw(value.value))
  const node = findNode(treeData.value, value.value)
  console.log(toRaw(node))
  console.log(toRaw(treeData.value))
  itemParam.value = JSON.parse(JSON.stringify(node.data))
}

const treeData = ref<TreeSelectProps['treeData']>([
  {
    label: 'Name',
    value: 'name',
    data: {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'center',
    },
    children: [
    ],
  },
]);
function editNode(arr, value, newValue, newLabel, data) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      editNode(arr[i].children, value, newValue, newLabel, data);
    }
    if (arr[i].value === value) {
      arr[i].label = newLabel;
      arr[i].value = value
      arr[i].data = data
      break; // 找到并修改后直接跳出循环
    }
  }
}

function findNode(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children && arr[i].children.length > 0) {
      findNode(arr[i].children, value);
    }
    if (arr[i].value === value) {
      return arr[i]
    }
  }
}


const onClickAdd = () => {
  console.log('onClickAdd')
  let node = findNode(treeData.value, value.value)
  console.log('node:', node)
  if(node.value == itemParam.value.key) {
    notification["error"]({
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      });
    return
  }
  treeData.value.push({
    label: itemParam.value.title,
    value: itemParam.value.key,
    data: JSON.parse(JSON.stringify(itemParam.value)),
    children: [
    ],
  })
  resetItemParam()
}
const onClickChildAdd = () => {
  let node = findNode(treeData.value, value.value)
  console.log('node:', node)
  if(node.value == itemParam.value.key) {
    notification["error"]({
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      });
    return
  }
  console.log('onClickAdd:', toRaw(value.value))

  node.children.push({
    label: itemParam.value.title,
    value: itemParam.value.key,
    data: JSON.parse(JSON.stringify(itemParam.value)),
    children: [
    ],
  })
  console.log('111:', JSON.parse(JSON.stringify(itemParam.value)))
  resetItemParam()
}
const onClickEdit = () => {
  console.log(toRaw(value.value))
  editNode(treeData.value, value.value, itemParam.value.key, itemParam.value.title, JSON.parse(JSON.stringify(itemParam.value)))  
  resetItemParam()
  value.value = ""
  console.log(toRaw(treeData.value))
}


const onFinish = () => {

}

const onFinishFailed = () => {

}
</script>