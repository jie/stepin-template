<template>

    <div class="report relative" v-if="store.report?.schema">
      <a-modal
        :getContainer="() => document.body"
        v-model:visible="isShowSubmitDialog"
        title="Please enter your review comments"
        @ok="handleSubmitOk"
      >
        <a-form :model="submitFormData" layout="vertical">
          <a-form-item label="Status" name="approve_status" required>
            <a-select
              :getPopupContainer="triggerNode=>{return triggerNode.parentNode || document.body;}"
              v-model:value="submitFormData.approve_status"
              style="width: 100%"
            >
            <a-select-option :value="option.value" v-for="option in approveStatuses">{{option.label}}</a-select-option>
          </a-select>
          </a-form-item>
          <a-form-item label="Reason" name="approve_reason" required>
            <a-textarea v-model:value="submitFormData.approve_reason" />
          </a-form-item>
          <a-form-item label="E-mail" name="email" required >
            <a-input v-model:value="submitFormData.email"></a-input>
          </a-form-item>
          <a-form-item label="Password" name="password" required v-if="store.report?.settings.approve_password">
            <a-input type="password" v-model:value="submitFormData.password"></a-input>
          </a-form-item>
        </a-form>
      </a-modal>
      <div
        style="max-width: 700px;  padding: 20px 20px 100px 20px; height: 100%; background-color: #fff; margin: 0 auto; position: relative;">
  
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
        <a-form layout="vertical" :model="formState"  v-if="store.report" @finish="onFinishSubmit">
          <div v-for="(item, index) in store.report.schema" :key="item.key">
            <div class="component" v-if="item.type == 'text'">
              <reportText :item="item" ref="itemRefs" />
            </div>
            <div class="component" v-else-if="item.type == 'input'">
  
              <reportInput :item="item" ref="itemRefs" v-model:value="formState[item.key]" />
  
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
          <div class="controls border-t" :class="{'affixed-style': isAffixedRef, 'unaffixed-style': !isAffixedRef}"
            style="">
            <div>
              <a-button type="primary" html-type="submit" style="width: 240px; margin-left: 10px;">Submit review comments</a-button>
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
  import { reportDatabase } from "@/hook/dexie_hook"
  import { openNotification, successNotification } from '@/utils/notification';
  import { copyObject } from "@/utils/objectUtils"
  import Spin from "@/components/spin/index.vue"
  import { ReportFillStore } from '@/store/report_fill';
  import dayjs from 'dayjs';
  const document = window.document
  const store = ReportFillStore()
  const checkUpdate = (e) => {
    console.log('checkUpdate:', e)
  
  } 
  const isAffixedRef = ref(false)
  const startedRef = ref(false)
  const props = defineProps({
    reportData: Object
  })
  
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
  
  
  
  type HeadImage = {
    url: string,
    style: object
  }
  const itemRefs = ref([])
  
  
  
  const onSave = async () => {
    let record = await reportDatabase.getRecord(store.report.id)
    if (!record) {
      await reportDatabase.createRecord({ id: store.report.id, values: JSON.stringify(formState) })
    } else {
      await reportDatabase.updateRecord({ id: store.report.id, values: JSON.stringify(formState) })
    }
    successNotification("Saved")
  }
  
  const loadLocalData = async () => {
    let localRecord = await reportDatabase.getRecord(store.report.id)
    if (!localRecord) {
      return
    }
    // let localDate = dayjs(localRecord.update_at)
    // let serverDate = dayjs(store.report.update_at)
    // if (localDate > serverDate) {
    //   return
    // }
    let values = JSON.parse(localRecord.values)
    console.log('values:', values)
    for(let key of Object.keys(values)) {
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
        // if (item.refreshValue && item.props.item.data) {
        //   item.refreshValue(item.props.item.data)
        // }
        if(editableComponents.includes(item.type)) {
            if(item.type == 'input') {
              item.data = {value: ''}
            } else if(item.type == 'radio') {
              if(!item.data.value) {
                item.data.value = ""
              }
            } else if(item.type == 'checkbox') {
              if(!item.data.value) {
                item.data.value = []
              }
            }
  
            console.log('item.key:', item.key,  ', data:', toRaw(item.data))
          }
      })
      for(let key of Object.keys(store.report.values)) {
        formState[key] = store.report.values[key]
      }
      loadingRef.value = false
      startedRef.value = true
    }, 2000)
  
  }
  
  
  const isShowSubmitDialog = ref(false)
  const submitLoadingRef = ref(false)
  const approveStatuses = [
    {"label": "disapprove", "value": "0"},
    {"label": "approved", "value": "3"}
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
  background-color: #fff;display: flex; 
  justify-content: center; 
  align-items: center;height: 100px; 
  position: absolute; 
  bottom: 0;left: 0;width:100%; 
  padding: 20px; width: 100%;
}
.unaffixed-style {
  border-top: 2px solid #ccc; 
  /* box top shadow */

  box-shadow: 0px 15px 10px -15px #333;
  background-color: #eee;
  display: flex; 
  justify-content: center; 
  align-items: center;height: 100px; 
  position: absolute; 
  bottom: 0;left: 0;width:100%; 
  padding: 20px; width: 100%;

}

  </style>
  