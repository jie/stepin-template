<template>
  <div ref="allModal">
    <BaseSlot :item="props?.item">
      <div v-if="props.mode == 'preview'">
        <a-table class="report-table" :columns="tableDataRef.columns" :data-source="previewRows" bordered size="small"
          :scroll="{ x: props?.data?.width || 1200 }"
          :pagination="tableDataRef?.pageSize == 0 ? false : { size: tableDataRef.addRowCount }"
          :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }">
          <template #bodyCell="{ text, record, index, column }">
            <template v-if="props.mode == 'preview'">
              <a-input-search v-model:value="record[column.key]"
                :placeholder="record.fieldOptions[column.key].placeholder"
                @search="clickEditRow({ text, record, index, column })">
                <template #enterButton>
                  <EditOutlined />
                </template>
              </a-input-search>
            </template>

            <template v-else>
              <template
                v-if="record?.fieldOptions[column.key]?.fieldType == 'input' || record?.fieldOptions[column.key]?.fieldType == 'number'">
                <a-input v-model:value="record[column.key]"
                  :placeholder="record.fieldOptions[column.key].placeholder" />
              </template>
              <template v-else>{{ text }}</template>
            </template>
          </template>
        </a-table>
      </div>
      <div v-else>
        <a-table class="report-table" :columns="[...tableDataRef.columns, {
          title: '',
          key: '_operation',
          fixed: 'right',
          width: 40,
          align: 'center'
        },]" :data-source="props.value" bordered size="small" :scroll="{ x: props?.data?.width || 1200 }"
          :pagination="tableDataRef?.pageSize == 0 ? false : { size: tableDataRef.addRowCount }">
          <template #bodyCell="{ text, record, index, column }">
            <template
              v-if="record?.fieldOptions[column.key]?.fieldType == 'input' || record?.fieldOptions[column.key]?.fieldType == 'number'">
              <a-input v-model:value="record[column.key]" :placeholder="record.fieldOptions[column.key].placeholder"
                allowClear />
            </template>
            <template v-else-if="column.key == '_operation'">
              <a-dropdown :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }">
                <a class="ant-dropdown-link" @click.prevent>
                  <SettingOutlined />
                </a>
                <template #overlay>
                  <a-menu @click="onTableMenuClick($event, index, record)">
                    <a-menu-item key="edit-row">
                      <EditOutlined /> {{ $t('base.Edit') }}
                    </a-menu-item>
                    <a-menu-item key="delete-row"  v-if="!tableDataRef.duplicateRows?.includes(index)">
                      <DeleteOutlined /> {{ $t('base.Delete') }}
                    </a-menu-item>
                    <a-menu-item key="row-moveup" v-if="!tableDataRef.duplicateRows?.includes(index)">
                      <VerticalAlignTopOutlined /> {{ $t('base.MoveUp') }}
                    </a-menu-item>
                    <a-menu-item key="row-movedown" v-if="!tableDataRef.duplicateRows?.includes(index)">
                      <VerticalAlignBottomOutlined /> {{ $t('base.MoveDown') }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>

            </template>
            <template v-else>{{ text }}</template>
          </template>
        </a-table>
        <div v-if="tableDataRef?.hasAddRowButton">
          <a-button type="primary" @click="showAddRowDialog" class="mt-2">{{ $t('base.Add') }}</a-button>
          <!-- <a-popconfirm :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }"
            title="Please delete row?" :ok-text="$t('base.Yes')" :cancel-text="$t('base.No')"
            @confirm="confirmDeleteRowItem" v-if="state.selectedRowKeys && state.selectedRowKeys.length != 0">
            <a-button type="danger" class="mt-2 ml-2">{{ $t('base.Delete') }}</a-button>
          </a-popconfirm> -->
        </div>
      </div>
    </BaseSlot>
    <a-modal v-model:visible="AddRowDialogVisible" :title="$t('base.AddRow')" :ok-text="$t('base.Confirm')"
      :cancel-text="$t('base.Cancel')" @ok="handleConfirmAddRow" @onCancel="handleCancelAddRow" :z-index="1001"
      width="100%" wrap-class-name="full-modal" :getContainer="() => $refs.allModal">
      <div>
        <a-form name="basic" autocomplete="off" layout="vertical">
          <template v-if="editRowIndexRef != null">
            <template v-for="col in tableDataRef.columns">
              <InputWrapper :col="col" v-model:value="formRows[0]" @change="onUpdateFieldValue" />
            </template>
          </template>
          <template v-else>
            <template v-if="tableDataRef.duplicateRows.length != 0">
              <template v-for="(rowIndex, index) in tableDataRef.duplicateRows">
                <a-divider style="border-width: 4px; border-color: #7cb305; font-weight: bold;">Row {{ rowIndex + 1
                  }}th.</a-divider>
                <template v-for="col in tableDataRef.columns">
                  <InputWrapper :col="col" v-model:value="formRows[index]" @change="onUpdateFieldValue" />
                </template>
              </template>
            </template>
            <template v-else>
              <template v-for="col in tableDataRef.columns">
                <InputWrapper :col="col" v-model:value="formRows[0]" @change="onUpdateFieldValue" />
              </template>
            </template>
          </template>
        </a-form>
      </div>

    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineEmits, defineProps, ref, watch, watchEffect } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { toRaw, computed, reactive } from 'vue';
