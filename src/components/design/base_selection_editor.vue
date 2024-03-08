<template>
  <div style="color: #333">
    <div class="mt-6">
      <div class="pb-6">
        <h3 class="" style="text-align:center; font-size:120%">Settings</h3>
      </div>
      <div>
        <a-form :model="baseData" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
          <a-form-item label="Title" name="title">
            <a-input v-model:value="baseData.title" />
          </a-form-item>
          <a-form-item label="Summary" name="summary">
            <a-textarea v-model:value="baseData.summary" />
          </a-form-item>
          <a-form-item label="Description" name="desc">
            <a-textarea v-model:value="baseData.desc" />
          </a-form-item>
          <a-form-item label="Sort" name="sort">
            <a-input-number v-model:value="baseData.sort" />
          </a-form-item>
          <a-form-item label="Is Required" name="required">
            <a-switch v-model:checked="baseData.required" />
          </a-form-item>
          <a-form-item label="Layout" name="layout">
            <a-radio-group v-model:value="baseData.layout">
              <a-radio-button value="vertical">vertical</a-radio-button>
              <a-radio-button value="horizontal">horizontal</a-radio-button>
            </a-radio-group>
            </a-form-item>
        </a-form>
      </div>
      <div class="pb-6">
        <h3 class="" style="text-align:center; font-size:120%">Options</h3>
      </div>
      <div>
        <a-form :model="optionData" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
          <a-form-item label="Label" name="label">
            <a-input v-model:value="optionData.label" />
          </a-form-item>
          <a-form-item label="Value" name="value">
            <a-input v-model:value="optionData.value" />
          </a-form-item>
          <a-form-item v-if="baseData?.data?.options.length != 0"  :wrapper-col="{ offset: 3, span: 21 }">
            <a-tag closable @close="delOption(option.value)" v-for="option in baseData?.data?.options">{{ option.label }} / {{ option.value }}</a-tag>
          </a-form-item>
          <a-form-item  :wrapper-col="{ offset: 3, span: 21 }">
            <a-button @click="addOption">Add</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
  
  
<script lang="ts" setup>
import { ref } from "vue"
import { ComponentType } from "@/types/components/base"
import { notification } from 'ant-design-vue';
const optionData = ref({
  label: "",
  value: ""
})
const baseData = ref({
  title: "",
  required: false,
  type: "",
  key: "",
  sort: "0",
  summary: "",
  desc: "",
  layout: "horizontal",
  data: {
    options: []
  }
})

const initializeData = (item: ComponentType) => {
  baseData.value.title = item.title
  baseData.value.summary = item.summary
  baseData.value.type = item.type
  baseData.value.required = item.required
  baseData.value.key = item.key
  baseData.value.sort = item.sort
  baseData.value.desc = item.desc
  baseData.value.data.options = item.data.options
  baseData.value.layout = item.layout
}

const exportData = () => {
  return baseData.value
}

const addOption = () => {
  // check if option exists
  for (let i = 0; i < baseData.value.data.options.length; i++) {
    if (baseData.value.data.options[i].value == optionData.value.value || baseData.value.data.options[i].label == optionData.value.label) {
      notification["error"]({
        message: 'Option exists',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      });
      return
    }
  }

  baseData.value.data.options.push({
    label: optionData.value.label,
    value: optionData.value.value
  })
  optionData.value.label = ""
  optionData.value.value = ""
}

const delOption = (value:string) => {
  baseData.value.data.options = baseData.value.data.options.filter((item:any) => item.value != value)
} 

defineExpose({
  initializeData,
  exportData
})
</script>