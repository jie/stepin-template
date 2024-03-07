<template>
  <div class="report relative" v-if="store.report?.schema">

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
        <a-affix :offset-bottom="0" @change="change">
        <div class="controls border-t"
          style="border-top: 1px solid #000; background-color: #fff;display: flex; justify-content: center; align-items: center;height: 100px; position: absolute; bottom: 0;left: 0;width:100%;">
          <div>
            <a-button type="primary" html-type="submit" style="width: 140px; margin-left: 10px;">Submit</a-button>
            <a-popconfirm :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }"
              @confirm="onSave" title="Confirm save a draft?" ok-text="Yes" cancel-text="No">
              <a-button type="" style="width: 140px; margin-left: 10px;">Save</a-button>
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
const store = ReportFillStore()
const checkUpdate = (e) => {
  console.log('checkUpdate:', e)

} 

const startedRef = ref(false)
const props = defineProps({
  reportData: Object
})

const loadingRef = ref(false)
const formState = reactive({})
const change = (affixed: boolean) => {
  console.log(affixed);
};
const reportDataRef = ref()
const initialization = () => {
  console.log('loadLocalData')
  loadLocalData()
}

const onFinishSubmit = () => {
  console.log('onFinishSubmit:', toRaw(formState))
}
const onFinishFailed = () => {
  console.log('onFinishFailed:')
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
  loadingRef.value = true
  reportDataRef.value = data
  store.report.values = {}
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
    loadingRef.value = false
    startedRef.value = true
  }, 2000)

}

const onSubmit = () => {

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
</style>
