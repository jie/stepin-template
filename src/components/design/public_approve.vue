<template>
  <div class="report relative review" v-if="store.report?.schema">
    <a-modal :getContainer="() => document.body" v-model:visible="isShowSubmitDialog"
      :title="$t('base.PleaseEnterReviewComments')" @ok="handleSubmitOk">
      <a-form :model="submitFormData" layout="vertical">
        <a-form-item :label="$t('base.Status')" name="approve_status">
          <a-select :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }"
            v-model:value="submitFormData.approve_status" style="width: 100%">
            <a-select-option :value="option.value" v-for="option in approveStatuses">{{ option.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('base.Reason')" name="approve_reason">
          <a-textarea v-model:value="submitFormData.approve_reason" />
        </a-form-item>
        <!-- <a-form-item :label="$t('base.Email')" name="email">
          <a-input v-model:value="submitFormData.email" readonly></a-input>
        </a-form-item>
        <a-form-item :label="$t('base.Password')" name="password" v-if="store.report?.settings.approve_password">
          <a-input type="password" v-model:value="submitFormData.password" readonly></a-input>
        </a-form-item> -->
      </a-form>
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

      <div v-if="reportInspectDetailRef.length != 0" style="margin-left: 10px; margin-right: 10px;">
        <a-row :gutter="[20, 20]" v-for="(row, index) in reportInspectDetailRef" :key="index"  style="margin-bottom: 20px">
          <a-col :span="12" v-for="(item, index) in row" :key="index">
            <div><strong>{{ item.key }}</strong>: <span style="float: right">{{ item.value }}</span>
            </div>
          </a-col>
        </a-row>
      </div>

      <a-form layout="vertical" :model="formState" v-if="store.report" @finish="onFinishSubmit"
        @finishFailed="onFinishFailed">
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
              <a-button type="primary" html-type="submit" style="width: 240px; margin-left: 10px;">{{
                $t('base.SubmitReviewResult') }}</a-button>
            </div>
          </div>
        </a-affix>
      </a-form>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { defineProps, ref, computed, toRaw, reactive } from 'vue';
import reportTable from "./reportTable/view.vue"
import reportText from "./reportText/index.vue"
import reportInput from "./reportInput/view.vue"
import reportRadio from "./reportRadio/view.vue"
import reportCheckbox from "./reportCheckbox/view.vue"
import reportImage from "./reportImage/index.vue"
import reportImageUpload from "./reportImageUpload/view.vue"
import reportContainer from "./container.vue"
import reportInputGroup from "./reportInputGroup/index.vue"
import { reportDatabase } from "@/hook/dexie_hook"
import { openNotification, successNotification } from '@/utils/notification';
// import { copyObject } from "@/utils/objectUtils"
import Spin from "@/components/spin/index.vue"
import { ReportFillStore } from '@/store/report_fill';
import dayjs from 'dayjs';
const document = window.document
const store = ReportFillStore()
const isAffixedRef = ref(false)
const startedRef = ref(false)

const loadingRef = ref(false)
const formState = reactive({})
const affixedChange = (affixed: boolean) => {
  console.log(affixed);
  isAffixedRef.value = affixed
};
const reportDataRef = ref()
const reportInspectDetailRef = ref([])
const initialization = () => {
  refresh(store.report)
}

const dateKeys = [
  "DateOfInspection",
]
const datetimeKeys = [
  "ArrivalTime",
  "DepartureTime",
]
const insepctDetailsKeys = [
  "ReportNumber",
  "Applicant",
  "Supplier",
  "Factory",
  "ItemNumber",
  "ProductDescription",
  "AddressOfInspection",
  "DateOfInspection",
  "ArrivalTime",
  "DepartureTime",
  "Inspector",
  "InspectionStandard",
  "GeneralInspectionLevel",
  "SampleSize",
  "InspectionType",
  "ReInspectionType"

]
const itemRefs = ref([])

const loadLocalData = async () => {
  let localRecord = await reportDatabase.getRecord(store.report.id)
  if (!localRecord) {
    return
  }
  let values = JSON.parse(localRecord.values)
  for (let key of Object.keys(values)) {
    formState[key] = values[key]
  }
}


const editableComponents = [
  "input",
  "radio",
  "checkbox",
  "image_upload",
  "table",
]

const refresh = async (data: any) => {
  console.log('refresh*******************:', data)
  loadingRef.value = true
  reportDataRef.value = data
  console.log('store.report:', toRaw(store.report.template))
  setTimeout(() => {
    // store.report.schema.map((item: any) => {
    store.report.template.items.map((item: any) => {
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
    for (let key of Object.keys(store.report.values)) {
      formState[key] = store.report.values[key]
    }

    if (store.report.values["DateOfInspection"]) {
      formState["DateOfInspection"] = dayjs(store.report.values["DateOfInspection"])
    }
    formState["ArrivalTime"] = ""
    if (store.report.values["ArrivalTime"]) {
      formState["ArrivalTime"] = dayjs(store.report.values["ArrivalTime"])
    }
    formState["DepartureTime"] = ""
    if (store.report.values["DepartureTime"]) {
      formState["DepartureTime"] = dayjs(store.report.values["DepartureTime"])
    }
    reportInspectDetailRef.value = generateInspectDetailRows()
    loadingRef.value = false
    startedRef.value = true
  }, 2000)

}


const isShowSubmitDialog = ref(false)
const approveStatuses = [
  { "label": "disapprove", "value": "0" },
  { "label": "approved", "value": "3" }
]
const submitFormData = reactive({
  email: "",
  password: "",
  approve_status: "",
  approve_reason: ""
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
    // result = await store.apiReview(submitFormData.email, submitFormData.password, submitFormData.approve_status, submitFormData.approve_reason)
    result = await store.apiAudit(submitFormData.approve_status, submitFormData.approve_reason)
  } catch (e) {
    console.error(e)
    openNotification({
      type: "error",
      message: "Submit report failed"
    })
  }
  if (result) {
    successNotification("submit_report")
    isShowSubmitDialog.value = false
  }
}

const formatDate = (date: any) => {
  return dayjs(date).format('YYYY-MM-DD')
}
const formatDatetime = (date: any) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}


const generateInspectDetailRows = () => {
  let rows = []
  // every 2 items in a row
  let row = []
  for (let key of Object.keys(formState)) {
    if (insepctDetailsKeys.includes(key) == false) {
      continue
    }
    if (dateKeys.includes(key)) {
      row.push({
        key: key,
        value: formatDate(formState[key])
      })
    } else if (datetimeKeys.includes(key)) {
      row.push({
        key: key,
        value: formatDatetime(formState[key])
      })
    } else {
      row.push({
        key: key,
        value: formState[key]
      })
    }

    if (row.length == 2) {
      rows.push(row)
      row = []
    }
  }

  if(formState["AQL_CR"] || formState["AQL_MAJ"] || formState["AQL_MIN"]) {

    if(rows[rows.length - 1].length == 1) {
      rows[rows.length - 1].push({key: 'AQL', value: `Cr: ${formState["AQL_CR"]} Maj: ${formState["AQL_MAJ"]} Min: ${formState["AQL_MIN"]}`})
    } else  {
      rows.push([{key: 'AQL', value: `Cr: ${formState["AQL_CR"]}, Maj: ${formState["AQL_MAJ"]}, Min: ${formState["AQL_MIN"]}`}])
    }
  }



  return rows
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

.review .component {
  margin: 0;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}


.component .options {
  text-align: left;
  margin-bottom: 10px;
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

.ant-col.ant-form-item-label label {
  font-weight: bold;
}
</style>
  