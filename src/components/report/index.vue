<template>
  <div class="report">
    <div>
      <div>{{ props.title }}</div>
      <div>{{ props.summary }}</div>
      <div v-for="item in props.items" :key="item.key">
        <div v-if="item.type == 'text'">
          <reportText :item="item" />
        </div>
        <div v-else-if="item.type == 'input'">
          <reportInput :item="item" />
        </div>
        <div v-else-if="item.type == 'table'" @click="onOpenEditor">
          <reportTable :item="item"></reportTable>
        </div>
        <div v-else-if="item.type == 'container'">
          <reportContainer :item="item"></reportContainer>
        </div>
        <div v-else>unsupported components</div>
      </div>
    </div>
  </div>
  <div>

  </div>
  <a-drawer v-model:visible="drawerVisible" class="custom-class" style="color: red" width="60%" title="Basic Drawer" placement="right"
    @after-visible-change="afterVisibleChange">
    <ComEditor />
  </a-drawer>
</template>
<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import ComEditor from './com_editor.vue'
import reportTable from "./table/index.vue"
import reportText from "./reportText/index.vue"
import reportInput from "./reportInput/index.vue"
import reportContainer from "./container.vue"
type HeadImage = {
  url: string,
  style: object
}
const drawerVisible = ref<boolean>(false);
const afterVisibleChange = (bool: boolean) => {
  console.log('visible', bool);
};

const onOpenEditor = () => {
  drawerVisible.value = true;
};

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  // headerImage: {
  //     type: Object as PropType<HeadImage>,
  //     default: () => ({ url: '', style: {} })
  // },
  items: {
    type: Array,
    default: () => []
  }
})
console.log('items:', props.items)
const initializeReport = () => {

}

</script>