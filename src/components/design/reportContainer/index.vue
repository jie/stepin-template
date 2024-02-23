<template>
    <a-row type="flex" class="mt-1 mb-1">
      <a-col :flex="child.size" v-for="child in props.item?.data?.children">
        <div v-if="child.type == 'text'">
          <reportText :item="child" />
        </div>
        <div v-else-if="child.type == 'input'">
          <reportInput :item="child" />
        </div>
        <div v-else-if="child.type == 'image'">
          <reportImage :item="child" />
        </div>
        <div v-else-if="child.type == 'image_upload'">
          <reportImageUpload :item="child" />
        </div>
        <div v-else-if="child.type == 'radio'">
          <reportRadio :item="child" />
        </div>
        <div v-else-if="child.type == 'checkbox'">
          <reportCheckbox :item="child" />
        </div>
        <div v-else-if="child.type == 'table'">
          <reportTable :item="child"></reportTable>
        </div>
        <div v-else>unsupported components</div>
      </a-col>
    </a-row>
    <!-- {{ props.item.children }} -->
  </template>
  
  <script setup lang="ts">
  import reportTable from "../reportTable/index.vue"
  import reportText from "../reportText/index.vue"
  import reportImage from "../reportImage/index.vue"
  import reportImageUpload from "../reportImageUpload/index.vue"
  import reportRadio from "../reportRadio/index.vue"
  import reportCheckbox from "../reportCheckbox/index.vue"
  
  const props = defineProps({
    item: {
      type: Object
    }
  })
  
  </script>