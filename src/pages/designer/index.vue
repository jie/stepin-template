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
import { useRoute } from "vue-router";
import router from "@/router";
const route = useRoute()
const store = ReportTemplateStore()

// const componentItems = ref([])

// store.initReportTemplate({
//   title: "MY REPORT TEMPLATE",
//   summary: "MY REPORT TEMPLATE SUMMARY",
//   settings: {
//     allowSelectImageFromAlbum: true,
//   },
//   items: [],
// })


const initializeData = async () => {
  let id = route.query.id
  if (id) {
    // let record = await db.getReportTemplate(id as string)
    // console.log('record1:', record)
    // store.initReportTemplate({
    //   id: record.id,
    //   title: record.title,
    //   summary: record.summary,
    //   settings: record.settings || {allowSelectImageFromAlbum: true},
    //   items: record.items || []
    // })
    
    let record = await store.apiGetTemplate(id)
    console.log('record:', record)
    record = record.entity
    store.initReportTemplate({
      id: record.id,
      title: record.title,
      summary: record.summary,
      settings: record.settings || {allowSelectImageFromAlbum: true},
      items: record.items || []
    })
  }
}


const onSaveTemplate = async (data:any) => {
  let result = await store.apiUpdate(data["data"])
  console.log('save-result:', result)
  router.back()
}


initializeData()
</script>
<template>
  <div class="table w-full h-full">
    <Designer v-on:on-save-template="onSaveTemplate"/>
  </div>
</template>
