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
          <a-form-item :label="$t('base.IsDefect')" name="is_defect">
            <a-switch v-model:checked="baseData.is_defect" />
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
  is_defect: false,
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
  baseData.value.is_defect = item.is_defect
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