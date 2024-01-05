<template>
  <a-table :columns="columns" :data-source="rows" bordered size="middle" :scroll="{ x: 'calc(700px + 50%)', y: 240 }">
    <template #bodyCell="{ text, record, index, column }">
      <a-input v-model:value="record.fieldOptions[column.key].value" :placeholder="record.fieldOptions[column.key].placeholder" />
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { toRaw } from 'vue';
const props = defineProps(["item"])

// extends TableColumnsType
type MyTableColumnsType = TableColumnsType & {
  fieldType: string,
}

const columns = ref<MyTableColumnsType>([{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  width: 100,
  fixed: 'left',
  fieldType: 'input',
  children: []
},])

const rows = ref([
  {
    name: 'Name',
    fieldOptions: {
      name: {
        fieldType: "input",
        value: "",
        placeholder: ""
      }
    }
  }
])

const getTableData = () => {
  return {
    columns,
    rows
  }
}

const updateTableData = (data: any) => {
  console.log('updatetabledata:', data)
  columns.value = JSON.parse(JSON.stringify(data.columns))
  if (data.rows && data.rows.length != 0) {
    console.log('data.rows:', toRaw(data.rows))
    rows.value = JSON.parse(JSON.stringify(data.rows))
  }

}

const addRow = (row: any) => {
  console.log('addRow:', row)
  rows.value.push(row)
}

defineExpose({
  getTableData,
  updateTableData,
  addRow,
  props
})

</script>