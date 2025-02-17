<template>
  <div v-if="!store.loading && store.report.id">
    <Designer ref="designerRef" mode="review" />
  </div>
  <div v-if="store.loading" class="flex" style="justify-content: center; align-items:center; width: 100%; min-height: 600px;">
    <Spin font-size="60px" />
  </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, toRaw } from "vue"
import Designer from "@/components/design/public_approve.vue"
import { ReportFillStore } from "@/store/report_fill"
import Spin from "@/components/spin/index.vue"
import { useRouter, useRoute } from "vue-router"
import { reportDatabase } from "@/hook/dexie_hook"
import dayjs from "dayjs"
const router = useRouter()
const route = useRoute()
const designerRef = ref(null)
const store = ReportFillStore()
const hasPermissionRef = ref(false)

const initialize = async () => {
  store.loading = true
  // hasPermissionRef.value = await store.apiCheckPermission()
  // console.log('hasPermissionRef.value:', hasPermissionRef.value, store.report)
  // if (!hasPermissionRef.value) {
  //   store.loading = false
  //   return
  // }
  // store.loading = false

  // if(hasPermissionRef.value) {
  //   await store.apiGet(route.params.reportId)
  //   console.log('**report:', toRaw(store.report))
  //   store.loading = false
  // }

  await store.apiQueryDefectByReportId(route.params.reportId)
  await store.apiGet(route.params.reportId)
    console.log('**report:', toRaw(store.report))
    store.loading = false
}

const onClickLogin = async () => {
  store.loading = true
  hasPermissionRef.value = await store.apiCheckPermission()
  if (!hasPermissionRef.value) {
    store.loading = false

    return
  }
  store.loading = false
}


initialize()
</script>