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
          <a-form-item label="Is Required" name="required">
            <a-switch v-model:checked="baseData.required" />
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref } from "vue"
import { ComponentType } from "@/types/components/base"

const baseData = ref({
  title: "",
  required: false,
  type: "",
  key: "",
  sort: "0",
  summary: "",
  desc: "",
})

const initializeData = (item: ComponentType) => {
  baseData.value.title = item.title
  baseData.value.summary = item.summary
  baseData.value.type = item.type
  baseData.value.required = item.required
  baseData.value.key = item.key
  baseData.value.sort = item.sort
  baseData.value.desc = item.desc
}

const exportData = () => {
  return baseData.value
}

defineExpose({
  initializeData,
  exportData
})
</script>