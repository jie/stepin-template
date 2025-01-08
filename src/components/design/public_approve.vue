<template>
  <div class="report relative review" :class="{ 'is-staff': isStaffReview }" v-if="store.report?.schema">

    <a-modal :getContainer="() => document.body" v-model:visible="isShowReviewModeDialog" :title="$t('base.Review')"
      width="100%" wrap-class-name="full-modal" :cancelButtonProps="{ hidden: true, }">
      <div ref="ReviewModeRef">
        <a-form layout="vertical" v-if="currentReviewComponentRef">
          <div v-for="(item, index) in store.report.schema" :key="item.key">
            <div class="component"
              v-if="item.key == currentReviewComponentRef.key && currentReviewComponentRef.type == 'text'">
              <reportText :item="currentReviewComponentRef" />
            </div>
            <div class="component"
              v-else-if="item.key == currentReviewComponentRef.key && currentReviewComponentRef.type == 'input'">
              <reportEditInput :item="currentReviewComponentRef"
                v-model:value="formState[currentReviewComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="item.key == currentReviewComponentRef.key && currentReviewComponentRef.type == 'input_group'">
              <reportEditInputGroup :item="currentReviewComponentRef"
                v-model:value="formState[currentReviewComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="item.key == currentReviewComponentRef.key && currentReviewComponentRef.type == 'radio'">
              <reportEditRadio :item="currentReviewComponentRef"
                v-model:value="formState[currentReviewComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="item.key == currentReviewComponentRef.key && currentReviewComponentRef.type == 'checkbox'">
              <reportEditCheckbox :item="currentReviewComponentRef"
                v-model:value="formState[currentReviewComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="item.key == currentReviewComponentRef.key && currentReviewComponentRef.type == 'image'">
              <reportImage :item="currentReviewComponentRef" />
            </div>
            <div class="component"
              v-else-if="item.key == currentReviewComponentRef.key && currentReviewComponentRef.type == 'image_upload'">
              <reportEditImageUpload :item="currentReviewComponentRef"
                v-model:value="formState[currentReviewComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="item.key == currentReviewComponentRef.key && currentReviewComponentRef.type == 'table'">
              <reportEditTable :item="currentReviewComponentRef"
                v-model:value="formState[currentReviewComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="item.key == currentReviewComponentRef.key && currentReviewComponentRef.type == 'container'">
              <reportContainer :item="currentReviewComponentRef"></reportContainer>
            </div>
          </div>
        </a-form>
      </div>
      <template #footer>
        <div>
          <div class="review-comment"
            v-if="currentReviewComponentRef && store.report.review_comments && store.report.review_comments[currentReviewComponentRef.key]">
            <div class="review-comment-title align-left">{{ $t('base.Comment') }}
              <span v-if="store.report.review_comments[currentReviewComponentRef.key].status === true">: {{
                $t('base.Pass') }}</span>
              <span v-if="store.report.review_comments[currentReviewComponentRef.key].status === false">: {{
                $t('base.NotPass') }}</span>
            </div>
            <a-textarea
              v-model:value="store.report.review_comments[currentReviewComponentRef.key].comment"></a-textarea>
          </div>
          <div>
            <a-button @click="onClickCancelReviewMode">{{ $t('base.Cancel') }}</a-button>
            <a-button type="success" @click="goPrevItem" :disabled="currentReviwComponentIndexRef == 0">{{
              $t('base.PrevItem') }}</a-button>
            <a-button @click="goNextItem"
              :disabled="currentReviwComponentIndexRef == (store.report.template?.items.length - 1)">{{
                $t('base.NextItem') }}</a-button>
            <a-button type="primary" style="background-color: #111BE9" @click="onClickSaveItem">{{ $t('base.Save') }}
              <template #icon>
                <SaveOutlined />
              </template>
            </a-button>
            <a-button type="danger" @click="onClickConfirmNotPassReviewMode">{{ $t('base.NotPass') }}
              <template #icon>
                <close-circle-outlined />
              </template>
            </a-button>
            <a-button type="primary" @click="onClickConfirmPassReviewMode">{{ $t('base.Pass') }}
              <template #icon>
                <check-circle-outlined />
              </template>
            </a-button>
          </div>
        </div>
      </template>
    </a-modal>


    <a-modal :getContainer="() => document.body" v-model:visible="isShowSubmitDialog"
      :title="$t('base.PleaseEnterReviewComments')" @ok="handleSubmitOk">
      <a-form :model="submitFormData" layout="vertical">
        <a-form-item :label="$t('base.Status')" name="approve_status">
          <a-select :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }"
            v-model:value="submitFormData.approve_status" style="width: 100%">
            <a-select-option :value="option.value" v-for="option in reviewStatuses">{{ option.label
              }}</a-select-option>
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
    <div class="report-wrapper" :class="{ 'is-staff': isStaffReview }">

      <div v-if="loadingRef"
        style="display:flex; justify-content: center; align-items: center; width: 100%; height: 100%; z-index: 1000;position: absolute;left:0;top:0;right:0;bottom:0;background-color: rgba(255, 255, 255, 0.8);">
        <Spin font-size="60px" />
      </div>
      <div class="flex">
        <img style="width:100%;" src="https://qcplatformassets.yilaw-ec.com/logo/ecqa_email_banner_hd.jpg"
          data-v-c2fb76a6="">
      </div>
      <div class="flex" style="padding: 10px;" v-if="store.report?.title">
        <div style="flex: 1">
          <div class="title">
            <div>{{ store.report?.title }}</div>
          </div>
          <div class="summary" v-if="store.report?.summary">
            <div>{{ store.report?.summary }}</div>
          </div>
        </div>
      </div>
      <!-- <div class="flex">
        <div style="width: 200px;">
          <img src="https://qcplatform.oss-cn-shanghai.aliyuncs.com/logo/report_logo.jpg" alt="">

        </div>
        <div style="flex: 1">
          <div class="title">
            <div>{{ store.report?.title }}</div>
          </div>
          <div class="summary">
            <div>{{ store.report?.summary }}</div>
          </div>
        </div>
      </div> -->
      <div class="component meta">
        <a-row :gutter="[20, 20]">
          <a-col :span="12">
            <div><strong>{{ $t('base.ReportResult') }}</strong>: <span style="float: right">
                <div class="flex">
                  <div style="color: green; align-items: center;" class="flex pr-3">
                    <span class="result-opt-box flex">
                      <span class="square" v-if="store.report.values.ReportResult == '3'">
                        <CheckOutlined style="font-size: 14px" />
                      </span>
                      <span class="square-empty" v-else style="display: inline-block; width: 20px;"></span>
                    </span>
                    <span class="result-opt-face">{{ $t('base.ResultPassed') }}</span>
                  </div>
                  <div style="color: orange; align-items: center;" class="flex pr-3">
                    <span class="result-opt-box flex">
                      <span class="square"
                        v-if="store.report.values.ReportResult == '1' || store.report.values.ReportResult == '2'">
                        <CheckOutlined style="font-size: 14px" />
                      </span>
                      <span class="square-empty" v-else style="display: inline-block; width: 20px;"></span>

                    </span><span class="result-opt-face">{{ $t('base.ResultPending') }}</span>
                  </div>
                  <div style="color: red; align-items: center;" class="flex pr-3">
                    <span class="result-opt-box flex">
                      <span class="square" v-if="store.report.values.ReportResult == '0'">
                        <CheckOutlined style="font-size: 14px" />
                      </span>
                      <span class="square-empty" v-else style="display: inline-block; width: 20px;"></span>
                    </span><span class="result-opt-face">{{ $t('base.ResultFailed') }}</span>
                  </div>
                </div>

              </span>
            </div>
          </a-col>
          <a-col :span="12">
            <div><strong>{{ $t('base.Reason') }}</strong>: <span style="float: right; word-break: break-all; ">{{
              store.report.values.ReportResultRemark }}</span>
            </div>
          </a-col>
        </a-row>
      </div>
      <div v-if="reportInspectDetailRef.length != 0" class="component meta">
        <a-row :gutter="[20, 20]" v-for="(row, index) in reportInspectDetailRef" :key="index"
          style="margin-bottom: 20px">
          <a-col :span="12" v-for="(item, index) in row" :key="index">
            <div><strong>{{ $t(`base.${item.key}`) }}</strong>: <span style="float: right">{{ item.value }}</span>
            </div>
          </a-col>
        </a-row>
      </div>

      <a-form layout="vertical" :model="formState" v-if="store.report && !route.query.is_simple"
        @finish="onFinishSubmit" @finishFailed="onFinishFailed">
        <div v-for="(item, index) in store.report.schema" :key="item.key" class="component-wrapper"
          :class="{ 'notpass': store.report?.review_comments[item.key].status == false, 'pass': store.report?.review_comments[item.key].status == true }">
          <div class="component" :id="`com-${item.key}`" v-if="item.type == 'text'">
            <reportText :item="item" ref="itemRefs" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'input'">
            <reportInput :item="item" ref="itemRefs" v-model:value="formState[item.key]" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'input_group'">
            <reportInputGroup :item="item" ref="itemRefs" v-model:value="formState[item.key]" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'radio'">
            <reportRadio :item="item" v-model:value="formState[item.key]" ref="itemRefs" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'checkbox'">
            <reportCheckbox :item="item" v-model:value="formState[item.key]" ref="itemRefs" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'image'">
            <reportImage :item="item" ref="itemRefs" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'image_upload'">
            <reportImageUpload :item="item" v-model:value="formState[item.key]" ref="itemRefs" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'table'">
            <reportTable :item="item" v-model:value="formState[item.key]" ref="itemRefs"></reportTable>
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'container'">
            <reportContainer :item="item" ref="itemRefs"></reportContainer>
          </div>
          <div v-else>unsupported components: {{ item }}</div>
          <div v-if="isStaffReview && store.report?.review_comments[item.key]?.comment">{{ $t('base.Comment') }}: {{
            store.report?.review_comments[item.key].comment }}</div>
          <div v-if="isStaffReview" class="edit-mode" @click="onClickShowReviewMode(item, index)">{{ $t('base.Review')
            }}
          </div>
        </div>
        <a-affix :offset-bottom="20" @change="affixedChange" v-if="isStaffReview">
          <div class="controls border-t" :class="{ 'affixed-style': isAffixedRef, 'unaffixed-style': !isAffixedRef }"
            style="">
            <div class="w-full flex" v-if="store.report.review_status != '0'">
              <div class="flex-1">
                <div>{{ $t('base.review_status') }}: {{ $t(`base.review_status_${store.report.review_status}`) }}</div>
                <div v-if="store.report.review_status != '1' && store.report.review_reason != ''">{{
                  $t('base.review_reason') }}: {{ store.report.review_reason }}</div>
              </div>
              <div class="" style=" padding: 20px">
                <a-button type="primary" html-type="submit">{{
                  $t('base.UpdateReviewResult') }}</a-button>
              </div>
              <!-- <template v-else>
                <div style="text-align: center;">
                  <div>{{ customerApproveStatusMsg[store.report?.approve_status] }}</div>
                  <div v-if="store.report?.approve_status == '0'">
                    <div style="font-size: 80%; color: #999"> {{ store.report?.approve_reason }}</div>
                    <div style="padding-top: 5px;padding-bottom: 5px">
                      <a-button type="primary" html-type="submit" style="width: 240px; margin-left: 10px;">{{
                        $t('base.SubmitReviewResult') }}</a-button>
                    </div>
                  </div>
                </div>
              </template> -->
            </div>
            <div v-else>
              <a-button type="primary" html-type="submit">{{
                $t('base.SubmitReviewResult') }}</a-button>
            </div>
          </div>
        </a-affix>
      </a-form>
    </div>
    <div class="catalog" v-if="isShowCatalogRef">
      <a-button type="primary" class="hide-catalog" shape="circle" size="large" @click="isShowCatalogRef = false">
        <template #icon>
          <VerticalRightOutlined />
        </template>
      </a-button>

      <div v-for="item in store.report.template?.items" class="item">
        <div @click="goAnchor(item.key)">{{ item.title }}</div>
      </div>
    </div>
    <a-affix :offset-top="60">
      <a-button class="catalog-show" v-if="!isShowCatalogRef" type="primary" shape="circle" size="large"
        @click="isShowCatalogRef = true">
        <template #icon>
          <VerticalLeftOutlined />
        </template>
      </a-button>
    </a-affix>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, toRaw, reactive, watchEffect, createVNode } from 'vue';
