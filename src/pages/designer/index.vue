<script lang="ts" setup>
import Designer from "@/components/design/index.vue"
import { ReportTemplateStore } from "@/store/reportTemplate"
import { ref } from "vue"
const items = [
  { title: "text title", desc:"text desc", type: "container", key: "1", children: [
    {title: "text 1-2 title", desc:"text 1-2 desc", type: "text", key: "1-2", size: 1},
    {title: "text 1-2 title", desc:"text 1-2 desc", type: "text", key: "1-2", size: 1},
  ] },
  { title: "input input", desc:"input desc", type: "input", key: "2" },
  { title: "table input", desc:"table desc", type: "table", key: "3" },
  { title: "radio", desc:"radio desc", type: "radio", key: "4" },
  { title: "checkbox", desc:"checkbox desc", type: "checkbox", key: "5" },
  { title: "image", desc:"image desc", type: "image", key: "6" },
  { title: "image_upload", desc:"image_upload desc", type: "image_upload", key: "7" },
]
console.log('items:', ReportTemplateStore)
const store = ReportTemplateStore()
store.initReportTemplate({
    title: "MY REPORT TEMPLATE",
    summary: "MY REPORT TEMPLATE SUMMARY",
    items: items,
})

</script>
<template>
  <div class="table w-full h-full">
    <Designer />
  </div>
</template>
