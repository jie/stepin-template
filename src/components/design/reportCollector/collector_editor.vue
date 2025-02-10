<template>
  <div>
    <div>{{ $t('base.EditComponent') }} {{ baseForm?.title }}</div>
    <div>
      <BaseForm ref="baseForm" />
    </div>
    <div style="padding-left: 40px">
      <div style="margin-top:10px;">
        <a-form layout="vertical">
          <a-form-item :label="$t('base.HasFieldsManagement')" name="has_fields_management">
            <a-switch v-model:checked="itemData.has_fields_management" />
          </a-form-item>
          <a-form-item :label="$t('base.ItemNumberLabel')" name="item_number_label">
            <a-input v-model:value="itemData.item_number_label" style="width: 100%;" allow-clear></a-input>
          </a-form-item>
          <a-form-item :label="$t('base.SampleSizeLabel')" name="sample_size_label">
            <a-input v-model:value="itemData.sample_size_label" style="width: 100%;" allow-clear></a-input>
          </a-form-item>
          <a-form-item :label="$t('base.InspectResultLabel')" name="inspect_result_label">
            <a-input v-model:value="itemData.inspect_result_label" style="width: 100%;" allow-clear></a-input>
          </a-form-item>
          <a-form-item :label="$t('base.RemarksLabel')" name="remarks_label">
            <a-input v-model:value="itemData.remarks_label" style="width: 100%;" allow-clear></a-input>
          </a-form-item>
          <a-form-item :label="$t('base.ImagesLabel')" name="images_label">
            <a-input v-model:value="itemData.images_label" style="width: 100%;" allow-clear></a-input>
          </a-form-item>
          <a-form-item :label="$t('base.TakePhotoLabel')" name="take_photo_label">
            <a-input v-model:value="itemData.take_photo_label" style="width: 100%;" allow-clear></a-input>
          </a-form-item>
          <a-form-item :label="$t('base.DefectTypeLabel')" name="defect_type_label">
            <a-input v-model:value="itemData.defect_type_label" style="width: 100%;" allow-clear></a-input>
          </a-form-item>
          <a-form-item :label="$t('base.Conclusion')" name="conclusion_key">
            <a-select v-model:value="itemData.conclusion_key" style="width: 100%;" allow-clear
              @change="onChangeConclusionComponent">
              <a-select-option v-for="item in conclustionComponents" :key="item.key" :value="item.key">
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('base.ConclusionItem')" name="conclusion_item_key"
            v-if="conclustionComponentRecords && conclustionComponentRecords.length > 0">
            <a-select v-model:value="itemData.conclusion_item_key" style="width: 100%;" allow-clear>
              <a-select-option v-for="item in conclustionComponentRecords" :key="item.key" :value="item.key">
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('base.CollectorFields')" name="fields">
            <div>
              <a-tree-select v-model:value="currentFieldValue" show-search style="width: 100%" @change="onChangeField"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allow-clear
                tree-default-expand-all :tree-data="itemData.fields" tree-node-filter-prop="label">
                <template #title="{ value: val, label }">{{ label ? `${label} / ${val}` : '' }}</template>
              </a-tree-select>
            </div>
            <div style="margin-top: 10px;" class="flex space-x-4">
              <a-button type="primary" @click="onClickAddField" v-if="currentFieldValue === ''">
                <PlusCircleFilled />
                {{ $t('base.Add') }}
              </a-button>
              <a-button type="primary" @click="onClickEditField" v-else>
                <EditFilled />
                {{ $t('base.Edit') }}
              </a-button>
              <a-button type="danger" @click="handleDeleteField" v-if="currentFieldValue !== ''">
                <CloseCircleFilled />
                {{ $t('base.Delete') }}
              </a-button>
              <a-button type="default" @click="onClickMoveUp" v-if="currentFieldValue !== ''">
                <VerticalAlignTopOutlined />
                {{ $t('base.MoveUp') }}
              </a-button>
              <a-button type="default" @click="onClickMoveDown" v-if="currentFieldValue !== ''">
                <VerticalAlignBottomOutlined />{{ $t('base.MoveDown') }}
              </a-button>
              <a-button @click="onClickAddChild" v-if="currentFieldValue !== ''">
                <PlusOutlined />{{ $t('base.AddChild') }}
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <a-modal :getContainer="() => document.body" v-model:visible="isShowFieldDialogRef" :title="$t('base.EditField')"
      @ok="handleFieldOK">
      <a-form :model="fieldFormData" layout="vertical">
        <a-form-item :label="$t('base.Label')" name="label">
          <a-input v-model:value="fieldFormData.label"></a-input>
        </a-form-item>
        <a-form-item :label="$t('base.Value')" name="value">
          <a-input v-model:value="fieldFormData.value"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRaw } from "vue"
import BaseForm from "../base_editor.vue"
import { ReportTemplateStore } from "@/store/reportTemplate"
import { updateNodeLabel, findNodeLabel, deleteNode, moveUpNode, moveDownNode } from "@/utils/helpers"
import { message, Modal } from "ant-design-vue";
import { i18n } from '@/lang/i18n';
import { CloseCircleFilled, EditFilled, PlusCircleFilled, PlusOutlined, VerticalAlignTopOutlined } from "@ant-design/icons-vue";
import { newJsonObject, generateUUID } from "@/utils/helpers";

const reportTemplateStore = ReportTemplateStore()
const document = window.document
const isShowFieldDialogRef = ref(false)
const currentFieldValue = ref('');
const isAddChildRef = ref(false)
const props = defineProps({
  item: {
    type: Object,
  },
  value: {
    type: Object,
    default: {}
  }
})
const conclustionComponents = ref([])
const conclustionComponentRecords = ref([])
const fieldFormData = ref({
  label: '',
  value: '',
  children: []
})



