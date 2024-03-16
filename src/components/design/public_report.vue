<template>
  <div class="report relative" v-if="store.report?.schema">
    <a-modal :getContainer="() => document.body" v-model:visible="isShowSubmitDialog"
      :title="$t('base.ValidatePrivileges')" @ok="handleSubmitOk">
      <a-form :model="submitFormData" layout="">
        <a-form-item label="E-mail" name="email" required>
          <a-input v-model:value="submitFormData.email"></a-input>
        </a-form-item>
        <a-form-item label="Password" name="password" required v-if="store.report?.settings.validate_password">
          <a-input type="password" v-model:value="submitFormData.password"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal :getContainer="() => document.body" v-model:visible="loadLocalDataDialogRef"
      :title="$t('base.FindLatestLocalData')" @ok="handleConfirmUseLocalData">
      <div>
        <div><span>{{ $t('base.LocalDataUpdateAt') }}:</span><span>{{ localDataRecord.update_at }}</span></div>
        <div><span>{{ $t('base.RemoteDataUpdateAt') }}:</span><span>{{ store.report.update_at }}</span></div>
      </div>
    </a-modal>
    <div
      style="max-width: 1024px;  padding: 20px 20px 100px 20px; height: 100%; background-color: #fff; margin: 0 auto; position: relative;">

      <div v-if="loadingRef"
        style="display:flex; justify-content: center; align-items: center; width: 100%; height: 100%; z-index: 1000;position: absolute;left:0;top:0;right:0;bottom:0;background-color: rgba(255, 255, 255, 0.8);">
        <Spin font-size="60px" />
      </div>
      <div class="title">
        <div>{{ store.report?.title }}</div>
      </div>
      <div class="summary">
        <div>{{ store.report?.summary }}</div>
      </div>
      <a-form layout="vertical" :model="formState" v-if="store.report" @finish="onFinishSubmit" @finishFailed="onFinishFailed">
        <div v-if="store.report">
          <div class="component meta" v-if="store.report?.template?.settings?.ReportNumber">
            <a-form-item required :label="$t('base.ReportNumber')">
              <a-input v-model:value="formState['ReportNumber']"></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Applicant">
            <a-form-item required :label="$t('base.Applicant')">
              <a-input v-model:value="formState['Applicant']"></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Supplier">
            <a-form-item required :label="$t('base.Supplier')">
              <a-input v-model:value="formState['Supplier']"></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Factory">
            <a-form-item required :label="$t('base.Factory')">
              <a-input v-model:value="formState['Factory']"></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ItemNumber">
            <a-form-item required :label="$t('base.ItemNumber')">
              <a-textarea v-model:value="formState['ItemNumber']"></a-textarea>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ProductDescription">
            <a-form-item required :label="$t('base.ProductDescription')">
              <a-textarea v-model:value="formState['ProductDescription']"></a-textarea>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.AddressOfInspection">
            <a-form-item required :label="$t('base.AddressOfInspection')">
              <a-input v-model:value="formState['AddressOfInspection']"></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.DateOfInspection">
            <a-form-item required :label="$t('base.DateOfInspection')">
              <a-date-picker style="width: 100%" v-model:value="formState['DateOfInspection']" :getPopupContainer="triggerNode => triggerNode.parentNode"/>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ArrivalTime">
            <a-form-item required :label="$t('base.ArrivalTime')">
              <a-date-picker style="width: 100%" :show-time="{ format: 'HH:mm' }" v-model:value="formState['ArrivalTime']" :getPopupContainer="triggerNode => triggerNode.parentNode"/>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.DepartureTime">
            <a-form-item required :label="$t('base.DepartureTime')">
              <a-date-picker style="width: 100%" :show-time="{ format: 'HH:mm' }" v-model:value="formState['DepartureTime']" :getPopupContainer="triggerNode => triggerNode.parentNode"/>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Inspector">
            <a-form-item required :label="$t('base.Inspector')">
              <a-input v-model:value="formState['Inspector']"></a-input>
            </a-form-item>
          </div>
        </div>
        <div v-for="(item, index) in store.report.schema" :key="item.key">
          <div class="component" v-if="item.type == 'text'">
            <reportText :item="item" ref="itemRefs" />
          </div>
          <div class="component" v-else-if="item.type == 'input'">
            <reportInput :item="item" ref="itemRefs" v-model:value="formState[item.key]" />
          </div>
          <div class="component" v-else-if="item.type == 'input_group'">
            <reportInputGroup :item="item" ref="itemRefs" v-model:value="formState[item.key]" />
          </div>
          <div class="component" v-else-if="item.type == 'radio'">
            <reportRadio :item="item" v-model:value="formState[item.key]" ref="itemRefs" />
          </div>
          <div class="component" v-else-if="item.type == 'checkbox'">
            <reportCheckbox :item="item" v-model:value="formState[item.key]" ref="itemRefs" />
          </div>
          <div class="component" v-else-if="item.type == 'image'">
            <reportImage :item="item" ref="itemRefs" />
          </div>
          <div class="component" v-else-if="item.type == 'image_upload'">
            <reportImageUpload :item="item" v-model:value="formState[item.key]" ref="itemRefs" />
          </div>
          <div class="component" v-else-if="item.type == 'table'">
            <reportTable :item="item" v-model:value="formState[item.key]" ref="itemRefs"></reportTable>
          </div>
          <div class="component" v-else-if="item.type == 'container'">
            <reportContainer :item="item" ref="itemRefs"></reportContainer>
          </div>
          <div v-else>unsupported components: {{ item }}</div>
        </div>


        <a-affix :offset-bottom="20" @change="affixedChange">
          <div class="controls border-t" :class="{ 'affixed-style': isAffixedRef, 'unaffixed-style': !isAffixedRef }"
            style="">
            <div>
              <a-button type="primary" html-type="submit" style="width: 140px; margin-left: 10px;">{{ $t('base.Submit') }} </a-button>
              <a-popconfirm :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }"
                @confirm="onSave" :title="$t('base.ConfirmSave')" :ok-text="$t('base.Yes')" :cancel-text="$t('base.No')">
                <a-button type="" style="width: 140px; margin-left: 10px;">{{ $t('base.Save') }}</a-button>
              </a-popconfirm>
              <a-popconfirm :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }" v-if="localDataRecord"
                @confirm="onDeleteLocalData" :title="$t('base.ConfirmDelete')" :ok-text="$t('base.Yes')" :cancel-text="$t('base.No')">
                <a-button type="" style="width: 140px; margin-left: 10px;">{{ $t('base.DeleteLocalData') }}</a-button>
              </a-popconfirm>
            </div>
          </div>
        </a-affix>

      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, toRaw, reactive } from 'vue';
