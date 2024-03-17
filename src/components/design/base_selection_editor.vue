<template>
  <div style="color: #333">
    <div class="mt-6">
      <div class="pb-6">
        <h3 class="" style="text-align:center; font-size:120%">{{ $t('base.Settings') }}</h3>
      </div>
      <div>
        <a-form :model="baseData" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
          <a-form-item :label="$t('base.Title')" name="title">
            <a-input v-model:value="baseData.title" />
          </a-form-item>
          <a-form-item :label="$t('base.Summary')" name="summary">
            <a-textarea v-model:value="baseData.summary" />
          </a-form-item>
          <a-form-item :label="$t('base.Description')" name="desc">
            <a-textarea v-model:value="baseData.desc" />
          </a-form-item>
          <a-form-item :label="$t('base.Sort')" name="sort">
            <a-input-number v-model:value="baseData.sort" />
          </a-form-item>
          <a-form-item :label="$t('base.IsRequire')" name="required">
            <a-switch v-model:checked="baseData.required" />
          </a-form-item>
          <a-form-item :label="$t('base.HasResult')" name="required">
            <a-switch v-model:checked="baseData.hasResult" />
          </a-form-item>
          <a-form-item :label="$t('base.HasRemark')" name="required">
            <a-switch v-model:checked="baseData.hasRemark" />
          </a-form-item>
          <a-form-item :label="$t('base.Layout')" name="layout">
            <a-radio-group v-model:value="baseData.layout">
              <a-radio-button value="vertical">{{ $t('base.Vertical') }}</a-radio-button>
              <a-radio-button value="horizontal">{{ $t('base.Horizontal') }}</a-radio-button>
            </a-radio-group>
            </a-form-item>
        </a-form>
      </div>
      <div class="pb-6">
        <h3 class="" style="text-align:center; font-size:120%">{{ $t('base.Option') }}</h3>
      </div>
      <div>
        <a-form :model="optionData" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
          <a-form-item :label="$t('base.Label')" name="label">
            <a-input v-model:value="optionData.label" />
          </a-form-item>
          <a-form-item :label="$t('base.Value')" name="value">
            <a-input v-model:value="optionData.value" />
          </a-form-item>
          <a-form-item v-if="baseData?.data?.options.length != 0"  :wrapper-col="{ offset: 3, span: 21 }">
            <a-tag closable @click="selectOption(index)" @close="delOption($event, index)" v-for="(option, index) in baseData?.data?.options">{{ option.label }} / {{ option.value }}</a-tag>
          </a-form-item>
          <a-form-item  :wrapper-col="{ offset: 3, span: 21 }">
            <a-button @click="addOption" type="primary">{{ $t('base.Add') }}</a-button>
            <a-button @click="editOption" v-if="!isAddRef" style="margin-left: 10px;">{{ $t('base.Edit') }}</a-button>
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
import { toRaw } from "vue";
const isAddRef = ref(true)
const selectIndexRef = ref(null)
const optionData = ref({
  label: "",
  value: ""
})
const baseData = ref({
  title: "",
  required: false,
  hasResult: false,
  hasRemark: false,
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
  baseData.value.hasResult = item.hasResult
  baseData.value.hasRemark = item.hasRemark
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

const delOption = (e: Event, index:number) => {
  // let items = baseData.value.data.options.filter((item, i) => index != i)
  // baseData.value.data.options = [...items]
  baseData.value.data.options.splice(index, 1)
  console.log(e)
  console.log(index)
  e.preventDefault()
} 

const editOption = () => {
  baseData.value.data.options[selectIndexRef.value].label = optionData.value.label
  baseData.value.data.options[selectIndexRef.value].value = optionData.value.value
  optionData.value.label = ""
  optionData.value.value = ""
  isAddRef.value = true
  selectIndexRef.value = null
}

const selectOption = (index:number) => {
  optionData.value.label = baseData.value.data.options[index].label
  optionData.value.value = baseData.value.data.options[index].value
  isAddRef.value = false
  selectIndexRef.value = index
}

defineExpose({
  initializeData,
  exportData
})
</script>