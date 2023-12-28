<template>
  <div style="color: #333">
    <div class="mt-6">
      <div class="pb-6">
        <h3 class="" style="text-align:center; font-size:120%">Settings</h3>
      </div>
      <div>
        <a-form :model="TableSettings" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <a-form-item label="Has Add Button" name="hasAddRowButtonForUser">
            <a-switch v-model:checked="TableSettings.hasAddRowButtonForUser" />
          </a-form-item>
          <a-form-item label="Width" name="width">
            <a-input v-model:value="TableSettings.tableWidth" />
          </a-form-item>
          <a-form-item label="Height" name="height">
            <a-input v-model:value="TableSettings.tableHeight" />
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div>
      <div class="pb-6">
        <h3 class="" style="text-align:center; font-size:120%">Columns</h3>
      </div>
      <div class="">
        <a-form :model="itemParam" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed">
          <a-form-item label="Column" name="column">
            <a-tree-select v-model:value="columns" show-search style="width: 100%" @clear="clearTreeSelect"
              @change="onTreeSelect" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="Please select" allow-clear tree-default-expand-all :tree-data="treeData"
              tree-node-filter-prop="label">
            </a-tree-select>
          </a-form-item>
          <a-form-item label="Title" name="title">
            <a-input v-model:value="itemParam.title" />
          </a-form-item>
          <a-form-item label="Key" name="key">
            <a-input v-model:value="itemParam.key" />
          </a-form-item>
          <a-form-item label="Type" name="fieldType">
            <a-radio-group v-model:value="itemParam.fieldType" button-style="solid">
              <a-radio-button value="text">Text</a-radio-button>
              <a-radio-button value="input">Input</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="Width" name="width">
            <a-input-number v-model:value="itemParam.width" placeholder="Basic usage" />
          </a-form-item>
        </a-form>
      </div>
      <div class="p-5">
        <a-button type="primary" class="mr-2" @click="onClickAdd" :disabled="columns ? true : false">Add New Item</a-button>
        <a-button type="primary" class="mr-2" @click="onClickChildAdd" :disabled="columns ? false : true" ghost>Add Child
          Item</a-button>
        <a-button type="default" class="mr-2" @click="onClickEdit" :disabled="columns ? false : true">Edit Item</a-button>
      </div>
    </div>
    <div class="mt-6">
      <div class="pb-6">
        <h3 class="" style="text-align:center; font-size:120%">Rows</h3>
      </div>
      <div>
        <a-form :model="TableSettings" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <Table ref="presetTable"></Table>
          <a-button type="primary" class="mr-2" @click="onClickAddPresetRow">Add Rows</a-button>
        </a-form>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { notification } from 'ant-design-vue';
import { defineProps, defineExpose, ref, toRaw } from 'vue';
import Table from "@/components/report/table/index.vue"
import type { TreeSelectProps } from 'ant-design-vue';
const props = defineProps(["index", "item"])
const columns = ref<string>();
const rows = ref([])
const editKey = ref<string>();
const presetTable = ref();
const itemParam = ref<any>({
  title: '',
  dataIndex: '',
  key: '',
  width: 100,
  fieldType: '',
  fixed: 'center',
})


const TableSettings = ref<any>({
  hasAddRowButtonForUser: true,
  tableHeight: 300,
  tableWidth: "100%"
})

const resetItemParam = () => {
  itemParam.value = {
    title: '',
    dataIndex: '',
    key: '',
    fieldType: 'text',
    width: 100,
    fixed: 'center',
  }
}

const clearTreeSelect = () => {
  columns.value = ""
  resetItemParam()
}

const onTreeSelect = () => {
  if (columns.value) {
    const node = findNode(treeData.value, columns.value)
    itemParam.value = copyJson(node.data, 'dataIndex', node.data.key)
  }
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
      fieldType: 'text',
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
      arr[i].fieldType = data.fieldType
      break;
    }
  }
}

function findNode(data, value) {
  for (const node of data) {
    if (node.value === value) {
      return node;
    }

    if (node.children && node.children.length) {
      const foundNode = findNode(node.children, value);
      if (foundNode) {
        return foundNode;
      }
    }
  }

  return null;
}

