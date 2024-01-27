<template>
    <div>
      <div> edit {{ itemData?.title }}</div>
      <div>
        <BaseForm ref="baseForm" />
      </div>
    </div>
  </template>
  <script lang="ts" setup>
  import { ref } from "vue"
  import BaseForm from "../base_editor.vue"
  const props = defineProps({
    item: {
      type: Object,
    }
  })
  
  const baseForm = ref(null)
  const itemData = ref({})
  
  const initializeData = (item: any) => {
    console.log('initializeData')
    itemData.value = item
    baseForm.value.initializeData(item)
  }
  
  defineExpose({
    initializeData
  })
  </script>