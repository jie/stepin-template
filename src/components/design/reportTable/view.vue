<template>
    <div ref="allModal">
      <BaseSlot :item="props?.item">
        <div>
          <a-table class="report-table" :columns="tableDataRef.columns" :data-source="props.value" bordered size="small" :scroll="{ x: 1500 }"
            :pagination="tableDataRef?.pageSize == 0 ? false : { size: tableDataRef.addRowCount }">
            <template #bodyCell="{ text, record, index, column }">
              <template v-if="props.mode == 'preview'">
                <a-input-search v-model:value="record[column.key]"
                  :placeholder="record.fieldOptions[column.key].placeholder">
                  <template #enterButton>
                    <EditOutlined />
                  </template>
                </a-input-search>
              </template>
              <template v-else>
                <template v-if="record?.fieldOptions[column.key]?.fieldType == 'input'">
                  {{ record[column.key] }}
                </template>
                <template v-else>{{ text }}</template>
              </template>
            </template>
          </a-table>
        </div>
      </BaseSlot>
    </div>
  </template>
  
  <script lang="ts" setup>
  import BaseSlot from "../base_slot.vue"
  import { defineEmits, defineProps, ref } from 'vue';
//   import type { TableColumnsType } from 'ant-design-vue';
  import { toRaw, computed, reactive } from 'vue';
//   import { copyObject } from "@/utils/objectUtils"
//   import { ReportFillStore } from "@/store/report_fill"
  import { EditOutlined } from "@ant-design/icons-vue";
  // const reportTemplateStore = ReportTemplateStore()
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

  
  const tableDataRef = ref({
    columns: [],
    rows: [],
    rowSchema: [],
    pageSize: 0,
    hasAddRowButton: false,
    addRowCount: 1
  })
  
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

  
  const initialization = () => {
    if (props?.item?.data && !props?.item?.data?.hasAddRowButton) {
      tableDataRef.value = props?.item?.data
    } else {
      tableDataRef.value = {
        ...props?.item?.data,
        rows: []
      }
      console.log('tableDataRef.value:', toRaw(tableDataRef.value))
    }
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
  })
  
  
  
  </script>
  
  
  <style>
  
  .report-table .ant-table-cell.ant-table-selection-column {
    min-width: 30px!important;
    width: 30px!important
  }
  </style>