<script lang="ts" setup>
import Designer from "@/components/design/index.vue"
import { ReportTemplateStore } from "@/store/reportTemplate"
import {
  ReportTitle,
  ReportInput,
  ReportTable,
  ReportImage,
  ReportImageUpload,
  ReportRadio,
  ReportCheckbox,
  ReportContainer,
} from "@/types/components"
import { ref } from "vue"
const items = [
  // {
  //   title: "text title", desc: "text desc", type: "container", key: "1", data: {
  //     children: [
  //       { title: "text 1-2 title", desc: "text 1-2 desc", type: "text", key: "1-2", size: 1 },
  //       { title: "text 1-2 title", desc: "text 1-2 desc", type: "text", key: "1-2", size: 1 },
  //     ]
  //   }
  // },
  // { title: "input", desc: "input desc", type: "input" },
  // { title: "radio", desc: "radio desc", type: "radio" },
  // { title: "checkbox", desc: "checkbox desc", type: "checkbox" },
  // { title: "image", desc: "image desc", type: "image" },
  // { title: "image_upload", desc: "image_upload desc", type: "image_upload" },
  // {
  //   title: "table", desc: "table desc", type: "table", data: {
  //     columns: [{
  //       title: 'Name',
  //       dataIndex: 'name',
  //       key: 'name',
  //       width: 100,
  //       fixed: 'left',
  //       fieldType: 'input',
  //       children: []
  //     }], rows: [{
  //       name: 'Name',
  //       fieldOptions: {
  //         name: {
  //           fieldType: "input",
  //           value: "",
  //           placeholder: ""
  //         }
  //       }
  //     }]
  //   }
  // },
]
console.log('items:', ReportTemplateStore)
const store = ReportTemplateStore()
// const componentItems = ref([])

store.initReportTemplate({
  title: "MY REPORT TEMPLATE",
  summary: "MY REPORT TEMPLATE SUMMARY",
  items: [],
})

items.forEach((item: any) => {
  let newItem;
  switch (item.type) {
    case "container":
      newItem = new ReportContainer(item)
      store.addComponent(newItem)
      break
    case "text":
      newItem = new ReportTitle(item)
      store.addComponent(newItem)
      break
    case "input":
      newItem = new ReportInput(item)
      store.addComponent(newItem)
      break
    case "table":
      newItem = new ReportTable(item)
      store.addComponent(newItem)
      break
    case "image":
      newItem = new ReportImage(item)
      store.addComponent(newItem)
      break
    case "image_upload":
      newItem = new ReportImageUpload(item)
      store.addComponent(newItem)
      break
    case "radio":
      newItem = new ReportRadio(item)
      store.addComponent(newItem)
      break
    case "checkbox":
      newItem = new ReportCheckbox(item)
      store.addComponent(newItem)
      break
    default:
      break
  }
})

// store.addComponents(componentItems.value)

</script>
<template>
  <div class="table w-full h-full">
    <Designer />
  </div>
</template>
