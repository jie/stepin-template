<script lang="ts" setup>
import Report from "@/components/report_designer/index"
import { ref } from "vue"
const items = [
  {
    title: "text title", desc: "text desc", type: "container", key: "1", children: [
      { title: "text 1-2 title", desc: "text 1-2 desc", type: "text", key: "1-2", size: 1 },
      { title: "text 1-2 title", desc: "text 1-2 desc", type: "text", key: "1-2", size: 1 },
    ]
  },
  { title: "input input", desc: "input desc", type: "input", key: "2" },
  {
    title: "table input", desc: "table desc", type: "table", key: "3", data: {
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
  },
]

</script>
<template><div class="table w-full h-full">
  <Report title="My Report" summary="My summary" :items="items" />
</div></template>