import reportTable from "./reportTable/index.vue"
import reportText from "./reportText/index.vue"
import reportInput from "./reportInput/index.vue"
import reportInputGroup from "./reportInputGroup/index.vue"
import reportRadio from "./reportRadio/index.vue"
import reportCheckbox from "./reportCheckbox/index.vue"
import reportImage from "./reportImage/index.vue"
import reportImageUpload from "./reportImageUpload/index.vue"
import reportContainer from "./container.vue"
import { reportDatabase } from "@/hook/dexie_hook"
import { openNotification, successNotification } from '@/utils/notification';
// import { copyObject } from "@/utils/objectUtils"
import Spin from "@/components/spin/index.vue"
import { ReportFillStore } from '@/store/report_fill';
import dayjs from 'dayjs';
const document = window.document
const store = ReportFillStore()
const isAffixedRef = ref(false)
const loadingRef = ref(false)
const formState = reactive({})
const reportDataRef = ref()
const itemRefs = ref([])
const loadLocalDataDialogRef = ref(false)
const localDataRecord = ref(null)
const startedRef = ref(false)
const affixedChange = (affixed: boolean) => {
  isAffixedRef.value = affixed
};

const initialization = async () => {
  console.log('loadLocalData')
  // loadLocalData()
  loadRemoteData()
  let localData = await loadLocalData()
  if(localData && localData.values &&  localData.values.length != 0) {
    if(dayjs(localData.update_at) > dayjs(store.report.update_at)) {
      loadLocalDataDialogRef.value = true
      localDataRecord.value = localData
    }
  }
}

const onSave = async () => {
  let record
  try {
    record = await reportDatabase.getRecord(store.report.id)
  } catch (e) {
    console.error(e)
  }
  console.log('formState:', toRaw(formState))
  if (!record) {
    await reportDatabase.createRecord({ id: store.report.id, values: JSON.stringify(formState) })
  } else {
    await reportDatabase.updateRecord({ id: store.report.id, values: JSON.stringify(formState) })
  }
  successNotification("Saved")
}

const loadLocalData = async () => {
  let localRecord
  try {
    localRecord = await reportDatabase.getRecord(store.report.id)
  } catch(e) {
    console.warn(e)
  }
  if (!localRecord) {
    return
  }
  let values = JSON.parse(localRecord.values)
  return {
    id: localRecord.id,
    create_at: localRecord.create_at,
    update_at: localRecord.update_at,
    values: values
  }
}

