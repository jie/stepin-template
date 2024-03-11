<template>
  <div>
    <div class="mt-6">
      <BaseForm ref="baseForm" />
      <div>
        <a-form :model="TableSettings" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <a-form-item label="Has Add Button" name="hasAddRowButton">
            <a-switch v-model:checked="TableSettings.hasAddRowButton" />
          </a-form-item>
          <a-form-item label="Width" name="width">
            <a-input v-model:value="TableSettings.tableWidth" />
          </a-form-item>
          <a-form-item label="Height" name="height">
            <a-input v-model:value="TableSettings.tableHeight" />
          </a-form-item>
          <a-form-item label="Page Size" name="pageSize">
            <a-input v-model:value="TableSettings.pageSize" />
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
          <a-form-item :wrapper-col="{ offset: 3, span: 19 }">
            <a-button type="primary" class="mr-2" @click="onClickAdd" :disabled="columns ? true : false">Add New
              Item</a-button>
            <a-button type="primary" class="mr-2" @click="onClickChildAdd" :disabled="columns ? false : true" ghost>Add
              Child Item</a-button>
            <a-button type="default" class="mr-2" @click="onClickEdit" :disabled="columns ? false : true">Edit
              Item</a-button>

            <a-popconfirm title="Confirm delete?" @confirm="onClickDelete(itemParam.key)" ok-text="Yes" no-text="No">
              <a-button type="default" class="mr-2" :disabled="itemParam.key ? false : true">Delete
                Item</a-button>
            </a-popconfirm>
          </a-form-item>


        </a-form>
      </div>
    </div>
    <div class="mt-6">
      <div class="pb-6">
        <h3 class="" style="text-align:center; font-size:120%">Rows</h3>
      </div>
      <div>
        <a-form :model="TableSettings" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <a-form-item :wrapper-col="{ offset: 3, span: 19 }">
            <Table ref="presetTable" :item="currentItem" mode="preview" v-on:edit-table-row="editTableRow"></Table>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 3, span: 19 }">
            <a-button type="primary" class="mr-2" @click="onClickAddPresetRow">Add Rows</a-button>
            <a-popconfirm title="Confirm delete row？" ok-text="Yes" cancel-text="No" @confirm="onClickDelPresetRow">
              <a-button type="danger" class="mr-2">Delete Rows</a-button>
            </a-popconfirm>
          </a-form-item>
        </a-form>
        <a-modal v-model:visible="rowEditDialogVisible" title="Edit Row" ok-text="Confirm" cancel-text="Cancel"
          @ok="onRowEditFinish" @onCancel="cancelRowEditModal" :z-index="1001">
          <a-form :model="rowItemParam" name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }"
            autocomplete="off">
            <a-form-item label="Text" name="text">
              <a-input v-model:value="rowItemParam.text" />
            </a-form-item>
            <a-form-item label="Type" name="fieldType">
              <a-radio-group v-model:value="rowItemParam.fieldType" button-style="solid">
                <a-radio-button value="text">Text</a-radio-button>
                <a-radio-button value="input">Input</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="Is Defect" name="is_defect">
              <a-switch v-model:checked="rowItemParam.is_defect" />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { notification } from 'ant-design-vue';
import { defineProps, defineExpose, ref, toRaw } from 'vue';
import Table from "./index.vue"
import BaseForm from "../base_editor.vue"
import type { TreeSelectProps } from 'ant-design-vue';
import { ReportTable } from '@/types/components';

const currentItem = ref<any>()
const baseForm = ref(null)
const columns = ref<any>();
const rows = ref([])
const editKey = ref<string>();
const presetTable = ref();
const rowEditDialogVisible = ref(false)
const rowItemParam = ref<any>({
  rowIndex: 0,
  key: '',
  text: '',
  fieldType: '',
  is_defect: false
})
const itemParam = ref<any>({
  title: '',
  dataIndex: '',
  key: '',
  text: '',
  width: 100,
  fieldType: '',
  fixed: 'center',
})


const TableSettings = ref<any>({
  hasAddRowButton: false,
  tableHeight: 300,
  tableWidth: "100%",
  pageSize: 0
})

const resetItemParam = () => {
  itemParam.value = {
    title: '',
    dataIndex: '',
    key: '',
    text: '',
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
  // {
  //   label: 'Name',
  //   value: 'name',
  //   data: {
  //     title: 'Name',
  //     dataIndex: 'name',
  //     key: 'name',
  //     width: 100,
  //     fixed: 'center',
  //     fieldType: 'text',
  //   },
  //   children: [
  //   ],
  // },
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
    if (Object.keys(row).indexOf(col.key) == -1) {
      row[col.key] = ""
    }
    if (!row.fieldOptions) {
      row.fieldOptions = {}
    }
    if (row.fieldOptions[col.key] == undefined) {
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
        message: 'Field key already exists',
        description:
          'Field key already exists. Please use a different key.',
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
      message: 'Field key already exists',
      description:
        'Field key already exists. Please use a different key.',
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
  let editJson = copyJson(itemParam.value, 'dataIndex', itemParam.value.key)
  editNode(treeData.value, columns.value, itemParam.value.key, itemParam.value.title, editJson)
  resetItemParam()
  columns.value = ""
  updateRowsWhenUpdateColumn()
  presetTable.value.updateTableData({ columns: convertColumnToTableData(treeData.value), rows: rows.value })
}

function deleteNode(key, items) {
  for (let item of items) {
    if (item.children && item.children.length != 0) {
      item.children = deleteNode(key, item.children)
    }
  }
  return items.filter(obj => obj.value !== key);
}

const onClickDelete = (key: string) => {
  if (!key) {
    return
  }
  treeData.value = deleteNode(key, treeData.value)
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
  if (arr && arr.length !== 0) {
    for (let item of arr) {
      newArr.push({
        label: item.title,
        value: item.key,
        data: item,
        fieldType: item.fieldType,
        children: item.children && item.children.length > 0 ? convertColumnToTreeData(item.children) : []
      })
    }
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
      text: item.text,
      dataIndex: item.value,
      width: item.data.width,
      fieldType: item.data.fieldType,
      children: item.children && item.children.length > 0 ? convertColumnToTableData(item.children) : [],
      fieldOptions: {}
    })
  }
  return newArr
}


