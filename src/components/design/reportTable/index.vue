<template>
  <div ref="allModal">
    <BaseSlot :item="props?.item">
      <div v-if="props.mode == 'preview'">
        <a-table class="report-table" :columns="tableDataRef.columns" :data-source="previewRows" bordered size="small"
          :scroll="{ x: 1500 }" :pagination="tableDataRef?.pageSize == 0 ? false : { size: tableDataRef.addRowCount }"
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
                <a-input v-model:value="record[column.key]" :placeholder="record.fieldOptions[column.key].placeholder" />
              </template>
              <template v-else>{{ text }}</template>
            </template>
          </template>
        </a-table>
      </div>
      <div v-else>
        <a-table class="report-table" :columns="tableDataRef.columns" :data-source="props.value" bordered size="small"
          :scroll="{ x: 1500 }" :pagination="tableDataRef?.pageSize == 0 ? false : { size: tableDataRef.addRowCount }"
          :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }">

          <template #bodyCell="{ text, record, index, column }">
            <template
              v-if="record?.fieldOptions[column.key]?.fieldType == 'input' || record?.fieldOptions[column.key]?.fieldType == 'number'">
              <a-input v-model:value="record[column.key]" :placeholder="record.fieldOptions[column.key].placeholder"
                allowClear />
            </template>
            <template v-else>{{ text }}</template>
          </template>
        </a-table>
        <div v-if="tableDataRef?.hasAddRowButton">
          <a-button type="primary" @click="showAddRowDialog" class="mt-2">{{ $t('base.Add') }}</a-button>
          <a-popconfirm :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }"
            title="Please delete row?" :ok-text="$t('base.Yes')" :cancel-text="$t('base.No')"
            @confirm="confirmDeleteRowItem" v-if="state.selectedRowKeys && state.selectedRowKeys.length != 0">
            <a-button type="danger" class="mt-2 ml-2">{{ $t('base.Delete') }}</a-button>
          </a-popconfirm>
        </div>
      </div>
    </BaseSlot>
    <a-modal v-model:visible="AddRowDialogVisible" :title="$t('base.AddRow')" :ok-text="$t('base.Confirm')"
      :cancel-text="$t('base.Cancel')" @ok="handleConfirmAddRow" @onCancel="handleCancelAddRow" :z-index="1001" style="width: 100%;max-width: 900px; margin: 20px auto"
      :getContainer="() => $refs.allModal">
      <a-form name="basic" autocomplete="off" layout="vertical">

        <template v-for="row in formRows">
          <div v-for="col in tableDataRef.columns">
            <div>{{ row[col.key] }}</div>
            <a-form-item :label="col.title"
              v-if="col.children.length == 0 && (row.fieldOptions[col.key].fieldType == 'input' || row.fieldOptions[col.key].fieldType == 'number')">
              <a-auto-complete :getPopupContainer="triggerNode => triggerNode.parentNode"
                v-model:value="row.fieldOptions[col.key].val" style="width: 100%"
                v-if="row.fieldOptions[col.key].is_defect" :options="defectOptions" @search="handleSearchDefect"
                allowClear>
                <template
                  #option="{ content_en: content_en, id: id, content: content, types: types, product: product, product_en: product_en }">
                  <div style="display:flex;" @click="onDefectSelect(row, col.key, id)">
                    <div @click="onDefectSelect(row, child.key, id)">
                      <div style="margin-bottom: 2px"><a-tag v-for="tag in types">{{ tag }}</a-tag></div>
                      <div>{{ product }}: {{ content }}</div>
                      <div>{{ product_en }}: {{ content_en }}</div>
                    </div>
                  </div>
                </template>
              </a-auto-complete>

              <a-input v-model:value="row.fieldOptions[col.key].val" allowClear v-else />
            </a-form-item>


            <div v-if="col.children && col.children.length != 0">
              <div v-for="child in col.children">
                <a-form-item :label="`${col.title} - ${child.title}`"
                  v-if="!child.children || child.children.length == 0">
                  <a-auto-complete :getPopupContainer="triggerNode => triggerNode.parentNode"
                    v-model:value="row.fieldOptions[child.key].val" style="width: 100%" placeholder=""
                    :options="defectOptions" v-if="row.fieldOptions[child.key].is_defect" @search="handleSearchDefect"
                    allowClear>
                    <template
                      #option="{ content_en: content_en, id: id, content: content, types: types, product: product, product_en: product_en }">
                      <div @click="onDefectSelect(row, child.key, id)">
                        <div style="margin-bottom: 2px"><a-tag v-for="tag in types">{{ tag }}</a-tag></div>
                        <div>{{ product }}: {{ content }}</div>
                        <div>{{ product_en }}: {{ content_en }}</div>
                      </div>
                    </template>
                  </a-auto-complete>
                  <a-input v-model:value="row.fieldOptions[child.key].val" v-else allowClear />
                </a-form-item>
                <div v-else>
                  <a-form-item :label="`${col.title} - ${child.title} - ${oChild.title}`"
                    v-for="oChild in child.children">
                    <a-auto-complete :getPopupContainer="triggerNode => triggerNode.parentNode"
                      v-model:value="row.fieldOptions[oChild.key].val" style="width: 100%" placeholder=""
                      :options="defectOptions" v-if="row.fieldOptions[oChild.key].is_defect" @search="handleSearchDefect"
                      allowClear>
                      <template
                        #option="{ content_en: content_en, id: id, content: content, types: types, product: product, product_en: product_en }">
                        <div style="display:flex" @click="onDefectSelect(row, oChild.key, id)">
                          <div @click="onDefectSelect(row, child.key, id)">
                            <div style="margin-bottom: 2px"><a-tag v-for="tag in types">{{ tag }}</a-tag></div>
                            <div>{{ product }}: {{ content }}</div>
                            <div>{{ product_en }}: {{ content_en }}</div>
                          </div>
                        </div>
                      </template>
                    </a-auto-complete>
                    <a-input v-model:value="row.fieldOptions[oChild.key].val" v-else allowClear />
                  </a-form-item>
                </div>
              </div>
            </div>


          </div>
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
import { copyObject } from "@/utils/objectUtils"
import { ReportFillStore } from "@/store/report_fill"
import { EditOutlined } from "@ant-design/icons-vue";
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

