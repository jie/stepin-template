<template>
  <div class="report relative" v-if="store.report?.schema">
    <a-modal :getContainer="() => document.body" v-model:visible="isShowSubmitDialog"
      :title="$t('base.PleaseEnterReviewComments')" @ok="handleSubmitOk">
      <a-form :model="submitFormData" layout="vertical">
        <a-form-item :label="$t('base.Status')" name="approve_status" required>
          <a-select :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }"
            v-model:value="submitFormData.approve_status" style="width: 100%">
            <a-select-option :value="option.value" v-for="option in approveStatuses">{{ option.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('base.Reason')" name="approve_reason" required>
          <a-textarea v-model:value="submitFormData.approve_reason" />
        </a-form-item>
        <a-form-item :label="$t('base.Email')" name="email" required>
          <a-input v-model:value="submitFormData.email"></a-input>
        </a-form-item>
        <a-form-item :label="$t('base.Password')" name="password" required v-if="store.report?.settings.approve_password">
          <a-input type="password" v-model:value="submitFormData.password"></a-input>
        </a-form-item>
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
              <a-date-picker style="width: 100%" v-model:value="formState['DateOfInspection']"
                :getPopupContainer="triggerNode => triggerNode.parentNode" />
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ArrivalTime">
            <a-form-item required :label="$t('base.ArrivalTime')">
              <a-date-picker style="width: 100%" :show-time="{ format: 'HH:mm' }" v-model:value="formState['ArrivalTime']"
                :getPopupContainer="triggerNode => triggerNode.parentNode" />
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.DepartureTime">
            <a-form-item required :label="$t('base.DepartureTime')">
              <a-date-picker style="width: 100%" :show-time="{ format: 'HH:mm' }"
                v-model:value="formState['DepartureTime']" :getPopupContainer="triggerNode => triggerNode.parentNode" />
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Inspector">
            <a-form-item required :label="$t('base.Inspector')">
              <a-input v-model:value="formState['Inspector']"></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.InspectionStandard">
            <a-form-item required :label="$t('base.InspectionStandard')">
              <a-input v-model:value="formState['InspectionStandard']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.GeneralInspectionLevel">
            <a-form-item required :label="$t('base.GeneralInspectionLevel')">
              <a-radio-group v-model:value="formState['GeneralInspectionLevel']" allowClear>
                <a-radio value="I">I</a-radio>
                <a-radio value="II">II</a-radio>
                <a-radio value="III">III</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.SampleSize">
            <a-form-item required :label="$t('base.SampleSize')">
              <a-input-number v-model:value="formState['SampleSize']" style="width: 100%;" allowClear></a-input-number>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ReportNumber">
            <a-row style="width: 100%" :gutter="[16,16]">
              <a-col :span="8" >
                <a-form-item required :label="$t('base.AQL_CR')">
                  <a-input v-model:value="formState['AQL_CR']" allowClear></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item required :label="$t('base.AQL_MAJ')">
                  <a-input v-model:value="formState['AQL_MAJ']" allowClear></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item required :label="$t('base.AQL_MIN')">
                  <a-input v-model:value="formState['AQL_MIN']" allowClear></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <div class="component meta" v-if="store.report?.template?.settings?.InspectionType">
            <a-form-item required :label="$t('base.InspectionType')">
              <a-radio-group v-model:value="formState['InspectionType']" allowClear>
                <a-radio value="PPI">PPI</a-radio>
                <a-radio value="DPI">DPI</a-radio>
                <a-radio value="PSI">PSI</a-radio>
                <a-radio value="Re-PSI">Re-PSI</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ReInspectionType">
            <a-form-item required :label="$t('base.ReInspectionType')">
              <a-radio-group v-model:value="formState['ReInspectionType']" allowClear>
                <a-radio value="1ST">1ST</a-radio>
                <a-radio value="2ST">2ST</a-radio>
                <a-radio value="3ST">3ST</a-radio>
              </a-radio-group>
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
              <a-button type="primary" html-type="submit" style="width: 240px; margin-left: 10px;">{{ $t('base.SubmitReviewResult') }}</a-button>
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
import reportRadio from "./reportRadio/index.vue"
import reportCheckbox from "./reportCheckbox/index.vue"
import reportImage from "./reportImage/index.vue"
import reportImageUpload from "./reportImageUpload/index.vue"
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
const initialization = () => {
  refresh(store.report)
}

const itemRefs = ref([])

const loadLocalData = async () => {
  let localRecord = await reportDatabase.getRecord(store.report.id)
  if (!localRecord) {
    return
  }
  let values = JSON.parse(localRecord.values)
  console.log('values:', values)
  for (let key of Object.keys(values)) {
    formState[key] = values[key]

  }
  console.log('formState:', formState)
}


const editableComponents = [
  "input",
  "radio",
  "checkbox",
  "image_upload",
  "table",
]

const refresh = (data: any) => {
  console.log('refresh*******************:', data)
  loadingRef.value = true
  reportDataRef.value = data
  setTimeout(() => {
    store.report.schema.map((item: any) => {
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
    result = await store.apiReview(submitFormData.email, submitFormData.password, submitFormData.approve_status, submitFormData.approve_reason)
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

}</style>
  