import reportTable from "./reportTable/view.vue"
import reportText from "./reportText/index.vue"
import reportInput from "./reportInput/view.vue"
import reportRadio from "./reportRadio/view.vue"
import reportCheckbox from "./reportCheckbox/view.vue"
import reportImage from "./reportImage/index.vue"
import reportImageUpload from "./reportImageUpload/view.vue"
import reportContainer from "./container.vue"
import reportInputGroup from "./reportInputGroup/index.vue"

import reportEditTable from "./reportTable/index.vue"
import reportEditInput from "./reportInput/index.vue"
import reportEditInputGroup from "./reportInputGroup/index.vue"
import reportEditRadio from "./reportRadio/index.vue"
import reportEditCheckbox from "./reportCheckbox/index.vue"
import reportEditImageUpload from "./reportImageUpload/index.vue"
import { Modal } from 'ant-design-vue';

import { reportDatabase } from "@/hook/dexie_hook"
import { CheckOutlined, SaveOutlined, CheckCircleFilled } from '@ant-design/icons-vue';
import { openNotification, successNotification } from '@/utils/notification';
// import { copyObject } from "@/utils/objectUtils"
import Spin from "@/components/spin/index.vue"
import { ReportFillStore } from '@/store/report_fill';
import dayjs from 'dayjs';
import { i18n } from '@/lang/i18n';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
const isShowCatalogRef = ref(false)
const route = useRoute()
const document = window.document
const store = ReportFillStore()
const isAffixedRef = ref(false)
const startedRef = ref(false)
const loadingRef = ref(false)
const formState = reactive({})
const isStaffReview = ref(false)
const isShowReviewModeDialog = ref(false)
const currentReviewComponentRef = ref(null)
const currentReviwComponentIndexRef = ref(-1)
const affixedChange = (affixed: boolean) => {
  console.log(affixed);
  isAffixedRef.value = affixed
};
const reportDataRef = ref()

