<template>
  <div class="report">
    <div style="max-width: 1024px;  padding: 20px; height: 100%;">
      <div class="component-operation">
        <!-- <a-button class="mr-2" @click="onClickPreview">
          <template #icon>
            <EyeOutlined />
          </template> {{ $t('base.Preview') }}
        </a-button> -->
        <a-button class="mr-2" @click="onClickOpenGalleryDrawer">
          <template #icon>
            <PlusOutlined />
          </template> {{ $t('base.AddComponent') }}
        </a-button>
        <a-button class="mr-2" @click="onClickOpenReportSettingDrawer">
          <template #icon>
            <SettingOutlined />
          </template> {{ $t('base.Settings') }}
        </a-button>
        <a-popconfirm :title="$t('base.ConfirmSave')" @confirm="onClickSaveReportTemplate">
          <a-button type="primary">
            <template #icon>
              <SaveOutlined />
            </template> {{ $t('base.Save') }}
          </a-button>
        </a-popconfirm>
      </div>
      <div class="title">
        <div>{{ reportTemplateStore.reportTemplate.title }}</div>
      </div>
      <div class="summary">
        <div>{{ reportTemplateStore.reportTemplate.summary }}</div>
      </div>

      <a-form layout="vertical" v-model="formState">
      <div v-for="item in reportTemplateStore.reportTemplate.items" :key="item.key">
        <div class="component" :class="{ current: currentEditItem && currentEditItem.key == item.key }"
          @click="onSetCurrentCom(item)" v-if="item.type == 'text'">
          <div class="options">
            <ComMenu :item="item" v-on:on-edit-component="onEditCom(item)"
              v-on:on-add-component="onAddAfterComponent(item)" v-on:on-del-component="onDelComponent(item)" v-on:on-move-down-component="onMoveDownComponent" v-on:on-move-up-component="onMoveUpComponent" />
          </div>
          <reportText :item="item" ref="itemRefs" />
        </div>
        <div class="component" :class="{ current: currentEditItem && currentEditItem.key == item.key }"
          @click="onSetCurrentCom(item)" v-else-if="item.type == 'input'">
          <div class="options">
            <ComMenu :item="item" v-on:on-edit-component="onEditCom(item)"
              v-on:on-add-component="onAddAfterComponent(item)" v-on:on-del-component="onDelComponent(item)" v-on:on-move-down-component="onMoveDownComponent" v-on:on-move-up-component="onMoveUpComponent" />
          </div>
          <reportInput :item="item" ref="itemRefs" />
        </div>
        <div class="component" :class="{ current: currentEditItem && currentEditItem.key == item.key }"
          @click="onSetCurrentCom(item)" v-else-if="item.type == 'input_group'">
          <div class="options">
            <ComMenu :item="item" v-on:on-edit-component="onEditCom(item)"
              v-on:on-add-component="onAddAfterComponent(item)" v-on:on-del-component="onDelComponent(item)" v-on:on-move-down-component="onMoveDownComponent" v-on:on-move-up-component="onMoveUpComponent" />
          </div>
          <reportInputGroup :item="item" ref="itemRefs" />
        </div>
        <div class="component" :class="{ current: currentEditItem && currentEditItem.key == item.key }"
          @click="onSetCurrentCom(item)" v-else-if="item.type == 'radio'">
          <div class="options">
            <ComMenu :item="item" v-on:on-edit-component="onEditCom(item)"
              v-on:on-add-component="onAddAfterComponent(item)" v-on:on-del-component="onDelComponent(item)" v-on:on-move-down-component="onMoveDownComponent" v-on:on-move-up-component="onMoveUpComponent" />
          </div>
          <reportRadio :item="item" ref="itemRefs" />
        </div>
        <div class="component" :class="{ current: currentEditItem && currentEditItem.key == item.key }"
          @click="onSetCurrentCom(item)" v-else-if="item.type == 'checkbox'">
          <div class="options">
            <ComMenu :item="item" v-on:on-edit-component="onEditCom(item)"
              v-on:on-add-component="onAddAfterComponent(item)" v-on:on-del-component="onDelComponent(item)" v-on:on-move-down-component="onMoveDownComponent" v-on:on-move-up-component="onMoveUpComponent" />
          </div>
          <reportCheckbox :item="item" ref="itemRefs" />
        </div>
        <div class="component" :class="{ current: currentEditItem && currentEditItem.key == item.key }"
          @click="onSetCurrentCom(item)" v-else-if="item.type == 'image'">
          <div class="options">
            <ComMenu :item="item" v-on:on-edit-component="onEditCom(item)"
              v-on:on-add-component="onAddAfterComponent(item)" v-on:on-del-component="onDelComponent(item)" v-on:on-move-down-component="onMoveDownComponent" v-on:on-move-up-component="onMoveUpComponent" />
          </div>
          <reportImage :item="item" ref="itemRefs" />
        </div>
        <div class="component" :class="{ current: currentEditItem && currentEditItem.key == item.key }"
          @click="onSetCurrentCom(item)" v-else-if="item.type == 'image_upload'">
          <div class="options">
            <ComMenu :item="item" v-on:on-edit-component="onEditCom(item)"
              v-on:on-add-component="onAddAfterComponent(item)" v-on:on-del-component="onDelComponent(item)" v-on:on-move-down-component="onMoveDownComponent" v-on:on-move-up-component="onMoveUpComponent" />
          </div>
          <reportImageUpload :item="item" ref="itemRefs" />
        </div>
        <div class="component" :class="{ current: currentEditItem && currentEditItem.key == item.key }"
         v-else-if="item.type == 'table'">
          <div class="options">
            <ComMenu :item="item" v-on:on-edit-component="onEditCom(item)"
              v-on:on-add-component="onAddAfterComponent(item)" v-on:on-del-component="onDelComponent(item)" v-on:on-move-down-component="onMoveDownComponent" v-on:on-move-up-component="onMoveUpComponent" />
          </div>
          <reportTable :item="item" ref="itemRefs"></reportTable>
        </div>
        <div class="component" :class="{ current: currentEditItem && currentEditItem.key == item.key }"
          @click="onSetCurrentCom(item)" v-else-if="item.type == 'container'">
          <div class="options">
            <ComMenu :item="item" v-on:on-edit-component="onEditCom(item)"
              v-on:on-add-component="onAddAfterComponent(item)" v-on:on-del-component="onDelComponent(item)" v-on:on-move-down-component="onMoveDownComponent" v-on:on-move-up-component="onMoveUpComponent" />
          </div>
          <reportContainer :item="item" ref="itemRefs"></reportContainer>
        </div>

        <div v-else>unsupported components</div>
      </div>
    </a-form>
    </div>
  </div>

  <a-drawer v-model:visible="editDrawerVisible" class="custom-class"  width="60%" :title="drawerTitle" :maskClosable="false"
    placement="right" @after-visible-change="afterVisibleChange">
    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">{{ $t('base.Cancel') }}</a-button>
      <a-button type="primary" @click="onApply">{{ $t('base.Apply') }}</a-button>
    </template>
    <a-spin :spinning="isDrawerLoading">
      <div>
        <TableEditor ref="tableEditor" v-if="currentEditItem?.type == 'table'" />
        <InputEditor ref="inputEditor" v-else-if="currentEditItem?.type == 'input'" />
        <InputGroupEditor ref="inputGroupEditor" v-else-if="currentEditItem?.type == 'input_group'" />
        <TextEditor ref="textEditor" v-else-if="currentEditItem?.type == 'text'" />
        <RadioEditor ref="radioEditor" v-else-if="currentEditItem?.type == 'radio'" />
        <CheckboxEditor ref="checkboxEditor" v-else-if="currentEditItem?.type == 'checkbox'" />
        <ImageEditor ref="imageEditor" v-else-if="currentEditItem?.type == 'image'" />
        <ImageUploadEditor ref="imageUploadEditor" v-else-if="currentEditItem?.type == 'image_upload'" />
        <ContainerEditor ref="containerEditor" v-else-if="currentEditItem?.type == 'container'" />
      </div>
    </a-spin>

  </a-drawer>

  <a-drawer v-model:visible="galleryDrawerVisible" class="custom-class"  width="600" title="Gallery"
    placement="right">
    <ComGallery v-on:add-component="onAddComponent" />
  </a-drawer>
  <a-drawer v-model:visible="reportSettingDrawerVisible" class="custom-class"  width="600" :maskClosable="false"
    :title="$t('base.Settings')" placement="right">
    <template #extra>
      <a-button style="margin-right: 8px" @click="onCloseSetting">{{ $t('base.Cancel') }}</a-button>
      <a-button type="primary" @click="onConfirmSetting">{{ $t('base.Confirm') }}</a-button>
    </template>
    <ReportSetting ref="reportSetting"/>
  </a-drawer>