function createRow(row: any, columns: any) {
  for (let col of columns) {
    if(Object.keys(row).indexOf(col.key) == -1){
      row[col.key] = ""
    }
    if (!row.fieldOptions) {
      row.fieldOptions = {}
    }
    if(row.fieldOptions[col.key] == undefined) {
      row.fieldOptions[col.key] = {
        fieldType: col.fieldType,
        value: "",
        placeholder: ""
      }
    }
    if (col.children && col.children.length > 0) {
      createRow(row, col.children)
    }
  }
}


function copyJson(obj, k, v) {
  let data = JSON.parse(JSON.stringify(obj))
  data[k] = v
  return data
}
const onClickAdd = () => {
  console.log('onClickAdd')
  if (columns.value) {
    let node = findNode(treeData.value, columns.value)
    if (node.value == itemParam.value.key) {
      notification["error"]({
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      });
      return
    }
  }

  treeData.value.push({
    label: itemParam.value.title,
    value: itemParam.value.key,
    fieldType: itemParam.value.fieldType,
    data: copyJson(itemParam.value, 'dataIndex', itemParam.value.key),
    children: [
    ],
  })
  resetItemParam()
  updateRowsWhenUpdateColumn()
  presetTable.value.updateTableData({ columns: convertColumnToTableData(treeData.value), rows: rows.value })

}
const onClickChildAdd = () => {
  let node = findNode(treeData.value, columns.value)
  console.log('node:', node)
  if (node.value == itemParam.value.key) {
    notification["error"]({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
    return
  }
  console.log('onClickAdd:', toRaw(columns.value))

  node.children.push({
    label: itemParam.value.title,
    value: itemParam.value.key,
    fieldType: itemParam.value.fieldType,
    data: copyJson(itemParam.value, 'dataIndex', itemParam.value.key),
    children: [
    ],
  })
  resetItemParam()
  updateRowsWhenUpdateColumn()
  presetTable.value.updateTableData({ columns: convertColumnToTableData(treeData.value), rows: rows.value })
}
const onClickEdit = () => {
  editNode(treeData.value, columns.value, itemParam.value.key, itemParam.value.title, copyJson(itemParam.value, 'dataIndex', itemParam.value.key))
  resetItemParam()
  columns.value = ""
  updateRowsWhenUpdateColumn()
  presetTable.value.updateTableData({ columns: convertColumnToTableData(treeData.value), rows: rows.value })
}


const onFinish = () => {

}

const onFinishFailed = () => {

}

function convertColumnToTreeData(arr) {
  console.log('convertColumnToTreeData:', toRaw(arr))
  let newArr = []
  for (let item of arr) {
    newArr.push({
      label: item.title,
      value: item.key,
      data: item,
      fieldType: item.fieldType,
      children: item.children && item.children.length > 0 ? convertColumnToTreeData(item.children) : []
    })
  }
  return newArr
}

function convertColumnToTableData(arr) {
  console.log('convertColumnToTableData:', toRaw(arr))
  let newArr = []
  for (let item of arr) {
    newArr.push({
      title: item.label,
      key: item.value,
      dataIndex: item.value,
      width: item.data.width,
      fieldType: item.data.fieldType,
      children: item.children && item.children.length > 0 ? convertColumnToTableData(item.children) : []
    })
  }
  return newArr
}


const initializeData = (key: string, _columns: any, _rows: any) => {
  treeData.value = convertColumnToTreeData(_columns)
  console.log('treeData.value:', toRaw(treeData.value))
  editKey.value = key
  rows.value = _rows
}

const exportData = () => {
  console.log("editKey.value:", editKey.value)
  let data = presetTable.value.getTableData()
  console.log('export--data:', toRaw(data))
  let { columns, rows } = presetTable.value.getTableData()
  return { key: editKey.value, data: {columns: columns.value, rows: rows.value} }
}




const onClickAddPresetRow = () => {
  console.log('onClickAddPresetRow')
  let { _, rows } = presetTable.value.getTableData()
  let row = {}
  createRow(row, convertColumnToTableData(treeData.value))
  rows.value.push(row)
  presetTable.value.updateTableData({ columns: convertColumnToTableData(treeData.value), rows: rows.value })
}


const updateRowsWhenUpdateColumn = () => {
  console.log('updateRowsWhenUpdateColumn')
  let newRows = JSON.parse(JSON.stringify(rows.value))
  for (let row of newRows) {
    createRow(row, convertColumnToTableData(treeData.value))
  }
  console.log('newRows:', toRaw(newRows))
  rows.value = newRows
}

defineExpose({
  initializeData,
  exportData
})
</script>