const reportInspectDetailRef = ref([])
const initialization = () => {
  refresh(store.report)
  console.log('store.report?.reim_session:', toRaw(store.report?.reim_session))
}

const updateReviewComments = () => {
  if (!store.report.review_comments) {
    store.report.review_comments = {}
  }
  for (let item of store.report.template.items) {
    if (!store.report.review_comments[item.key]) {
      store.report.review_comments[item.key] = {
        comment: "",
      }
    }
  }
  console.log('store.report.review_comments:', toRaw(store.report.review_comments))
}

const reportResultOptions = [
  { label: i18n.global.t(`base.ResultPassed`), value: '3' },
  { label: i18n.global.t(`base.ResultPending`), value: '1' },
  { label: i18n.global.t(`base.ResultFailed`), value: '0' },
];

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
const reviewStatuses = [
  { "label": i18n.global.t("base.review_pending"), "value": "1" },
  { "label": i18n.global.t("base.review_disapprove"), "value": "-1" },
  { "label": i18n.global.t("base.review_approved"), "value": "2" }
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
  // submitFormData.approve_status = store.report?.approve_status
  // submitFormData.approve_reason = store.report?.approve_reason
  if (store.report.review_reason != '') {
    submitFormData.approve_reason = store.report.review_reason
  }
  submitFormData.approve_status = store.report.review_status
}
const onFinishFailed = () => {
  console.log('onFinishFailed:')
}

