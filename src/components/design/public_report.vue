<template>
  <div class="report relative" v-if="reportDataRef">

    <div
      style="max-width: 700px;  padding: 20px 20px 100px 20px; height: 100%; background-color: #fff; margin: 0 auto; position: relative;">

      <div v-if="loadingRef"
        style="display:flex; justify-content: center; align-items: center; width: 100%; height: 100%; z-index: 1000;position: absolute;left:0;top:0;right:0;bottom:0;background-color: rgba(255, 255, 255, 0.8);">
        <Spin font-size="60px" />
      </div>
      <div class="title">
        <div>{{ reportDataRef.title }}</div>
      </div>
      <div class="summary">
        <div>{{ reportDataRef.summary }}</div>
      </div>
      <div v-for="item in reportDataRef.items" :key="item.key">
        <div class="component" v-if="item.type == 'text'">
          <reportText :item="item" ref="itemRefs" />
        </div>
        <div class="component" v-else-if="item.type == 'input'">
          <reportInput :item="item" ref="itemRefs" />
        </div>
        <div class="component" v-else-if="item.type == 'radio'">
          <reportRadio :item="item" ref="itemRefs" />
        </div>
        <div class="component" v-else-if="item.type == 'checkbox'">
          <reportCheckbox :item="item" ref="itemRefs" />
        </div>
        <div class="component" v-else-if="item.type == 'image'">
          <reportImage :item="item" ref="itemRefs" />
        </div>
        <div class="component" v-else-if="item.type == 'image_upload'">
          <reportImageUpload :item="item" ref="itemRefs" />
        </div>
        <div class="component" v-else-if="item.type == 'table'">
          <reportTable :item="item" ref="itemRefs"></reportTable>
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
            <a-button type="primary" style="width: 140px; margin-left: 10px;" @click="onSubmit">Submit</a-button>
            <a-popconfirm :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }"
              @confirm="onSave" title="Confirm save a draft?" ok-text="Yes" cancel-text="No">
              <a-button type="" style="width: 140px; margin-left: 10px;">Save</a-button>
            </a-popconfirm>
          </div>
        </div>
      </a-affix>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, toRaw } from 'vue';
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
import dayjs from 'dayjs';

const props = defineProps({
  reportData: Object
})

const loadingRef = ref(false)

const change = (affixed: boolean) => {
  console.log(affixed);
};
const reportDataRef = ref()
const initialization = () => {
  if (props.reportData) {
    console.log('props.reportData:', toRaw(props.reportData))
    refresh(copyObject(props.reportData))
  }
}

type HeadImage = {
  url: string,
  style: object
}
const itemRefs = ref([])
const currentEditItem = ref(null)

const onSetCurrentCom = (item: any) => {
  console.log('onSetCurrentCom:', toRaw(item))
  if (currentEditItem.value && currentEditItem.value.key == item.key) {
    currentEditItem.value = null
  } else {
    currentEditItem.value = item
  }
}

const onSave = async () => {
  console.log('onSave:', toRaw(itemRefs.value.length))
  let values = []
  for (let item of itemRefs.value) {
    if (item?.props?.item?.key) {
      let value = null;
      if (item.exportValue) {
        value = item.exportValue()
      }
      values.push({
        key: item?.props?.item?.key,
        value: value
      })
    }
  }
  console.log('values:', values.reverse())
  console.log('reportDataRef.value.id:', reportDataRef.value)
  let record = await reportDatabase.getRecord(reportDataRef.value.id)
  console.log('record:', toRaw(record))
  if (!record) {
    await reportDatabase.createRecord({ id: reportDataRef.value.id, values: JSON.stringify(values) })
  } else {
    await reportDatabase.updateRecord({ id: reportDataRef.value.id, values: JSON.stringify(values) })
  }
  successNotification("Saved")

}

const refresh = (data: any) => {
  loadingRef.value = true
  reportDataRef.value = data
  setTimeout(() => {
    itemRefs.value.map((itemRef: any) => {
      if (itemRef.refreshValue && itemRef.props.item.data) {
        itemRef.refreshValue(itemRef.props.item.data)
      }
    })
    loadingRef.value = false
  }, 2000)

}

const onSubmit = () => {

}

initialization()

defineExpose({
  refresh
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