import { copyObject } from "@/utils/objectUtils"
import { ReportFillStore } from "@/store/report_fill"
import InputWrapper from "@/components/design/reportTable/input_wrapper.vue"
import { DeleteOutlined, EditOutlined, SettingOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from "@ant-design/icons-vue";
import { emit } from "process";
import { table } from "console";
// const reportTemplateStore = ReportTemplateStore()
const store = ReportFillStore()
const props = defineProps({
  item: {
    type: Object,
  },
  mode: {
    type: String,
    default: ""
  },
  value: {
    type: Array,
    default: []
  }
})
const emits = defineEmits(["edit-table-row", "update:value"])

const defectOptions = ref([])
const handleSearchDefect = (value) => {
  console.log('value:', value)
  defectOptions.value = value ? store.defects.filter((s) => s.content_en.toLowerCase().includes(value.toLowerCase())) : []
}
const onDefectSelect = (row, key, e) => {
  console.log(store.report.template.language)
  if (store.report?.template?.language == 'zh') {
    row.fieldOptions[key].val = store.defects.find((s) => s.id == e).content
  } else {
    row.fieldOptions[key].val = store.defects.find((s) => s.id == e).content_en
  }
}

const AddRowDialogVisible = ref(false)
// extends TableColumnsType
type MyTableColumnsType = TableColumnsType & {
  fieldType: string,
}
const formRows = ref([])
const newRow = ref({})
const editRowIndexRef = ref(null)

const tableDataRef = ref({
  columns: [],
  rows: [],
  rowSchema: [],
  pageSize: 0,
  hasAddRowButton: false,
  addRowCount: 1,
  duplicateRows: [],

})

const computedFormRows = computed(() => {
  let _rows = []
  if (tableDataRef.value.duplicateRows && tableDataRef.value.duplicateRows.length != 0) {
    for (let item of tableDataRef.value.duplicateRows) {
      _rows.push(copyObject(item))
    }
  }

  return _rows
})


// add computed column
const previewRows = computed(() => {
  return tableDataRef.value?.rows.map((row, index) => {
    row.key = index
    return row
  })
})

// tableDataRef.columns
const tableDataColumnsComputed = computed(() => {
  return tableDataRef.value?.columns.map((col, index) => {
    col.responsive = ['small']
    return col
  })
})


const onUpdateFieldValue = (value: any) => {
  console.log('onUpdateFieldValue:', value)
}

const getTableData = () => {
  return tableDataRef.value
}

const updateTableData = (data: any) => {
  tableDataRef.value = data
}

const addRow = (row: any) => {
  console.log('addRow:', row)
  tableDataRef.value.rows.push(row)
}

const deleteSelectedRows = () => {
  if (props.mode == 'preview') {
    tableDataRef.value.rows = tableDataRef.value.rows.filter((row: any, index: number) => !state.selectedRowKeys.includes(index))
  } else {
    let newRows = [...props.value]
    console.log('newRows1:', toRaw(newRows))
    console.log('state.selectedRowKeys2:', state.selectedRowKeys)
    newRows = newRows.filter((row: any) => !state.selectedRowKeys.includes(row.key))
    emits('update:value', newRows)
  }

}

const exportData = () => {
  return {
    ...props.item,
    data: tableDataRef.value
  }
}

const exportValue = () => {
  return tableDataRef.value
}

const refreshValue = (data: any) => {
  // tableDataRef.value = data
  console.log('data:', toRaw(data))
  // tableDataRef.value = data
  tableDataRef.value = {
    ...data,
    rowSchema: data.rowSchema,
    rows: data.rows
  }
  reOrderKey()
}

const clickEditRow = (val: any) => {
  emits('edit-table-row', val)
}


const loadSchemaFromColumnsAndRows = () => {
  let schemas = []
  console.log('tableDataRef.value.columns:', toRaw(tableDataRef.value.columns))
  console.log('tableDataRef.value.rowSchema:', toRaw(tableDataRef.value.rowSchema))
  // for (let row of tableDataRef.value.rowSchema) {
  //   let _row = {}
  //   for (let key of Object.keys(row)) {
  //     _row[key] = {
  //       fieldType: 'input',
  //       value: row[key]
  //     }
  //   }
  //   _rowSchema.push(_row)
  // }
  // tableDataRef.value.rowSchema = _rowSchema
}

// const showAddRowDialog = () => {
//   loadSchemaFromColumnsAndRows()
//   editRowIndexRef.value = null
//   let _formRows = tableDataRef.value.rowSchema.slice(0, tableDataRef.value.addRowCount)
//   formRows.value = copyObject(_formRows)
//   newRow.value = copyObject(_formRows)[0]
//   AddRowDialogVisible.value = true
//   document.documentElement.style.overflow = 'hidden'
// }
const showAddRowDialog = () => {
  loadSchemaFromColumnsAndRows()
  editRowIndexRef.value = null
  let _formRows = []
  if (props?.item?.data?.duplicateRows && props?.item?.data?.duplicateRows.length != 0) {
    for (let rowIndex of props?.item?.data?.duplicateRows) {
      _formRows.push(copyObject(props?.item?.data?.rowSchema[rowIndex]))
    }
  } else {
    _formRows.push(copyObject(props?.item?.data?.rowSchema[0]))
  }
  console.log('_formRows:', toRaw(_formRows))
  formRows.value = _formRows
  AddRowDialogVisible.value = true
  document.documentElement.style.overflow = 'hidden'
}

const showEditRowDialog = (index: number, record: any) => {
  editRowIndexRef.value = index
  formRows.value = []
  formRows.value.push(copyObject(record))
  AddRowDialogVisible.value = true
  document.documentElement.style.overflow = 'hidden'
}

watch(() => AddRowDialogVisible.value, (val) => {
  if (!val) {
    document.documentElement.style.overflow = 'auto'
  }
})

const confirmDeleteRowItem = () => {
  deleteSelectedRows()
}

const setDuplicateRow = () => {
  console.log('state.selectedRowKeys:', state.selectedRowKeys)
  let duplicateRows = copyObject(state.selectedRowKeys)
  state.selectedRowKeys = []
  return duplicateRows
}


const handleConfirmAddRow = () => {
  let newRows = [...props.value]
  if (editRowIndexRef.value != null) {
    newRows[editRowIndexRef.value] = copyObject(formRows.value[0])
  } else {
    for (let item of formRows.value) {
      newRows.push(copyObject(item))
    }
  }
  newRows = newRows.map((row: any, index: number) => {
    row.key = index
    return row
  })

  AddRowDialogVisible.value = false
  emits('update:value', newRows)
  setTimeout(() => {
    console.log('updated:', toRaw(props.value))
  }, 100)
}


const moveRowUp = (index: number, record: any) => {
  if(tableDataRef.value.duplicateRows.includes(index - 1)){
    return
  }
  let newRows = copyObject(props.value)
  let temp = newRows[index]
  newRows[index] = newRows[index - 1]
  newRows[index - 1] = temp
  console.log('newRows2:', toRaw(newRows))
  newRows = newRows.map((row: any, index: number) => {
    row.key = index
    return row
  })
  emits('update:value', newRows)
}
const moveRowDown = (index: number, record: any) => {
  if(tableDataRef.value.duplicateRows.includes(index + 1)){
    return
  }
  let newRows = copyObject(props.value)
  console.log('newRows1:', toRaw(newRows))
  let temp = newRows[index]
  newRows[index] = newRows[index + 1]
  newRows[index + 1] = temp
  console.log('newRows1:', toRaw(newRows))
  newRows = newRows.map((row: any, index: number) => {
    row.key = index
    return row
  })
  emits('update:value', newRows)
}

const onTableMenuClick = (event: any, index: number, record: any) => {
  switch (event.key) {
    case 'edit-row':
      showEditRowDialog(index, record)
      break
    case 'delete-row':
      state.selectedRowKeys = [index]
      confirmDeleteRowItem()
      break
    case 'row-moveup':
      if (index == 0) {
        return
      }
      moveRowUp(index, record)
      break
    case 'row-movedown':
      if (index == props.value.length - 1) {
        return
      }
      moveRowDown(index, record)
      break
  }

}

const updateFieldValueByKey = (key: string, obj: object) => {
  for (let row of formRows.value) {
    for (let item of row) {
      if (item.name == key && obj.fieldType == 'input') {
        console.log('updated:', obj.value)
        obj.value = item.val
      }
    }
  }
}

const handleCancelAddRow = () => {

}

const reOrderKey = () => {
  let rows = tableDataRef.value.rows
  let newRows = rows.map((row: any, index: number) => {
    row.key = index
    return row
  })
  tableDataRef.value.rows = newRows
}


type Key = string | number;
const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const onSelectChange = (selectedRowKeys: Key[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};

const initialization = () => {
  console.log('props?.item:', toRaw(props?.item))
  if (props?.item?.data && !props?.item?.data?.hasAddRowButton) {
    tableDataRef.value = props?.item?.data
  } else {
    tableDataRef.value = {
      ...props?.item?.data,
      rows: []
    }



    if (props.item?.data?.rowSchema && props.item?.data?.rowSchema.length != 0) {
      setTimeout(() => {
        emits('update:value', props.item?.data?.rowSchema)
      }, 500)
    }

  }
  console.log('computedFormRows:', computedFormRows.value)
}

initialization()

defineExpose({
  getTableData,
  updateTableData,
  deleteSelectedRows,
  addRow,
  props,
  exportValue,
  exportData,
  refreshValue,
  setDuplicateRow
})



</script>


<style scoped>
.report-table .ant-table-cell.ant-table-selection-column {
  min-width: 30px !important;
  width: 30px !important
}

:deep(.ant-table-selection-column) {
  min-width: 30px !important;
  width: 30px !important
}

:deep(.ant-table-selection-column) {
  min-width: 30px !important;
  width: 30px !important
}

.ant-table-selection-column {
  width: 20px !important;
  /* 使用 !important 确保样式优先级 */
  padding: 0 !important;
}

.ant-dropdown {
  z-index: 1001;
}
</style>

<style lang="less">
:deep(.ant-table-small .ant-table-selection-column) {
  padding: 5px !important;
  max-width: 26px;
}

.full-modal {

  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    // height: 100vh;
  }

  .ant-modal-body {
    flex: 1;
  }
}
</style>