</template>
<script lang="ts" setup>
import { defineProps, ref, computed, toRaw } from 'vue';
import ComMenu from './com_menu.vue'
import ComGallery from './com_gallery.vue'
import ReportSetting from './report_setting.vue'
import { EditOutlined, SettingOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import TableEditor from './reportTable/table_editor.vue'
import TextEditor from "./reportText/text_editor.vue"
import InputEditor from "./reportInput/input_editor.vue"
import InputGroupEditor from "./reportInputGroup/input_group_editor.vue"
import RadioEditor from "./reportRadio/radio_editor.vue"
import CheckboxEditor from "./reportCheckbox/checkbox_editor.vue"
import ImageEditor from "./reportImage/image_editor.vue"
import ImageUploadEditor from "./reportImageUpload/image_upload_editor.vue"
import ContainerEditor from "./reportContainer/container_editor.vue"
import reportTable from "./reportTable/index.vue"
import reportText from "./reportText/index.vue"
import reportInput from "./reportInput/index.vue"
import reportInputGroup from "./reportInputGroup/index.vue"
import reportRadio from "./reportRadio/index.vue"
import reportCheckbox from "./reportCheckbox/index.vue"
import reportImage from "./reportImage/index.vue"
import reportImageUpload from "./reportImageUpload/index.vue"
import reportContainer from "./container.vue"
import {
  ReportTitle,
  ReportInput,
  ReportInputGroup,
  ReportTable,
  ReportImage,
  ReportImageUpload,
  ReportRadio,
  ReportCheckbox,
  ReportContainer,
} from "@/types/components"
import { ReportTemplateStore } from "@/store/reportTemplate"
import { useRoute, useRouter } from "vue-router";
import { openNewUrl } from '@/utils/helpers';
import dayjs from 'dayjs';
const reportTemplateStore = ReportTemplateStore()
const router = useRouter()
const emits = defineEmits(["on-save-template"])

const reportSetting = ref(null)
const drawerTitle = ref<string>('');
const editDrawerVisible = ref<boolean>(false);
const galleryDrawerVisible = ref<boolean>(false);
const reportSettingDrawerVisible = ref<boolean>(false);
const afterVisibleChange = (bool: boolean) => {
  console.log('visible', bool);
};
const isDrawerLoading = ref(false)
const tableEditor = ref(null)
const textEditor = ref(null)
const inputEditor = ref(null)
const inputGroupEditor = ref(null)
const radioEditor = ref(null)
const checkboxEditor = ref(null)
const imageEditor = ref(null)
const imageUploadEditor = ref(null)
const itemRefs = ref([])
const currentEditItem = ref(null)
const currentEditRef = ref(null)
const formState = ref({})
const onOpenEditor = (item: any) => {
  editDrawerVisible.value = true;
  drawerTitle.value = `${item.type} - Editor`;
  console.log('onOpenEditor:', item)
  console.log('item.type:', item.type)
  console.log('currentEditItem:', toRaw(currentEditItem.value))
  isDrawerLoading.value = true
  setTimeout(() => {
    // const itemRef = itemRefs.value.find(r => r?.props?.item?.key == item.key)
    console.log('item.type:', item.type)
    switch (item.type) {
      case 'table':
        // tableEditor.value.initializeData(item.key, itemRef.getTableData())
        console.log('table')
        tableEditor.value.initializeData(item)
        currentEditRef.value = tableEditor.value
        break;
      case 'text':
        currentEditRef.value = textEditor.value
        textEditor.value.initializeData(item)
        break;
      case 'input':
        currentEditRef.value = inputEditor.value
        inputEditor.value.initializeData(item)
        break
      case 'input_group':
        currentEditRef.value = inputGroupEditor.value
        console.log('item:', toRaw(item))
        inputGroupEditor.value.initializeData(item)
        break;
      case 'radio':
        console.log('radio1')
        currentEditRef.value = radioEditor.value
        radioEditor.value.initializeData(item)
        break;
      case 'checkbox':
        currentEditRef.value = checkboxEditor.value
        checkboxEditor.value.initializeData(item)
        break;
      case 'image':
        currentEditRef.value = imageEditor.value
        imageEditor.value.initializeData(item)
        break;
      case 'image_upload':
        currentEditRef.value = imageUploadEditor.value
        imageUploadEditor.value.initializeData(item)
        break;
      case 'container':
        break;
      default:
        break;
    }
    // console.log('itemRef:', toRaw(itemRef))
    // let { columns, rows } = itemRef.getTableData()
    // tableEditor.value.initializeData(item.key, columns.value, rows.value)

    isDrawerLoading.value = false

  }, 800)
};

const onApply = () => {
  let exportData = currentEditRef.value.exportData()
  console.log('exportData2:', toRaw(exportData))
  // itemRef.updateTableData(exportData.data)
  reportTemplateStore.reportTemplate.items = reportTemplateStore.reportTemplate.items.map((c: any, index: number) => {
    if (c.key == exportData.key) {
      return JSON.parse(JSON.stringify(exportData))
    }
    return c
  })
  // let index;
  // for(let i = 0; i < reportTemplateStore.reportTemplate.items.length; i++) {
  //   if (reportTemplateStore.reportTemplate.items[i].key == exportData.key) {
  //     index = i
  //     break
  //   }
  // }
  // reportTemplateStore.reportTemplate.items[index] = exportData
  // sort items by sort
  reportTemplateStore.reportTemplate.items.sort((a: any, b: any) => {
    return a.sort - b.sort
  })
  editDrawerVisible.value = false;
}

const onEditCom = (item: any) => {
  console.log('onEditCom:', item)
  currentEditItem.value = item
  onOpenEditor(item)
}

const onDelComponent = (item: any) => {
  reportTemplateStore.reportTemplate.items = reportTemplateStore.reportTemplate.items.filter(c => c.key != item.key)
}

const onAddComponent = (com: any) => {
  console.log('onAddComponent:', toRaw(com.com))
  let sortNumber = '0'
  if(reportTemplateStore.reportTemplate.items && reportTemplateStore.reportTemplate.items.length != 0) {
    sortNumber = (parseInt(reportTemplateStore.reportTemplate.items[reportTemplateStore.reportTemplate.items.length - 1].sort) + 1).toString()
  }
  let newItem;
  switch (com.com.defaultData.type) {
    case "container":
      newItem = new ReportContainer(com.com.defaultData)
      break
    case "text":
      newItem = new ReportTitle(com.com.defaultData)
      break
    case "input":
      newItem = new ReportInput(com.com.defaultData)
      break
    case "input_group":
      newItem = new ReportInputGroup(com.com.defaultData)
      break
    case "table":
      newItem = new ReportTable(com.com.defaultData)
      break
    case "image":
      newItem = new ReportImage(com.com.defaultData)
      break
    case "image_upload":
      newItem = new ReportImageUpload(com.com.defaultData)
      break
    case "radio":
      newItem = new ReportRadio(com.com.defaultData)
      break
    case "checkbox":
      newItem = new ReportCheckbox(com.com.defaultData)
      break
    default:
      break
  }
  if (newItem) {
    console.log('newItem:', toRaw(newItem))
    newItem.sort = sortNumber
    reportTemplateStore.addComponent(newItem)
      galleryDrawerVisible.value = false
    console.log('all-items:', toRaw(reportTemplateStore.reportTemplate.items))

  }
}

const onAddAfterComponent = (item: any) => {
  console.log('onAddAfterComponent:', toRaw(item))
  // find reportTemplateStore.reportTemplate.items item index by key
  let index = reportTemplateStore.reportTemplate.items.findIndex(c => c.key == item.key)
  // insert item after index
  let newItem;
  switch (item.type) {
    case "container":
      newItem = new ReportContainer(item)
      break
    case "text":
      newItem = new ReportTitle(item)
      break
    case "input":
      newItem = new ReportInput(item)
      break
    case "table":
      console.log('item-table:', toRaw(item))
      newItem = new ReportTable(item)
      break
    case "image":
      newItem = new ReportImage(item)
      break
    case "image_upload":
      newItem = new ReportImageUpload(item)
      break
    case "radio":
      newItem = new ReportRadio(item)
      break
    case "checkbox":
      newItem = new ReportCheckbox(item)
      break
    default:
      break
  }
  if (newItem) {
    console.log('newItem.key:', newItem.key)
    newItem.generateKey()
    console.log('newItem.key:', newItem.key)
    reportTemplateStore.reportTemplate.items.splice(index + 1, 0, newItem)
  }
}

const onMoveDownComponent = (item: any) => {
  //swap i and i+1
  let index = reportTemplateStore.reportTemplate.items.findIndex(c => c.key == item.key)
  if (index < reportTemplateStore.reportTemplate.items.length - 1) {
    let temp = reportTemplateStore.reportTemplate.items[index]
    reportTemplateStore.reportTemplate.items[index] = reportTemplateStore.reportTemplate.items[index + 1]
    reportTemplateStore.reportTemplate.items[index + 1] = temp
  }
  for(let i = 0; i < reportTemplateStore.reportTemplate.items.length; i++) {
    reportTemplateStore.reportTemplate.items[i].sort = i.toString()
  }
}

const onMoveUpComponent = (item: any) => {
  // swap i and i-1
  let index = reportTemplateStore.reportTemplate.items.findIndex(c => c.key == item.key)
  if (index > 0) {
    let temp = reportTemplateStore.reportTemplate.items[index]
    reportTemplateStore.reportTemplate.items[index] = reportTemplateStore.reportTemplate.items[index - 1]
    reportTemplateStore.reportTemplate.items[index - 1] = temp
  }
  for(let i = 0; i < reportTemplateStore.reportTemplate.items.length; i++) {
    reportTemplateStore.reportTemplate.items[i].sort = i.toString()
  }
}


const onClickOpenGalleryDrawer = () => {
  galleryDrawerVisible.value = true

}
const onClickOpenReportSettingDrawer = () => {
  reportSettingDrawerVisible.value = true
  console.log('reportTemplateStore.reportTemplate.settings:', toRaw(reportTemplateStore.reportTemplate))
  let mySettings = {
    allowSelectImageFromAlbum: reportTemplateStore.reportTemplate.settings?.allowSelectImageFromAlbum === undefined ? true: reportTemplateStore.reportTemplate.settings.allowSelectImageFromAlbum,
    ReportNumber: reportTemplateStore.reportTemplate.settings?.ReportNumber === undefined ? true: reportTemplateStore.reportTemplate.settings.ReportNumber,
    Applicant: reportTemplateStore.reportTemplate.settings?.Applicant === undefined ? true: reportTemplateStore.reportTemplate.settings.Applicant,
    Supplier: reportTemplateStore.reportTemplate.settings?.Supplier === undefined ? true: reportTemplateStore.reportTemplate.settings.Supplier,
    Factory: reportTemplateStore.reportTemplate.settings?.Factory === undefined ? true: reportTemplateStore.reportTemplate.settings.Factory,
    ItemNumber: reportTemplateStore.reportTemplate.settings?.ItemNumber === undefined ? true: reportTemplateStore.reportTemplate.settings.ItemNumber,
    ProductDescription: reportTemplateStore.reportTemplate.settings?.ProductDescription === undefined ? true: reportTemplateStore.reportTemplate.settings.ProductDescription,
    AddressOfInspection: reportTemplateStore.reportTemplate.settings?.AddressOfInspection === undefined ? true: reportTemplateStore.reportTemplate.settings.AddressOfInspection,
    DateOfInspection: reportTemplateStore.reportTemplate.settings?.DateOfInspection === undefined ? true: reportTemplateStore.reportTemplate.settings.DateOfInspection,
    ArrivalTime: reportTemplateStore.reportTemplate.settings?.ArrivalTime === undefined ? true: reportTemplateStore.reportTemplate.settings.ArrivalTime,
    DepartureTime: reportTemplateStore.reportTemplate.settings?.DepartureTime === undefined ? true: reportTemplateStore.reportTemplate.settings.DepartureTime,
    Inspector: reportTemplateStore.reportTemplate.settings?.Inspector === undefined ? true: reportTemplateStore.reportTemplate.settings.Inspector,
    InspectStandard: reportTemplateStore.reportTemplate?.settings?.InspectStandard === undefined ? true: reportTemplateStore.reportTemplate?.settings?.InspectStandard,
    SampleSize: reportTemplateStore.reportTemplate?.settings?.SampleSize === undefined ? true: reportTemplateStore.reportTemplate?.settings?.SampleSize,
    AQL_CR: reportTemplateStore.reportTemplate?.settings?.AQL_CR === undefined ? true: reportTemplateStore.reportTemplate?.settings?.AQL_CR,
    AQL_MAJ: reportTemplateStore.reportTemplate?.settings?.AQL_MAJ === undefined ? true: reportTemplateStore.reportTemplate?.settings?.AQL_MAJ,
    AQL_MIN: reportTemplateStore.reportTemplate?.settings?.AQL_MIN === undefined ? true: reportTemplateStore.reportTemplate?.settings?.AQL_MIN,
    GeneralInspectionLevel: reportTemplateStore.reportTemplate?.settings?.GeneralInspectionLevel === undefined ? true: reportTemplateStore.reportTemplate?.settings?.GeneralInspectionLevel,
    InspectionType: reportTemplateStore.reportTemplate?.settings?.InspectionType === undefined ? true: reportTemplateStore.reportTemplate?.settings?.InspectionType,
    ReInspectionType: reportTemplateStore.reportTemplate?.settings?.ReInspectionType === undefined ? true: reportTemplateStore.reportTemplate?.settings?.ReInspectionType
  }
  console.log('mySettings:', mySettings)
  reportTemplateStore.reportTemplate.settings = {...mySettings}

}

const onClickPreview = () => {
  openNewUrl(router, {
    name: 'public_report',
    params: {
      reportId: reportTemplateStore.reportTemplate.id
    }
  })
}

const onSetCurrentCom = (item: any) => {
  console.log('onSetCurrentCom:', toRaw(item))
  if (currentEditItem.value && currentEditItem.value.key == item.key) {
    currentEditItem.value = null
  } else {
    currentEditItem.value = item
  }
  // console.log('currentEditItem.value:', currentEditItem)
}

const onClose = () => {
  console.log('onClose')
  editDrawerVisible.value = false
}

const onCloseSetting = () => {
  reportSettingDrawerVisible.value = false
}

const onConfirmSetting = () => {
  console.log('onConfirmSetting')
  let data =  reportSetting.value.exportData()
  console.log('data:', data)
  reportSettingDrawerVisible.value = false
}

const onClickSaveReportTemplate = async () => {
  console.log('saveData:', toRaw(reportTemplateStore.reportTemplate))
  // await db.updateReportTemplate(JSON.parse(JSON.stringify({
  //   id: reportTemplateStore.reportTemplate.id,
  //   title: reportTemplateStore.reportTemplate.title,
  //   summary: reportTemplateStore.reportTemplate.summary,
  //   settings: reportTemplateStore.reportTemplate.settings,
  //   items: reportTemplateStore.reportTemplate.items,
  // })))

  emits("on-save-template", {data: JSON.parse(JSON.stringify({
    id: reportTemplateStore.reportTemplate.id,
    title: reportTemplateStore.reportTemplate.title,
    summary: reportTemplateStore.reportTemplate.summary,
    settings: reportTemplateStore.reportTemplate.settings,
    items: reportTemplateStore.reportTemplate.items,
  }))})
  
}


</script>

<style scoped>
.component-operation {
  text-align: right; 
  position: fixed; 
  top: 82px; 
  left: 260px;
  background-color: #f9f9f9; 
  border: 2px solid #ccc; 
  z-index: 100; 
  padding: 20px; 
  border-radius: 20px; 
  box-shadow: 0 0 10px #ccc;
}
.title,
.summary {
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.title {
  margin-top: 60px;
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

.component:hover,
.component.current {
  border: 2px solid #000;
}

.component .options {
  text-align: left;
  margin-bottom: 10px;
}</style>