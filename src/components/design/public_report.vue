<template>
  <div class="report relative" v-if="store.report?.schema">
    <a-modal :getContainer="() => document.body" v-model:visible="isShowEditModeDialog"
      :title="currentEditComponentRef?.title" width="100%" wrap-class-name="full-modal"
      :cancelButtonProps="{ hidden: true, }">
      <div ref="editModeRef">
        <a-form layout="vertical" v-if="currentEditComponentRef">
          <div v-for="(item, index) in schemaRef" :key="item.key">
            <div class="component"
              v-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'text'">
              <reportText :item="currentEditComponentRef" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'input'">
              <reportInput :item="currentEditComponentRef" v-model:value="formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'input_group'">
              <reportInputGroup :item="currentEditComponentRef"
                v-model:value="formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'radio'">
              <reportRadio :item="currentEditComponentRef" v-model:value="formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'checkbox'">
              <reportCheckbox :item="currentEditComponentRef" v-model:value="formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'image'">
              <reportImage :item="currentEditComponentRef" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'image_upload'">
              <reportImageUpload :item="currentEditComponentRef"
                v-model:value="formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'table'">
              <reportTable :item="currentEditComponentRef" v-model:value="formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'container'">
              <reportContainer :item="currentEditComponentRef"></reportContainer>
            </div>
          </div>
        </a-form>
      </div>
      <template #footer>
        <a-button @click="onClickCancelEditMode">{{ $t('base.Cancel') }}</a-button>
        <a-button type="success" @click="goPrevItem" :disabled="currentEditComponentIndexRef == 0">{{
          $t('base.PrevItem') }}</a-button>
        <a-button type="success" @click="goNextItem"
          :disabled="currentEditComponentIndexRef == (schemaRef.length - 1)">{{
            $t('base.NextItem') }}</a-button>
        <a-button type="primary" @click="onClickConfirmSaveSingle"
          :disabled="store.report?.review_status == '1' || store.report?.review_status == '2'">{{ $t('base.Save')
          }}

          <template #icon>
            <SaveOutlined />
          </template>

        </a-button>
      </template>
    </a-modal>

    <a-modal :getContainer="() => document.body" v-model:visible="isShowSubmitDialog" :okText="$t('base.Login')"
      :title="$t('base.LoginToFillForm')" :maskClosable="false" :closable="false" @ok="handleLoginOk"
      :cancelButtonProps="{ hidden: true, }">
      <a-form :model="loginFormData" layout="vertical">
        <a-form-item :label="$t('base.Email')" name="email" required>
          <a-input v-model:value="loginFormData.email"></a-input>
        </a-form-item>
        <a-form-item :label="$t('base.Password')" name="password" required>
          <a-input type="password" v-model:value="loginFormData.password"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal :getContainer="() => document.body" v-model:visible="loadLocalDataDialogRef"
      :title="$t('base.FindLatestLocalData')" @ok="handleConfirmUseLocalData">
      <div>
        <div><span>{{ $t('base.LocalDataUpdateAt') }}:</span><span>{{ localDataRecord.update_at }}</span></div>
        <div><span>{{ $t('base.RemoteDataUpdateAt') }}:</span><span>{{ store.report.update_at }}</span></div>
        <div>
          <a-popconfirm :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }"
            v-if="localDataRecord" @confirm="onDeleteLocalData" :title="$t('base.ConfirmDelete')"
            :ok-text="$t('base.Yes')" :cancel-text="$t('base.No')">
            <a-button danger>{{ $t('base.DeleteLocalData') }}</a-button>
          </a-popconfirm>
        </div>

      </div>
    </a-modal>

    <!-- <a-drawer v-model:visible="isShowCatalogRef" class="custom-class" style="color: red" title="Basic Drawer"
      placement="right">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer> -->
    <div v-show="!isShowSubmitDialog" class="report-items-wrapper">

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
      <div style="padding-left: 20px; padding-right: 20px" v-if="store.report?.review_status == '-1'">
        <a-alert :message="$t('base.report_fail_need_refill')" type="error" show-icon />
      </div>
      <div style="padding-left: 20px; padding-right: 20px" v-if="store.report?.review_status == '1'">
        <a-alert :message="$t('base.report_waiting_review')" type="info" show-icon />
      </div>
      <div style="padding-left: 20px; padding-right: 20px" v-if="store.report?.review_status == '2'">
        <a-alert :message="$t('base.report_pass_review')" type="success" show-icon />
      </div>
      <a-form layout="vertical" :model="formState" v-if="store.report" @finish="onFinishSubmit"
        @finishFailed="onFinishFailed">
        <div v-if="store.report">
          <div class="component meta">
            <a-form-item required :label="$t('base.ReportResult')">
              <a-radio-group v-model:value="formState['ReportResult']" :options="reportResultOptions">
                <template #label="{ value }">
                  <span style="color: red">{{ value }}</span>
                </template>
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="component meta" v-if="formState['ReportResult'] == '0' || formState['ReportResult'] == '1'">
            <a-form-item required :label="$t('base.ReportResultRemark')">
              <a-textarea v-model:value="formState['ReportResultRemark']"></a-textarea>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ReportNumber">
            <a-form-item required :label="$t('base.ReportNumber')">
              <a-input v-model:value="formState['ReportNumber']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Applicant">
            <a-form-item required :label="$t('base.Applicant')">
              <a-input v-model:value="formState['Applicant']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Supplier">
            <a-form-item required :label="$t('base.Supplier')">
              <a-input v-model:value="formState['Supplier']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Factory">
            <a-form-item required :label="$t('base.Factory')">
              <a-input v-model:value="formState['Factory']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ItemNumber">
            <a-form-item required :label="$t('base.ItemNumber')">
              <a-textarea v-model:value="formState['ItemNumber']" allowClear></a-textarea>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ProductDescription">
            <a-form-item required :label="$t('base.ProductDescription')">
              <a-textarea v-model:value="formState['ProductDescription']" allowClear></a-textarea>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.AddressOfInspection">
            <a-form-item required :label="$t('base.AddressOfInspection')">
              <a-input v-model:value="formState['AddressOfInspection']" allowClear></a-input>
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
              <a-date-picker style="width: 100%" :show-time="{ format: 'HH:mm' }"
                v-model:value="formState['ArrivalTime']" :getPopupContainer="triggerNode => triggerNode.parentNode" />
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
              <a-input v-model:value="formState['Inspector']" allowClear></a-input>
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
            <a-row style="width: 100%" :gutter="[16, 16]">
              <a-col :span="8">
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
        <div v-for="(item, index) in schemaRef" :key="item.key" class="component-wrapper"
          :class="{ 'notpass': store.report?.review_comments[item.key]?.status == false, 'pass': store.report?.review_comments[item.key]?.status == true }">
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
          <div class="component" :id="`com-${item.key}`" v-else>unsupported components: {{ item }}</div>
          <div v-if="store.report?.review_comments[item.key]?.comment">{{ $t('base.Comment') }}: {{
            store.report?.review_comments[item.key].comment }}</div>
          <div class="edit-mode" @click="onClickShowEditMode(item, index)">{{ $t('base.Edit') }}</div>
        </div>

        <a-affix :offset-bottom="20" @change="affixedChange">
          <div class="controls border-t" :class="{ 'affixed-style': isAffixedRef, 'unaffixed-style': !isAffixedRef }"
            style="">
            <div v-if="['-1', '0'].includes(store.report.review_status)">
              <a-button type="primary" style="width: 140px; margin-left: 10px;" @click="onClickSubmit"
                :disabled="store.report.review_status == '1' || store.report.review_status == '2'">{{
                  $t('base.Submit')
                }}</a-button>
              <a-button plain html-type="submit" style="width: 140px; margin-left: 10px;"
                :disabled="store.report.review_status == '1' || store.report.review_status == '2'">{{ $t('base.Save')
                }}</a-button>
              <a-button plain style="margin-left: 10px;" @click="showLocalDataDialog" v-if="localDataRecord">{{
                $t('base.ViewLocalData')
              }}</a-button>
            </div>
            <div v-else>{{ $t('base.report_not_in_fill_status') }}: {{ store.report.review_status }}</div>
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

      <div v-for="item in schemaRef" class="item">
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

    <!-- <div v-if="isShowCatalogRef" class="catalog">
      <a-button type="primary" class="hide-catalog" shape="circle" size="large" @click="isShowCatalogRef = false">
        <template #icon>
          <VerticalRightOutlined />
        </template>
      </a-button>

      <div v-for="item in schemaRef" class="item">
        <div @click="goAnchor(item.key)">{{ item.title }}</div>
      </div>
    </div> -->

  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, toRaw, reactive, watchEffect, readonly, createVNode } from 'vue';
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
import { useRoute } from "vue-router"
import { CheckCircleFilled, CheckOutlined, VerticalRightOutlined } from '@ant-design/icons-vue';
import { openNotification, successNotification } from '@/utils/notification';
// import { copyObject } from "@/utils/objectUtils"
import { i18n } from '@/lang/i18n';
import Spin from "@/components/spin/index.vue"
import { ReportFillStore } from '@/store/report_fill';
import { approveStatusDisplayMsg, customerApproveStatusMsg } from "@/utils/constant"
import { useAccountStore } from '@/store';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { fill } from 'lodash';
const route = useRoute()
const document = window.document
const store = ReportFillStore()
const isAffixedRef = ref(false)
const loadingRef = ref(false)
const formState = reactive({})
const reportDataRef = ref()
const itemRefs = ref([])
const schemaRef = ref([])
const loadLocalDataDialogRef = ref(false)
const localDataRecord = ref(null)
const startedRef = ref(false)
const currentEditComponentRef = ref(null)
const currentEditComponentIndexRef = ref(-1)
const isShowCatalogRef = ref(false)