const tableDataRef = ref({
  columns: [],
  rows: [],
  rowSchema: [],
  pageSize: 0,
  hasAddRowButton: false,
  addRowCount: 1
})

// add computed column
const previewRows = computed(() => {
  return tableDataRef.value?.rows.map((row, index) => {
    row.key = index
    return row
  })
})


const tableDataColumnsComputed = computed(() => {
  return tableDataRef.value?.columns.map((col, index) => {
    col.responsive = ['small']
    return col
  })
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

const clickEditRow = (val: any) => {
  emits('edit-table-row', val)
}


const showAddRowDialog = () => {
  let _formRows = tableDataRef.value.rowSchema.slice(0, tableDataRef.value.addRowCount)
  formRows.value = copyObject(_formRows)
  AddRowDialogVisible.value = true
}

const confirmDeleteRowItem = () => {
  deleteSelectedRows()
}


const handleConfirmAddRow = () => {
  let newRows = [...props.value]
  for (let row of formRows.value) {
    for (let key of Object.keys(row.fieldOptions)) {
      if (row.fieldOptions[key].fieldType == 'input') {
        row[key] = row.fieldOptions[key].val
      }
    }
    newRows.push(copyObject(row))
  }
  newRows = newRows.map((row: any, index: number) => {
    row.key = index
    return row
  })
  AddRowDialogVisible.value = false
  emits('update:value', newRows)
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
  min-width: 30px !important;
  width: 30px !important
}
</style>