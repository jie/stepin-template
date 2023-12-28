<template>
  <div class="report">
    <div style="max-width: 700px; margin: 0 auto;">
      <div style="text-align: right;">
        <a-button class="mr-2" @click="onClickOpenGalleryDrawer">
          <template #icon><PlusOutlined /></template> Add Component
        </a-button>
        <a-button  @click="onClickOpenReportSettingDrawer">
          <template #icon> <SettingOutlined /></template> Settings
        </a-button>
      </div>
      <div class="title">
        <div>{{ props.title }}</div>
      </div>
      <div class="summary">
        <div>{{ props.summary }}</div>
      </div>
      <div v-for="item in props.items" :key="item.key">
        <div class="component" :class="{current: currentEditItem && currentEditItem.key == item.key}" @click="onSetCurrentCom(item)" v-if="item.type == 'text'">
          <div class="options">
            <ComMenu :item="item" v-on:on-edit-component="onEditCom"/>
          </div>
          <reportText :item="item" ref="itemRefs" />
        </div>
        <div class="component" :class="{current: currentEditItem && currentEditItem.key == item.key}" @click="onSetCurrentCom(item)" v-else-if="item.type == 'input'">
          <div class="options">
            
            <ComMenu :item="item" v-on:on-edit-component="onEditCom"/>
          </div>
          <reportInput :item="item" ref="itemRefs" />
        </div>
        <div class="component" :class="{current: currentEditItem && currentEditItem.key == item.key}" @click="onSetCurrentCom(item)" v-else-if="item.type == 'table'">
          <div class="options">
            
            <ComMenu :item="item" v-on:on-edit-component="onEditCom"/>
          </div>
          <reportTable :item="item" ref="itemRefs"></reportTable>
        </div>
        <div class="component" :class="{current: currentEditItem && currentEditItem.key == item.key}" @click="onSetCurrentCom(item)" v-else-if="item.type == 'container'">
          <div class="options">
            
            <ComMenu :item="item" v-on:on-edit-component="onEditCom"/>
          </div>
          <reportContainer :item="item" ref="itemRefs"></reportContainer>
        </div>
        <div v-else>unsupported components</div>
      </div>
    </div>
  </div>
  <div>

  </div>
  <a-drawer v-model:visible="drawerVisible" class="custom-class" style="color: red" width="60%" :title="drawerTitle"
    placement="right" @after-visible-change="afterVisibleChange">
    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click="onApply">Apply</a-button>
    </template>
    <TableEditor ref="tableEditor" />
  </a-drawer>
  <a-drawer v-model:visible="galleryDrawerVisible" class="custom-class" style="color: red" width="600" title="Gallery" placement="right">
    <ComGallery />
  </a-drawer>
  <a-drawer v-model:visible="reportSettingDrawerVisible" class="custom-class" style="color: red" width="600" title="Gallery" placement="right">
    <ReportSetting />
  </a-drawer>
</template>
<script lang="ts" setup>
import { defineProps, ref, computed, toRaw } from 'vue';
import ComMenu from './com_menu.vue'
import ComGallery from './com_gallery.vue'
import ReportSetting from './report_setting.vue'
import { EditOutlined, SettingOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import TableEditor from './table_editor.vue'
import reportTable from "./table/index.vue"
import reportText from "./reportText/index.vue"
import reportInput from "./reportInput/index.vue"
import reportContainer from "./container.vue"
type HeadImage = {
  url: string,
  style: object
}
const drawerTitle = ref<string>('');
const drawerVisible = ref<boolean>(false);
const galleryDrawerVisible = ref<boolean>(false);
const reportSettingDrawerVisible = ref<boolean>(false);
const afterVisibleChange = (bool: boolean) => {
  console.log('visible', bool);
};
const tableEditor = ref(null)
const itemRefs = ref([])
const currentEditItem = ref(null)
const onOpenEditor = (item: any) => {
  drawerVisible.value = true;
  drawerTitle.value = `${item.type} - Editor`;
  console.log('key:', item.key)
  setTimeout(() => {
    const itemRef = itemRefs.value.find(r => r?.props?.item?.key == item.key)
    let { columns, rows } = itemRef.getTableData()
    tableEditor.value.initializeData(item.key, columns.value, rows.value)
  }, 3000)
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

const onApply = () => {
  let exportData = tableEditor.value.exportData()
  console.log('data:', exportData)
  const itemRef = itemRefs.value.find(r => r?.props?.item?.key == exportData.key)
  console.log('itemRef:', itemRef)
  itemRef.updateTableData(exportData.data)
  drawerVisible.value = false;
}

const onEditCom = (item: any) => {
  console.log('onEditCom:', item)
  onOpenEditor(item)
  currentEditItem.value = item
}

const onClickOpenGalleryDrawer = () => {
  galleryDrawerVisible.value = true

}
const onClickOpenReportSettingDrawer = () => {
  reportSettingDrawerVisible.value = true

}

const onSetCurrentCom = (item:any) => {
  if(currentEditItem.value && currentEditItem.value.key == item.key) {
    currentEditItem.value = null
  } else {
    currentEditItem.value = item

  }
  console.log('currentEditItem.value:', currentEditItem.value)
}

</script>

<style scoped>
.title, .summary {
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
  border: 2px dashed #ccc;
  margin: 30px 0;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.component:hover, .component.current {
  border: 2px solid #000;
}

.component .options {
  text-align: right;
  margin-bottom: 10px;
}
</style>