const initializeData = (item: any) => {
  treeData.value = convertColumnToTreeData(item?.data?.columns)
  editKey.value = item.key
  rows.value = item?.data?.rowSchema || []
  console.log('rows:', toRaw(rows.value))
  setTimeout(() => {
    console.log('data:', item.data)
    let { _columns, _rows } = item?.data
    if (_columns && _columns.length != 0) {
      itemParam.title = _columns[0].title
      itemParam.dataIndex = _columns[0].dataIndex
      itemParam.key = _columns[0].key
      itemParam.text = _columns[0].text
      itemParam.width = _columns[0].width
      itemParam.fieldType = _columns[0].fieldType
      itemParam.fixed = _columns[0].fixed
    }

    baseForm.value.initializeData(item)
    TableSettings.value.hasAddRowButton = item?.data?.hasAddRowButton
    TableSettings.tableHeight = item?.data?.heigth
    TableSettings.tableWidth = item?.data?.width
    TableSettings.pageSize = item?.data?.pageSize
    currentItem.value = item

    presetTable.value.updateTableData({ columns: convertColumnToTableData(treeData.value), rows: rows.value })
  }, 1000)

}

const exportData = () => {
  console.log("editKey.value:", editKey.value)
  let data = presetTable.value.getTableData()
  console.log('export--data:', toRaw(data))
  let tableData = {
    columns: data.columns,
    rows: [],
    rowSchema: data.rows,
    pageSize: TableSettings.value.pageSize,
    addRowCount: TableSettings.value.hasAddRowButton ? data.rows.length : 0,
    hasAddRowButton: TableSettings.value.hasAddRowButton
  }
  let result = new ReportTable(baseForm.value.exportData())
  result.data = tableData
  console.log('result:', result)
  return result
}

// const exportData = () => {
//   console.log('baseForm.value.exportData():', baseForm.value.exportData())
//   return new ReportInput(baseForm.value.exportData())
// }


const onClickAddPresetRow = () => {
  // let { _, rows } = presetTable.value.getTableData()
  let row = {}
  createRow(row, convertColumnToTableData(treeData.value))
  rows.value.push(row)
  presetTable.value.updateTableData({ columns: convertColumnToTableData(treeData.value), rows: rows.value })
}

const onClickDelPresetRow = () => {
  presetTable.value.deleteSelectedRows()
}




const updateRowsWhenUpdateColumn = () => {
  let newRows = JSON.parse(JSON.stringify(rows.value))
  for (let row of newRows) {
    createRow(row, convertColumnToTableData(treeData.value))
  }
  rows.value = newRows
}

const editTableRow = (rowVal: any) => {
  // console.log('editTableRow:', text, record, index, column)
  // let { columns, rows } = presetTable.value.getTableData()
  // let row = rows.value[index]
  // let col = columns.value[column]
  // console.log('row:', toRaw(row))
  // console.log('col:', toRaw(col))
  // let fieldOptions = row.fieldOptions[col.key]
  // console.log('fieldOptions:', toRaw(fieldOptions))
  // baseForm.value.initializeData(fieldOptions)
  console.log('*******************')
  console.log('rows5:', toRaw(rows.value))
  console.log('columns5:', toRaw(columns.value))
  console.log(toRaw(rowVal.text))
  console.log(toRaw(rowVal.record))
  console.log(toRaw(rowVal.index))
  console.log(toRaw(rowVal.column))
  rowItemParam.value.rowIndex = rowVal.index
  rowItemParam.value.key = rowVal.column.key
  rowItemParam.value.text = rowVal.text
  rowItemParam.value.fieldType = rowVal.record.fieldOptions[rowVal.column.key].fieldType
  rowItemParam.value.is_defect = rowVal.record.fieldOptions[rowVal.column.key].is_defect
  rowEditDialogVisible.value = true
}

const onRowEditFinish = () => {
  // rows.value[rowItemParam.rowIndex].text = rowItemParam.text
  // rows.value[rowItemParam.rowIndex].fieldType = 
  console.log('rows2:', toRaw(rows.value))
  console.log('columns2:', toRaw(columns.value))
  console.log('dataIndex:', toRaw(rowItemParam.value))
  rows.value[rowItemParam.value.rowIndex][rowItemParam.value.key] = rowItemParam.value.text
  rows.value[rowItemParam.value.rowIndex].fieldOptions[rowItemParam.value.key].fieldType = rowItemParam.value.fieldType
  rows.value[rowItemParam.value.rowIndex].fieldOptions[rowItemParam.value.key].is_defect = rowItemParam.value.is_defect
  resetRowEdit()
  rowEditDialogVisible.value = false
}

const cancelRowEditModal = () => {
  resetRowEdit()
  rowEditDialogVisible.value = false
}

const resetRowEdit = () => {
  rowItemParam.value = {
    rowIndex: 0,
    key: '',
    text: '',
    fieldType: '',
    is_defect: false
  }
}


defineExpose({
  initializeData,
  exportData
})
</script>