<template>
  <a-table :columns="columns" :data-source="data" bordered size="middle" :scroll="{ x: 'calc(700px + 50%)', y: 240 }">
    <template #bodyCell="{ text, record, index, column }">
      <template v-if="record.fieldOptions">
        <!-- <a-input v-model:value="column.name" placeholder="" /> -->
        <a-input v-if="record.fieldOptions[column.key] && record.fieldOptions[column.key]['fieldType'] == 'input'"
          v-model:value="record.fieldOptions[column.key].value"
          :placeholder="record.fieldOptions[column.key].placeholder" />
        <div v-else>2</div>
      </template>
      <template v-else>{{ text }}</template>
    </template>
  </a-table>

</template>
<script lang="ts">
import type { TableColumnsType } from 'ant-design-vue';
import { defineComponent } from 'vue';
type TableDataType = {
  key: number;
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
};
const columns: TableColumnsType = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'Other',
    children: [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 200,
      },
      {
        title: 'Address',
        children: [
          {
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
            width: 200,
          },
          {
            title: 'Block',
            children: [
              {
                title: 'Building',
                dataIndex: 'building',
                key: 'building',
                width: 100,
              },
              {
                title: 'Door No.',
                dataIndex: 'number',
                key: 'number',
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Company',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        width: 200,
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
      },
    ],
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    fixed: 'right',
  },
];
//   const data = [...Array(100)].map((_, i) => ({
//     key: i,
//     name: 'John Brown',
//     age: i + 1,
//     street: 'Lake Park',
//     building: 'C',
//     number: 2035,
//     companyAddress: 'Lake Street 42',
//     companyName: 'SoftLake Co',
//     gender: 'M',
//   }));
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M',
    fieldOptions: {
      name: {
        fieldType: "input",
        value: "yang",
        placeholder: "Please input your name"
      }
    }
  },
  {
    key: '2',
    name: 'John Brown',
    age: 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M',
    fieldOptions: {
      age: {
        fieldType: "input",
        value: "yang",
        placeholder: "Please input your name"
      }
    }
  }
]
export default defineComponent({
  setup() {
    return {
      data,
      columns,
    };
  },
});
</script>