const handleSubmitOk = async () => {
  // apiSubmit
  let result;
  try {
    // result = await store.apiReview(submitFormData.email, submitFormData.password, submitFormData.approve_status, submitFormData.approve_reason)
    result = await store.apiReview({ id: store.report.id, review_status: submitFormData.approve_status, review_reason: submitFormData.approve_reason })
    // result = await store.apiAudit(submitFormData.approve_status, submitFormData.approve_reason)
  } catch (e) {
    console.error(e)
    openNotification({
      type: "error",
      message: i18n.global.t("base.AuditReportFailed"),
    })
  }
  if (result) {
    successNotification("submit_report")
    isShowSubmitDialog.value = false
    setTimeout(() => {
      window.location.reload()
    }, 1000)
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

  if (formState["AQL_CR"] || formState["AQL_MAJ"] || formState["AQL_MIN"]) {

    if (rows[rows.length - 1].length == 1) {
      rows[rows.length - 1].push({ key: 'AQL', value: `Cr: ${formState["AQL_CR"]} Maj: ${formState["AQL_MAJ"]} Min: ${formState["AQL_MIN"]}` })
    } else {
      rows.push([{ key: 'AQL', value: `Cr: ${formState["AQL_CR"]}, Maj: ${formState["AQL_MAJ"]}, Min: ${formState["AQL_MIN"]}` }])
    }
  }
  return rows
}

const goAnchor = (key: string) => {
  let anchor = document.getElementById(`com-${key}`)
  if (anchor) {
    anchor.scrollIntoView({
      behavior: "smooth"
    })
  }
}


const onClickShowReviewMode = (item: any, index: number) => {
  isShowReviewModeDialog.value = true
  console.log('item:', toRaw(item))
  // item to ReviewModeRef
  currentReviewComponentRef.value = item
  currentReviwComponentIndexRef.value = index
}

const goNextItem = () => {
  let index = store.report.template?.items.findIndex((item) => item.key == currentReviewComponentRef.value.key)
  if (index < store.report.template?.items.length - 1) {
    currentReviewComponentRef.value = store.report.template?.items[index + 1]
    currentReviwComponentIndexRef.value = index + 1
  }
}

const goPrevItem = () => {
  let index = store.report.template?.items.findIndex((item) => item.key == currentReviewComponentRef.value.key)
  if (index > 0) {
    currentReviewComponentRef.value = store.report.template?.items[index - 1]
    currentReviwComponentIndexRef.value = index - 1
  }
}

const onClickSaveItem = async () => {
  console.log('onClickSaveItem:', toRaw(formState[currentReviewComponentRef.value.key]))
  let values = {
    [currentReviewComponentRef.value.key]: formState[currentReviewComponentRef.value.key]
  }
  await store.apiFillSingleByStaff({
    id: store.report.id,
    values: values
  })

  let index = store.report.template?.items.findIndex((item) => item.key == currentReviewComponentRef.value.key)
  if (index < store.report.template?.items.length - 1) {
    Modal.confirm({
      content: i18n.global.t('base.SuccessSaved'),
      getContainer: () => document.body,
      async onOk() {
        currentReviewComponentRef.value = store.report.template?.items[index + 1]
        currentReviwComponentIndexRef.value = index + 1
      },
      icon: createVNode(CheckCircleFilled),
      cancelText: i18n.global.t('base.Cancel'),
      okText: i18n.global.t('base.NextItem'),
      onCancel() {
        Modal.destroyAll();
      },
    });
  } else {
    isShowReviewModeDialog.value = false
    currentReviewComponentRef.value = null
    currentReviwComponentIndexRef.value = -1
  }
}

const onClickConfirmPassReviewMode = async () => {
  store.report.review_comments[currentReviewComponentRef.value.key].status = true

  await store.apiSubmitReviewComment({
    id: store.report.id,
    key: currentReviewComponentRef.value.key,
    comment: store.report.review_comments[currentReviewComponentRef.value.key].comment,
    status: true,
  })

  if (currentReviwComponentIndexRef.value < store.report.template?.items.length - 1) {
    goNextItem()
  } else {
    isShowReviewModeDialog.value = false
    currentReviewComponentRef.value = null
    currentReviwComponentIndexRef.value = null
    setTimeout(() => {
      message.success(i18n.global.t("base.ReviewFinished"))
    }, 2000)

  }
}

const onClickConfirmNotPassReviewMode = async () => {
  store.report.review_comments[currentReviewComponentRef.value.key].status = false
  await store.apiSubmitReviewComment({
    id: store.report.id,
    key: currentReviewComponentRef.value.key,
    comment: store.report.review_comments[currentReviewComponentRef.value.key].comment,
    status: false,
  })

  if (currentReviwComponentIndexRef.value < store.report.template?.items.length - 1) {
    goNextItem()
  } else {
    isShowReviewModeDialog.value = false
    currentReviewComponentRef.value = null
    currentReviwComponentIndexRef.value = null
    setTimeout(() => {
      message.success(i18n.global.t("base.ReviewFinished"))
    }, 2000)
  }
}


const onClickCancelReviewMode = () => {
  isShowReviewModeDialog.value = false
  currentReviewComponentRef.value = null
  currentReviwComponentIndexRef.value = null
}

watchEffect(() => {
  if (isShowReviewModeDialog.value) {
    // add overflow hidden to <html> element to prevent scrolling
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    console.log('document.documentElement.style.overflow:', document.documentElement.style.overflow)
  } else {
    document.documentElement.style.overflow = 'auto'
    console.log('document.documentElement.style.overflow2:', document.documentElement.style.overflow)
    document.body.style.overflow = 'auto'
    currentReviewComponentRef.value = null
    currentReviwComponentIndexRef.value = -1
  }
})

watchEffect(() => {
  if (store?.report?.review_comments) {
    updateReviewComments()
  }
})

watchEffect(() => {
  if (route.path.includes('customer_report/')) {
    isStaffReview.value = false
  } else {
    isStaffReview.value = true
  }
})

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

.report-wrapper {
  max-width: 1024px;
  height: 100%;
  background-color: #fff;
  margin: 0 auto;
  position: relative;
}

.report-wrapper.is-staff {
  padding-bottom: 100px;
}

.report .desc {
  color: #999
}

.title,
.summary {
  border-radius: 5px;
  text-align: center;
}

.title {
  margin-top: 10px;
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

.component.meta {
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid #ccc;
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

.result-opt-box {
  margin-right: 5px;
}

.result-opt-box .square {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.square-empty {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.component-wrapper {
  border-bottom: 1px solid #ccc;
  padding: 20px;
  position: relative
}

.component-wrapper:hover {
  background-color: #f9f9f9;
}

.component-wrapper .edit-mode {
  position: absolute;
  right: 5px;
  top: 5px;
  color: #ccc;
  cursor: pointer;
}

.component-wrapper .edit-mode:hover {
  color: #000;
}

.catalog {
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
  margin: 20px;
  font-size: 12px;
  z-index: 10000;
  box-shadow: 1px 1px 5px #ccc;
}

.catalog .item {
  min-height: 16px;
  margin-bottom: 10px;
  cursor: pointer;
}

.catalog .item:last-child {
  margin-bottom: 0;
}

.catalog .item:hover {
  text-decoration: underline;
}


.toggle-catalog {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
  cursor: pointer;
}

.catalog-show {
  position: fixed;
  top: 100px;
  left: -10px;
}

.hide-catalog {
  position: absolute;
  left: -30px;
  top: 80px;
}

.review-comment {
  width: 100%;
  padding-bottom: 10px;
}

.review-comment-title {
  text-align: left;
  margin-bottom: 10px;
}

.is-staff .component-wrapper.notpass {
  background-color: #f9e8e8;
}

.is-staff .component-wrapper.pass {
  background-color: #DDFFFA;
}
</style>