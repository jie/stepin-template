<template>
  <div v-if="!store.loading">
    <Designer ref="designerRef" />
    <!-- <div class="flex" style="justify-content: center; align-items:center; min-height: 800px; ">
      <div style="width: 460px;display:block;">
        <div
          style="border: 1px solid #999; height: 200px; width: 100%;padding: 20px; border-radius: 10px; background: #eee;">
          <h4>Please login to fill report</h4>
        </div>

        <div
          style="border: 1px solid #999; margin-top: -130px; padding: 20px; border-radius: 10px; background: #fff; box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);">
          <a-form layout="vertical">
            <a-form-item label="E-mail" name="email">
              <a-input v-model="store.email"></a-input>

            </a-form-item>
            <a-form-item label="Password" name="password">

              <a-input v-model="store.password"></a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" style="float:right" @click="onClickLogin">Login</a-button>
            </a-form-item>
          </a-form>
        </div>

      </div>
    </div> -->
  </div>
  <div v-else class="flex" style="justify-content: center; align-items:center; width: 100%; min-height: 600px;">
    <Spin font-size="60px" />
  </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, toRaw } from "vue"
import Designer from "@/components/design/public_report.vue"
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
const permissionForm = reactive({
  email: "",
  password: ""
})
const initialization = async () => {
  // store.loading = true
  // hasPermissionRef.value = await store.apiCheckPermission()
  // if (!hasPermissionRef.value) {
  //   store.loading = false

  //   return
  // }
  // store.loading = false
  hasPermissionRef.value = true
  await store.apiGet(route.params.reportId)
  if (!store.report.items || store.report.items.length == 0) {
    let localRecord = await reportDatabase.getRecord(route.params.reportId)
    if (!localRecord) {
      designerRef.value.refresh({ items: store.report.schema, title: 'Title', summary: 'Summary', id: store.report.id })
      return
    }

    let localDate = dayjs(localRecord.update_at)
    let serverDate = dayjs(store.report.update_at)
    if (localDate > serverDate) {
    }

    if (store.report.items.length === 0 || (localDate > serverDate)) {
      let values = JSON.parse(localRecord.values)
      console.log('values:', values)
      if(!values || values.length != 0) {
        for(let valueItem of values) {
          let item = store.report.schema.find(o=>o.key == valueItem.key)
          console.log('item:', toRaw(item))
          if(item) {
            item.data = valueItem.value
          }
        }
      }
    }
  }
  console.log('store.report:', toRaw(store.report.schema)) 
  designerRef.value.refresh({ items: store.report.schema, title: 'Title', summary: 'Summary', id: store.report.id, isLocal: true })
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