const baseForm = ref(null)
const itemData = ref({
  conclusion_key: '',
  conclusion_item_key: '',
  fields: [],
  item_number_label: 'Item No.',
  sample_size_label: 'Sample Size',
  inspect_result_label: 'Inspect Result',
  remarks_label: 'Remarks',
  images_label: 'Images',
  take_photo_label: 'Upload / Take Photo',
  defect_type_label: 'Defect Type',
  has_fields_management: true
})

const onChangeConclusionComponent = () => {
  const item = reportTemplateStore.reportTemplate.items.find(c => c.key === itemData.value.conclusion_key)
  if (item?.data?.conclusions) {
    conclustionComponentRecords.value = item.data.conclusions
    itemData.value.conclusion_item_key = ''
  }
}

const handleFieldOK = () => {
  if (currentFieldValue.value !== "") {
    if (isAddChildRef.value) {
      let node = findNodeLabel(itemData.value.fields, currentFieldValue.value)
      if (node) {
        node.children.push(newJsonObject(fieldFormData.value))
      }
    } else {
      updateNodeLabel(itemData.value.fields, currentFieldValue.value, newJsonObject(fieldFormData.value))
    }
  } else {
    let node = findNodeLabel(itemData.value.fields, fieldFormData.value.value)
    if (node) {
      message.error(i18n.global.t('base.ValueAlreadyExists'))
      return
    }
    itemData.value.fields.push(newJsonObject(fieldFormData.value))
  }
  isShowFieldDialogRef.value = false
  currentFieldValue.value = ""
  isAddChildRef.value = false
}


const onClickAddField = () => {
  fieldFormData.value = {
    label: '',
    value: '',
    children: []
  }
  isShowFieldDialogRef.value = true
}

const onClickAddChild = () => {
  if (currentFieldValue.value == '') {
    return
  }
  isAddChildRef.value = true
  fieldFormData.value = {
    label: '',
    value: '',
    children: []
  }

  isShowFieldDialogRef.value = true
}


const onClickEditField = () => {
  if (currentFieldValue.value == '') {
    return
  }
  let node = findNodeLabel(itemData.value.fields, currentFieldValue.value)
  let targetNode = newJsonObject(node)
  fieldFormData.value.label = targetNode.label
  fieldFormData.value.value = targetNode.value
  isShowFieldDialogRef.value = true
}

const handleDeleteField = () => {
  if (currentFieldValue.value == '') {
    return
  }

  Modal.confirm({
    title: i18n.global.t('base.Delete'),
    content: i18n.global.t('base.DeleteContent'),
    zIndex: 1001,
    onOk() {
      deleteNode(itemData.value.fields, currentFieldValue.value)
      currentFieldValue.value = ''
    },
    onCancel() {
    },
  });
}


const onClickMoveUp = () => {
  if (currentFieldValue.value == '') {
    return
  }
  moveUpNode(itemData.value.fields, currentFieldValue.value)
}

const onClickMoveDown = () => {
  if (currentFieldValue.value == '') {
    return
  }
  moveDownNode(itemData.value.fields, currentFieldValue.value)
}

const onChangeField = (e) => {
  console.log('e:', e, ',currentFieldValue:', currentFieldValue.value)
  if (e == undefined) {
    currentFieldValue.value = ''
  }
}

const initializeData = (item: any) => {
  console.log('initializeData:', toRaw(item), toRaw(props.value))
  conclustionComponents.value = reportTemplateStore.reportTemplate.items.filter(c => c.type === 'conclusion' && c.key != item.key)

  if (item?.data?.conclusion_key) {
    conclustionComponentRecords.value = reportTemplateStore.reportTemplate.items.find(c => c.key === item.data.conclusion_key).data.conclusions
  }
  baseForm.value.initializeData(item)
  if (item.data) {
    itemData.value.conclusion_key = item.data.conclusion_key || ''
    itemData.value.conclusion_item_key = item.data.conclusion_item_key || ''
    itemData.value.fields = item.data.fields || []
    itemData.value.item_number_label = item.data.item_number_label || 'Item No.'
    itemData.value.sample_size_label = item.data.sample_size_label || 'Sample Size'
    itemData.value.inspect_result_label = item.data.inspect_result_label || 'Inspect Result'
    itemData.value.remarks_label = item.data.remarks_label || 'Remarks'
    itemData.value.images_label = item.data.images_label || 'Images'
    itemData.value.defect_type_label = item.data.defect_type_label || 'Defect Type'
    itemData.value.take_photo_label = item.data.take_photo_label || 'Upload / Take Photo'
    itemData.value.has_fields_management = item.data.has_fields_management || true
  } else {
    itemData.value.conclusion_key = ''
    itemData.value.conclusion_item_key = ''
    itemData.value.fields = []
    itemData.value.item_number_label = 'Item No.'
    itemData.value.sample_size_label = 'Sample Size'
    itemData.value.inspect_result_label = 'Inspect Result'
    itemData.value.remarks_label = 'Remarks'
    itemData.value.images_label = 'Images'
    itemData.value.defect_type_label = 'Defect Type'
    itemData.value.take_photo_label = 'Upload / Take Photo'
    itemData.value.has_fields_management = true
  }
}
const exportData = () => {
    let baseData = baseForm.value.exportData()
    return {...baseData, data: {...itemData.value}}
}

defineExpose({
  initializeData,
  exportData
})
</script>