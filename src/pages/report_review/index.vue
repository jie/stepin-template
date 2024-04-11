<template>
  <div v-if="!store.loading">
    <Designer ref="designerRef" />
  </div>
  <div v-else class="flex" style="justify-content: center; align-items:center; width: 100%; min-height: 600px;">
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

const initialization = async () => {
  store.loading = true
  // hasPermissionRef.value = await store.apiCheckPermission()
  // if (!hasPermissionRef.value) {
  //   store.loading = false

  //   return
  // }
  // store.loading = false
  hasPermissionRef.value = true
  await store.apiGet(route.params.reportId)
  console.log('report:', toRaw(store.report))
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


initialization()
</script>