<template>
  <div>
    <BaseSlot :item="props?.item">
      <div v-if="props.mode == 'preview'">
        <a-table class="report-table" :columns="props.item?.data?.columns" :data-source="previewRows" bordered
          size="middle" :pagination="props.item?.data?.pageSize == 0 ? false : { size: props.item?.data.addRowCount }"
          :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }">
          <template #bodyCell="{ text, record, index, column }">
            <template v-if="props.mode == 'preview'">
              <a-input-search v-model:value="record[column.key]"
                :placeholder="record.fieldOptions[column.key].placeholder"
                @search="clickEditRow({ text, record, index, column })">
                <template #enterButton>
                  <a-button>Edit Row</a-button>
                </template>
              </a-input-search>
            </template>
            <template v-else>
              <template v-if="record?.fieldOptions[column.key]?.fieldType == 'input'">
                <a-input v-model:value="record[column.key]" :placeholder="record.fieldOptions[column.key].placeholder" />
              </template>
              <template v-else>{{ text }}</template>
            </template>
          </template>
        </a-table>
      </div>
      <div v-else>
        <a-table class="report-table" :columns="props.item?.data?.columns" :data-source="props.item?.data?.rows" bordered
          size="middle" :pagination="props.item?.data?.pageSize == 0 ? false : { size: props.item?.data.addRowCount }">
          <template #bodyCell="{ text, record, index, column }">
            <template v-if="record?.fieldOptions[column.key]?.fieldType == 'input'">
              <a-input v-model:value="record[column.key]" :placeholder="record.fieldOptions[column.key].placeholder" />
            </template>
            <template v-else>{{ text }}</template>
          </template>
        </a-table>
        <div v-if="props.item?.data?.hasAddRowButton">
          <a-button type="primary" @click="showAddRowDialog" class="mt-2">Add</a-button>
        </div>
      </div>

    </BaseSlot>
    <a-modal v-model:visible="AddRowDialogVisible" title="Add Row" ok-text="Confirm" cancel-text="Cancel"
      @ok="handleConfirmAddRow" @onCancel="handleCancelAddRow" :z-index="1001">
      <a-form name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" autocomplete="off" layout="vertical">
        <template v-for="row in formRows">
        <a-form-item  :label="`${item.label } ${ item.name}`" v-for="item in row">
          <a-input v-model:value="item.val" />
        </a-form-item>
      </template>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineEmits, defineProps, ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { toRaw, computed, reactive } from 'vue';
import { ReportTemplateStore } from "@/store/reportTemplate"
const reportTemplateStore = ReportTemplateStore()
const props = defineProps(["item", "mode"])
const emits = defineEmits(["edit-table-row"])
const AddRowDialogVisible = ref(false)
// extends TableColumnsType
type MyTableColumnsType = TableColumnsType & {
  fieldType: string,
}
const formRows = ref([])

// const columns = ref<MyTableColumnsType>([{
//   title: 'Name',
//   dataIndex: 'name',
//   key: 'name',
//   width: 100,
//   fixed: 'left',
//   fieldType: 'text',
//   children: []
// },])

// const rows = ref([
//   {
//     name: 'Name',
//     fieldOptions: {
//       name: {
//         fieldType: "text",
//         value: "",
//         placeholder: ""
//       }
//     }
//   }
// ])


// add computed column
const previewRows = computed(() => {
  return props.item?.data?.rows.map((row, index) => {
    row.key = index
    return row
  })
})



const getTableData = () => {
  return reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key).data
}

const updateTableData = (data: any) => {
  reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key).data = data
}

const addRow = (row: any) => {
  console.log('addRow:', row)
  reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key).data.value.push(row)
}

const deleteSelectedRows = () => {
  let rows = reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key).data.rows
  let newRows = rows.filter((row: any) => !state.selectedRowKeys.includes(row.key))
  reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key).data.rows = newRows
}

const exportData = () => {
  return reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key)
}

const exportValue = () => {
  return reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key).data.rows
}

const clickEditRow = (val: any) => {
  emits('edit-table-row', val)
}

const addRowByUser = () => {
  let rows = reportTemplateStore.reportTemplate.items.find((item: any) => item.key == props.item.key).data.rows
  let newRows = JSON.parse(JSON.stringify(rows))
  for (let i = 0; i < props.item.data.addRowCount; i++) {
    rows.push(newRows[i])
  }
}

const showAddRowDialog = () => {
  let _rows = []
  console.log('props.item.data.addRowCount:',props.item.data.columns.length)
  if(props.item.data.columns.length == 1) {
    for (let row of props.item.data.rows) {
      let _row = []
      for (let key of Object.keys(row.fieldOptions)) {
        if (row['fieldOptions'][key]['fieldType'] == 'input') {
          _row.push({
            label: row[key],
            name: key,
            val: row[key],
          })
        }
      }
      _rows.push(_row)
    }
  } else {
    for (let row of props.item.data.rows) {
      let _row = []
      let colKey = props.item.data.columns[0].key
      for (let key of Object.keys(row.fieldOptions)) {
        if (key == colKey) {
          continue
        }
        if (row['fieldOptions'][key]['fieldType'] == 'input') {
          _row.push({
            label: row[colKey],
            name: key,
            val: row[key],
          })
        }
      }
      _rows.push(_row)
    }
  }

  formRows.value = _rows
  AddRowDialogVisible.value = true

}



const handleConfirmAddRow = () => {

}
const handleCancelAddRow = () => {

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
defineExpose({
  getTableData,
  updateTableData,
  deleteSelectedRows,
  addRow,
  props,
  exportValue,
  exportData
})

</script>


<!-- <style>

.report-table .ant-table-cell.ant-table-selection-column {
  width: 40px;
  padding: 1px;
}
</style> -->