const affixedChange = (affixed: boolean) => {
  isAffixedRef.value = affixed
};
const isShowEditModeDialog = ref(false)

const reportResultOptions = [
  { label: i18n.global.t(`base.ResultPassed`), value: '3' },
  { label: i18n.global.t(`base.ResultPending`), value: '1' },
  { label: i18n.global.t(`base.ResultFailed`), value: '0' },
];

const accountStore = useAccountStore()
const initialization = async () => {
  console.log('initialization')
  // if (store.report?.values && Object.keys(store.report?.values).length != 0) {
  //   schemaRef.value = store.report.schema
  // } else {
  //   schemaRef.value = store.report.template?.items
  // }
  schemaRef.value = store.report.template?.items
  // loadLocalData()
  // loadRemoteData()
  // let localData = await loadLocalData()
  // console.log('localData:', localData)
  // if (localData && localData.values && localData.values.length != 0) {
  //   if (dayjs(localData.update_at) > dayjs(store.report.update_at)) {
  //     localDataRecord.value = localData
  //   }
  // }
}

const showLocalDataDialog = () => {
  loadLocalDataDialogRef.value = true
}

const onOpenForm = async () => {
  if (route.query.fill_token) {
    console.log('formState:', toRaw(formState))
    let result;
    try {
      result = await accountStore.apiFillFormLogin("", "", route?.query?.fill_token)
      console.log('onOpenForm=result:', result)
    } catch (e) {
      openNotification({
        type: "error",
        message: i18n.global.t(`base.LoginFail`),
        description: i18n.global.t(`base.LoginFailByFillToken`)
      })
    }
  }
  let fillSession = getFillSession()
  if (!fillSession) {
    isShowSubmitDialog.value = true
    return
  }
  if (((dayjs() - dayjs(fillSession.user_data.create_at)) / 3600000) > 48) {
    localStorage.removeItem("fill_session")
    isShowSubmitDialog.value = true
    return
  }
  initialization()
}