const loadRemoteData = async () => {
  if (store?.report?.values && Object.keys(store.report.values).length != 0) {
    for (let key of Object.keys(store.report.values)) {
      formState[key] = store.report.values[key]
    }
  }

  console.log('schema:', toRaw(store?.report?.schema))

  if (store?.report?.template?.settings) {

    formState["ReportNumber"] = store.report.values["ReportNumber"] || ""
    formState["Applicant"] = store.report.values["Applicant"] || ""
    formState["Supplier"] = store.report.values["Supplier"] || ""
    formState["Factory"] = store.report.values["Factory"] || ""
    formState["ItemNumber"] = store.report.values["ItemNumber"] || ""
    formState["ProductDescription"] = store.report.values["ProductDescription"] || ""
    formState["AddressOfInspection"] = store.report.values["AddressOfInspection"] || ""
    formState["DateOfInspection"] = ""
    if(store.report.values["DateOfInspection"]) {
      formState["DateOfInspection"] = dayjs(store.report.values["DateOfInspection"])
    }
    formState["ArrivalTime"] = ""
    if(store.report.values["ArrivalTime"]) {
      formState["ArrivalTime"] = dayjs(store.report.values["ArrivalTime"])
    }
    formState["DepartureTime"] = ""
    if(store.report.values["DepartureTime"]) {
      formState["DepartureTime"] = dayjs(store.report.values["DepartureTime"])
    }
    formState["Inspector"] = store.report.values["Inspector"] || ""
    if(store.report.order) {
      if(!formState["ReportNumber"]) {
        formState["ReportNumber"] = store.report.order.order_no
      }
      if(!formState["Factory"]) {
        formState["Factory"] = store.report.order.factory_name
      }
      if(!formState["Supplier"]) {
        formState["Supplier"] = store.report.order.suppliers
      }
      if(!formState["ItemNumber"]) {
        formState["ItemNumber"] = store.report.order.po_number
      }
      if(!formState["ProductDescription"]) {
        formState["ProductDescription"] = store.report.order.product_name
      }
      if(!formState["AddressOfInspection"]) {
        formState["AddressOfInspection"] = store.report.order.address?.country?.code == '1' ? `${store.report.order.address?.province?.name} ${store.report.order.address?.city?.name} ${store.report.order.address?.details}` : store.report.order.address?.country?.name
      }
      if(!formState["DateOfInspection"]) {
        formState["DateOfInspection"] = dayjs(store.report.order.inspect_date)
      }
      if(!formState["ArrivalTime"]) {
        formState["ArrivalTime"] = dayjs(`${store.report.order.inspect_date} 09:00:00`)
      }
      if(!formState["DepartureTime"]) {
        formState["DepartureTime"] = dayjs(`${store.report.order.inspect_date} 18:00:00`)
      }
      if(!formState["Inspector"]) {
        formState["Inspector"] = store.report.order.workers.map(c=>c.worker.name).join(',')
      }
    }
  }

}

const editableComponents = [
  "input",
  "input_group",
  "radio",
  "checkbox",
  "image_upload",
  "table",
]

const refresh = (data: any) => {
  loadingRef.value = true
  reportDataRef.value = data
  store.report.values = {}
  setTimeout(() => {
    store.report.schema.map((item: any) => {
      // if (item.refreshValue && item.props.item.data) {
      //   item.refreshValue(item.props.item.data)
      // }
      if (editableComponents.includes(item.type)) {
        if (item.type == 'input') {
          item.data = { value: '' }
        } else if (item.type == 'radio') {
          if (!item.data.value) {
            item.data.value = ""
          }
        } else if (item.type == 'checkbox') {
          if (!item.data.value) {
            item.data.value = []
          }
        }

        console.log('item.key:', item.key, ', data:', toRaw(item.data))
      }
    })
    loadingRef.value = false
    startedRef.value = true
  }, 2000)

}


const isShowSubmitDialog = ref(false)
const submitFormData = reactive({
  email: "",
  password: ""
})
const onFinishSubmit = () => {
  console.log('onFinishSubmit:', toRaw(formState))
  isShowSubmitDialog.value = true
}
const onFinishFailed = () => {
  console.log('onFinishFailed:')
}

const handleSubmitOk = async () => {
  // apiSubmit
  let result;
  try {
    result = await store.apiSubmit(submitFormData.email, submitFormData.password, formState)
  } catch (e) {
    openNotification({
      type: "error",
      message: "Submit report failed",
      description: e.message
    })
  }
  if (result) {
    successNotification("submit_report")
    isShowSubmitDialog.value = false
  }
}


const handleConfirmUseLocalData = async () => {
  for(let key of Object.keys(localDataRecord.value.values)) {
    formState[key] = localDataRecord.value.values[key]
  }
  loadLocalDataDialogRef.value = false
}

const onDeleteLocalData = () => {
  try {
    reportDatabase.deleteRecord(store.report.id)
    successNotification("local_data_deleted")
    localDataRecord.value = null
  } catch(e) {
    console.error(e)
    openNotification({
      type: "error",
      message: "Fail delete local data",
      description: e.message
    })
  }
}

initialization()

defineExpose({
  refresh,
  loadLocalData
})
</script>

<style scoped>
.report {
  color: #333
}

.report .desc {
  color: #999
}

.title,
.summary {
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.title {
  margin-top: 30px;
  font-size: 20px;
  font-weight: bold;
}

.summary {
  color: #999
}

.component {
  margin: 30px 0;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.component .options {
  text-align: left;
  margin-bottom: 10px;
}

.component.meta {
  margin: 0;
}

.affixed-style {
  border: 2px solid #ccc;
  border-radius: 20px;
  box-shadow: 2px 5px 10px #ddd;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  width: 100%;
}

.unaffixed-style {
  border-top: 2px solid #ccc;
  /* box top shadow */

  box-shadow: 0px 15px 10px -15px #333;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  width: 100%;

}
</style>
