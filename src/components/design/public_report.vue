<template>
  <div class="report">
    <div
      style="max-width: 700px;  padding: 20px 20px 100px 20px; height: 100%; background-color: #fff; margin: 0 auto; position: relative;">
      <div class="title">
        <div>{{ reportTemplate.title }}</div>
      </div>
      <div class="summary">
        <div>{{ reportTemplate.summary }}</div>
      </div>
      <div v-for="item in reportTemplate.items" :key="item.key">
        <div class="component" @click="onSetCurrentCom(item)" v-if="item.type == 'text'">
          <reportText :item="item" ref="itemRefs" />
        </div>
        <div class="component" @click="onSetCurrentCom(item)" v-else-if="item.type == 'input'">
          <reportInput :item="item" ref="itemRefs" />
        </div>
        <div class="component" @click="onSetCurrentCom(item)" v-else-if="item.type == 'radio'">
          <reportRadio :item="item" ref="itemRefs" />
        </div>
        <div class="component" @click="onSetCurrentCom(item)" v-else-if="item.type == 'checkbox'">
          <reportCheckbox :item="item" ref="itemRefs" />
        </div>
        <div class="component" @click="onSetCurrentCom(item)" v-else-if="item.type == 'image'">
          <reportImage :item="item" ref="itemRefs" />
        </div>
        <div class="component" @click="onSetCurrentCom(item)" v-else-if="item.type == 'image_upload'">
          <reportImageUpload :item="item" ref="itemRefs" />
        </div>
        <div class="component" @click="onSetCurrentCom(item)" v-else-if="item.type == 'table'">
          <reportTable :item="item" ref="itemRefs"></reportTable>
        </div>
        <div class="component" @click="onSetCurrentCom(item)" v-else-if="item.type == 'container'">
          <reportContainer :item="item" ref="itemRefs"></reportContainer>
        </div>

        <div v-else>unsupported components: {{ item }}</div>
      </div>

      <a-affix :offset-bottom="0" @change="change">
        <div class="controls border-t"
          style="border-top: 1px solid #000; background-color: #fff;display: flex; justify-content: center; align-items: center;height: 100px; position: absolute; bottom: 0;left: 0;width:100%;">
          <div>
            <a-button type="primary" style="width: 140px; margin-left: 10px;" @click="onSubmit">Submit</a-button>
            <a-button type="" style="width: 140px; margin-left: 10px;" @click="onSave">Save</a-button>
          </div>
        </div>
      </a-affix>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, ref, computed, toRaw } from 'vue';
import { EditOutlined, SettingOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import reportTable from "./reportTable/index.vue"
import reportText from "./reportText/index.vue"
import reportInput from "./reportInput/index.vue"
import reportRadio from "./reportRadio/index.vue"
import reportCheckbox from "./reportCheckbox/index.vue"
import reportImage from "./reportImage/index.vue"
import reportImageUpload from "./reportImageUpload/index.vue"
import reportContainer from "./container.vue"
// import {
//   ReportTitle,
//   ReportInput,
//   ReportTable,
//   ReportImage,
//   ReportImageUpload,
//   ReportRadio,
//   ReportCheckbox,
//   ReportContainer,
// } from "@/types/components"
import { ReportTemplateStore } from "@/store/reportTemplate"
// const reportTemplateStore = ReportTemplateStore()

const change = (affixed: boolean) => {
  console.log(affixed);
};

const reportTemplate = ref({
  title: "MY REPORT TEMPLATE",
  summary: "MY REPORT TEMPLATE SUMMARY",
  items: [
    { "title": "Here is the title1", "type": "input", "key": "KnPsrTYcC_Sci9jUk0OrW1", "desc": "Here is the description", "defaultData": "" },
    {
      "title": "Here is the title1", "type": "radio", "key": "KnPsrTYcC_Sci9jUk0OrW2", "desc": "Here is the description", "defaultData": "", "data": {
        "options": [
          { "label": "Option 1", "value": "1" },
          { "label": "Option 2", "value": "2" },
          { "label": "Option 3", "value": "3" },
          { "label": "Option 4", "value": "4" },
        ]
      }
    },
    {
      "title": "Here is the title1", "type": "checkbox", "key": "KnPsrTYcC_Sci9jUk0OrW3", "desc": "Here is the description", "defaultData": "", "data": {
        "options": [
          { "label": "Option 1", "value": "1" },
          { "label": "Option 2", "value": "2" },
          { "label": "Option 3", "value": "3" },
          { "label": "Option 4", "value": "4" },
        ]
      }
    },
    {
      "title": "Here is the title1", "type": "image_upload", "key": "KnPsrTYcC_Sci9jUk0OrW10", "desc": "Here is the description", "defaultData": "", "data": {
        accept: "image/*,application/pdf"
      },
    },
    {
      "title": "Here is the title1", "type": "image", "key": "KnPsrTYcC_Sci9jUk0OrW4", "desc": "Here is the description", "defaultData": "", "data": {
        images: [
          {
            width: 240,
            url: "https://aliyuncdn.antdv.com/vue.png"
          },
          {
            width: 240,
            url: "https://aliyuncdn.antdv.com/logo.png"
          }
        ]
      },
    },
    {
      title: "Here is the table",
      desc: "Here is the description",
      type: "table",
      key: "KnPsrTYcC_Sci9jUk0OrW456",
      data: {
        columns: [{
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          fixed: 'left',
          // fieldType: 'input',
          children: []
        }], rows: [{
          name: 'Name',
          fieldOptions: {
            name: {
              fieldType: "text",
              value: "",
              placeholder: ""
            }
          }
        }]
      }
    },
  ],
})

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

const onSave = () => {
  for (let item of itemRefs.value) {
    if (item.exportValue) {
      let exportedVal = item.exportValue()
      console.log('exportedValue:', toRaw(exportedVal))
    }

  }
}

const onSubmit = () => {

}

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