const onLocalSave = async () => {
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
  // successNotification("Saved")
}

const loadLocalData = async () => {
  let localRecord
  try {
    localRecord = await reportDatabase.getRecord(store.report.id)
  } catch (e) {
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
    formState["Inspector"] = store.report.values["Inspector"] || ""
    if (store.report.order) {
      if (!formState["ReportNumber"]) {
        formState["ReportNumber"] = store.report.order.order_no
      }
      if (!formState["Factory"]) {
        formState["Factory"] = store.report.order.factory_name
      }
      if (!formState["Supplier"]) {
        formState["Supplier"] = store.report.order.suppliers
      }
      if (!formState["ItemNumber"]) {
        formState["ItemNumber"] = store.report.order.po_number
      }
      if (!formState["ProductDescription"]) {
        formState["ProductDescription"] = store.report.order.product_name
      }
      if (!formState["AddressOfInspection"]) {
        formState["AddressOfInspection"] = store.report.order.address?.country?.code == '1' ? `${store.report.order.address?.province?.name} ${store.report.order.address?.city?.name} ${store.report.order.address?.details}` : store.report.order.address?.country?.name
      }
      if (!formState["DateOfInspection"]) {
        formState["DateOfInspection"] = dayjs(store.report.order.inspect_date)
      }
      if (!formState["ArrivalTime"]) {
        formState["ArrivalTime"] = dayjs(`${store.report.order.inspect_date} 09:00:00`)
      }
      if (!formState["DepartureTime"]) {
        formState["DepartureTime"] = dayjs(`${store.report.order.inspect_date} 18:00:00`)
      }
      if (!formState["Inspector"]) {
        formState["Inspector"] = store.report.order.workers.map(c => c.worker.name).join(',')
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
  // store.report.values = data.values
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
    loadRemoteData()
  }, 2000)

}


const isShowSubmitDialog = ref(false)
const loginFormData = reactive({
  email: "",
  password: ""
})

const onSubmitReport = async () => {
  console.log('onSubmitReport:', toRaw(formState))
  let fillSession = getFillSession()
  if (!fillSession) {
    isShowSubmitDialog.value = true
    return
  }
  try {
    await store.apiSubmit(fillSession.email, fillSession.password, formState, route?.query?.fill_token)
  } catch (e) {
    console.log(e)
    openNotification({
      type: "error",
      message: "Submit Report Fail",
      description: e?.data?.message
    })
    return
  } finally {
    onLocalSave()
  }

  openNotification({
    type: "success",
    message: "OK",
    description: i18n.global.t('base.ReportSubmitted')
  })

}

const onFinishSubmit = async () => {
  console.log('onFinishSubmit-onFill:', toRaw(formState))
  let fillSession = getFillSession()
  if (!fillSession) {
    isShowSubmitDialog.value = true
    return
  }
  try {

    await store.apiFill(fillSession.email, fillSession.password, formState, route?.query?.fill_token)
  } catch (e) {
    console.log(e)
    openNotification({
      type: "error",
      message: "Save Report Fail",
      description: e?.data?.message
    })
    return
  } finally {
    onLocalSave()
  }

  openNotification({
    type: "success",
    message: 'OK',
    description: i18n.global.t('base.SuccessSaved')
  })
}
const onFinishFailed = (e) => {
  console.log('onFinishFailed:', e)
  if (e.errorFields) {
    e.errorFields.map((item) => {
      if (item.errors) {
        openNotification({
          type: "error",
          message: "Validate Fail",
          description: item.errors
        })
      }
    })
  }
}

const handleLoginOk = async () => {
  console.log('formState:', toRaw(formState))
  let result;
  try {
    result = await accountStore.apiFillFormLogin(loginFormData.email, loginFormData.password)
    console.log('result:', result)
  } catch (e) {
    console.log('e:', toRaw(e))
    if (e?.data?.status == false) {
      openNotification({
        type: "error",
        message: "Error",
        description: e.data.message
      })
    } else {
      openNotification({
        type: "error",
        message: "Error",
        description: e.message
      })
    }

  }
  if (result) {
    successNotification(i18n.global.t('base.LoginSuccess'))
    isShowSubmitDialog.value = false
    initialization()
  }
}

const handleConfirmUseLocalData = async () => {
  for (let key of Object.keys(localDataRecord.value.values)) {
    formState[key] = localDataRecord.value.values[key]
  }
  loadLocalDataDialogRef.value = false
}

const onDeleteLocalData = () => {
  try {
    reportDatabase.deleteRecord(store.report.id)
    successNotification("local_data_deleted")
    localDataRecord.value = null
  } catch (e) {
    console.error(e)
    openNotification({
      type: "error",
      message: "Fail delete local data",
      description: e.message
    })
  }
}

const getFillSession = () => {
  let fillSession = localStorage.getItem("fill_session")
  if (fillSession) {
    return JSON.parse(fillSession)
  } else {
    return null
  }
}

const onClickShowEditMode = (item: any, index: number) => {
  isShowEditModeDialog.value = true
  console.log('item:', item)
  // item to editModeRef
  currentEditComponentRef.value = item
  currentEditComponentIndexRef.value = index
}

const goNextItem = () => {
  let index = schemaRef.value.findIndex((item) => item.key == currentEditComponentRef.value.key)
  if (index < schemaRef.value.length - 1) {
    currentEditComponentRef.value = schemaRef.value[index + 1]
    currentEditComponentIndexRef.value = index + 1
  }
}

const goPrevItem = () => {
  let index = schemaRef.value.findIndex((item) => item.key == currentEditComponentRef.value.key)
  if (index > 0) {
    currentEditComponentRef.value = schemaRef.value[index - 1]
    currentEditComponentIndexRef.value = index - 1
  }
}

const onClickConfirmSaveSingle = async () => {
  console.log('onClickConfirmSaveSingle:', toRaw(formState))

  loadingRef.value = true
  let fillSession = getFillSession()
  if (!fillSession) {
    message.error(i18n.global.t('base.PleaseLoginFirst'))
    return
  }
  console.log('fillSession:', fillSession)

  try {
    await store.apiFillSingle({
      id: store.report.id,
      values: { [currentEditComponentRef.value.key]: formState[currentEditComponentRef.value.key] },
      email: fillSession.email,
      password: fillSession.password
    })

    Modal.confirm({
      content: i18n.global.t('base.SuccessSaved'),
      getContainer: () => document.body,
      async onOk() {
        currentEditComponentRef.value = schemaRef.value[currentEditComponentIndexRef.value + 1]
        currentEditComponentIndexRef.value = currentEditComponentIndexRef.value + 1
      },
      icon: createVNode(CheckCircleFilled),
      cancelText: i18n.global.t('base.Cancel'),
      okText: i18n.global.t('base.NextItem'),
      onCancel() {
        Modal.destroyAll();
      },
    });

  } catch (e) {
    console.error(e)
    openNotification({
      type: "error",
      message: i18n.global.t('base.LoginFailByFillToken'),
      description: i18n.global.t('base.LoginFailByFillToken')
    })
    return
  } finally {
    onLocalSave()
    loadingRef.value = false
  }


  if (currentEditComponentIndexRef.value < schemaRef.value.length - 1) {


  } else {
    isShowEditModeDialog.value = false
    currentEditComponentRef.value = null
    currentEditComponentIndexRef.value = null

    Modal.confirm({
      content: i18n.global.t('base.YouHaveCompleteAllItemsNeedSubmit'),
      getContainer: () => document.body,
      async onOk() {
        await onSubmitReport()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      },
      cancelText: i18n.global.t('base.Cancel'),
      okText: i18n.global.t('base.Submit'),
      onCancel() {
        Modal.destroyAll();
      },
    });
  }
}

const onClickSubmit = () => {
  Modal.confirm({
    content: i18n.global.t('base.ConfirmSubmitReport'),
    getContainer: () => document.body,
    async onOk() {
      await onSubmitReport()
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    },
    cancelText: i18n.global.t('base.Cancel'),
    okText: i18n.global.t('base.Submit'),
    onCancel() {
      Modal.destroyAll();
    },
  });
}


const onClickCancelEditMode = () => {
  isShowEditModeDialog.value = false
  currentEditComponentRef.value = null
  currentEditComponentIndexRef.value = null
}

const goAnchor = (key: string) => {
  let anchor = document.getElementById(`com-${key}`)
  if (anchor) {
    anchor.scrollIntoView({
      behavior: "smooth"
    })
  }
}

watchEffect(() => {
  if (isShowEditModeDialog.value) {
    // add overflow hidden to <html> element to prevent scrolling
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = 'auto'
    currentEditComponentRef.value = null
    currentEditComponentIndexRef.value = -1
  }
})

onOpenForm()

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
  /* margin: 30px 0; */
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
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid #ccc;
}

.component.meta:hover {
  background-color: #f9f9f9;
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

.report-items-wrapper {
  max-width: 1024px;
  /* padding: 20px 20px 100px 20px; */
  padding-bottom: 100px;
  height: 100%;
  background-color: #fff;
  margin: 0 auto;
  position: relative;
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

.component-wrapper.notpass {
  background-color: #f9e8e8;
}

.component-wrapper.pass {
  background-color: #DDFFFA;
}


/* mobile */
@media screen and (max-width: 768px) {
  .report-items-wrapper {
    max-width: 1024px;
    /* padding: 10px 10px 100px 10px; */
    padding-bottom: 100px;
    height: 100%;
    background-color: #fff;
    margin: 0 auto;
    position: relative;
  }

}
</style>
