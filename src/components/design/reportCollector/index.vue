<template>
  <div>
    <BaseSlot :item="props?.item">

      <a-form-item :label="props?.item?.data?.label" :name="props?.item?.key" :id="props?.item?.key"
        :rules="[{ required: props?.item?.required, message: $t('base.pleaseSetFieldValue', { 'label': props?.item?.title }), trigger: 'change' }]">
        <div>
          <div :id="`status-null-${props.item.key}`">
            <a-form-item :label="$t('base.InspectResult')" :name="`status-null-${props.item.key}`"
              v-if="props?.item?.data?.hasStatus || props?.item?.data?.auto_result"
              :rules="[{ required: true, message: $t('base.pleaseSelectInspectResult'), validator: validateRequired, trigger: 'change' }]">
              <a-radio-group size="small" v-model:value="statusForm.status" button-style="solid"
                @change="onConclusionChangeStatus" v-if="props?.item?.data?.auto_result">
                <a-radio-button style="font-size: 12px"
                  v-for="option in [{ 'label': 'PASS', 'value': 'conformed' }, { 'label': 'FAIL', 'value': 'not_conformed' }]"
                  :value="option.value">{{
                    option.label
                  }}</a-radio-button>
              </a-radio-group>
              <a-radio-group size="small" v-model:value="statusForm.status" button-style="solid"
                @change="onConclusionChangeStatus" v-else>
                <a-radio-button style="font-size: 12px" v-for="option in conclusionRef?.data?.options"
                  :value="option.value">{{
                    option.label
                  }}</a-radio-button>
              </a-radio-group>
              <div v-if="itemData?.dataRecords?.length != 0 && Object.keys(itemData.defectsResult)?.length != 0"
                style="margin-top: 10px;">
                <a-table bordered :rowClassName="(r, index) => {
                  if (r.found > r.allowed) {
                    return 'table-row-warning custom-row'
                  } else {
                    return 'custom-row'
                  }
                }" :columns="[
                  { title: $t('base.defect_types'), dataIndex: 'key', key: 'key' },
                  { title: $t('base.FoundDefects'), dataIndex: 'found', key: 'found' },
                  { title: $t('base.AllowDefects'), dataIndex: 'allowed', key: 'allowed' },
                ]"
                  :dataSource="Object.keys(itemData.defectsResult).map(c => ({ 'key': c, 'found': itemData.defectsResult[c].found, 'allowed': itemData.defectsResult[c].allowed }))"
                  :pagination="false" />
              </div>
            </a-form-item>
            <a-form-item :label="$t('base.Remark')" name="remark" v-if="props?.item?.data?.hasRemarks">
              <a-textarea :auto-size="{ minRows: 1, maxRows: 5 }" v-model:value="statusForm.remark"></a-textarea>
            </a-form-item>
          </div>
          <div
            v-if="props?.item?.data?.display_as_table && itemData?.dataRecords?.length != 0 && itemData?.dataRecords[0][0].data"
            style="margin-top: 10px; margin-bottom: 10px;">
            <a-table bordered :columns="displayTableColumns" :dataSource="displayTableSource" :pagination="false"
              :scroll="{ x: 1024 }" />
          </div>

          <div class="records">
            <div v-if="!readonlyRef && props.item?.data?.hasAddRecordButton" class="mb-4">
              <a-button type="primary" size="small" style="font-size: 80%; margin-right: 10px;"
                @click="onClickAdd"><template #icon>
                  <plus-circle-outlined />
                </template>{{ $t('base.AddRecord') }}</a-button>
            </div>
            <a-badge-ribbon placement="start" :text="index + 1" :color="getStatusLabelColor(record)"
              v-for="(record, index) in itemData.dataRecords">
              <div class="record">
                <div class="record-fields" v-for="field in record" :id="`${field.value}-${index}-${props.item.key}`">
                  <a-form-item :label="field.label" :name="`${field.value}-${index}-${props.item.key}`"
                    :rules="[{ required: isFieldRequire(field), message: $t('base.pleaseSetFieldValue', { 'label': field.label }), validator: validateRequired, trigger: 'change' }]">
                    <div class="field" v-if="field.value == 'item_number'">
                      <div v-if="!readonlyRef">
                        <a-select v-model:value="field.data" style="width: 100%" mode="tags"
                          :options="store.formState['ItemNumber']?.map(c => ({ 'label': c, 'value': c }))"
                          @change="onChangeItemNumber(field.data, index)"
                          :getPopupContainer="triggerNode => triggerNode.parentNode" :disabled="readonlyRef"></a-select>
                      </div>
                      <div v-else>
                        <a-tag v-for="tag in field.data">{{ tag }}</a-tag>
                      </div>
                    </div>
                    <div class="field" v-else-if="field.value == 'quantity'">
                      <div>
                        <a-input-number v-model:value="field.data" @change="onChange" style="width: 100%;" :min="0"
                          :readonly="readonlyRef" />
                      </div>
                    </div>
                    <div class="field" v-else-if="field.value == 'status'">
                      <div v-if="!readonlyRef">
                        <a-select v-model:value="field.data" style="width: 100%"
                          :getPopupContainer="triggerNode => triggerNode.parentNode" @change="onChangeStatus">
                          <a-select-option v-for="option in conclusionRef?.data?.options" :key="option.value"
                            :value="option.value">
                            {{ option.label }}
                          </a-select-option>
                        </a-select>
                      </div>
                      <div v-else><a-tag :color="getStatusLabelColor(record)">{{
                        conclusionRef?.data?.options?.find(o => o.value == field?.data)?.label }}</a-tag></div>
                    </div>
                    <div class="field" v-else-if="field.value == 'remark'">
                      <div>
                        <div v-if="props?.item?.data?.isDefect">
                          <div>
                            <a-auto-complete :getPopupContainer="triggerNode => triggerNode.parentNode"
                              v-model:value="field.data" style="width: 100%" :options="defectOptions" @change="onChange"
                              @search="handleSearchDefect" allowClear>
                              <template #option="{ content_en: content_en, id: id, content: content }">
                                <div style="display:flex" @click="onDefectSelect(id, field)"
                                  v-if="conclusionRef?.data?.languageType == 'single'">
                                  <span style="flex: 1">{{ i18n.global.locale == 'zh' ? content : content_en }}</span>
                                  <span style="font-weight: bold; width: 150px;">{{ i18n.global.locale == 'zh' ? content
                                    :
                                    content_en }}</span>
                                </div>
                                <div style="display:flex" @click="onDefectSelect(id, field)" v-else>
                                  <span style="flex: 1">{{ content }} / {{ content_en }}</span>
                                  <span style="font-weight: bold; width: 150px;">{{ content }} / {{ content_en }}</span>
                                </div>
                              </template>
                              <a-textarea :auto-size="{ minRows: 2, maxRows: 5 }" @keydown.enter.prevent
                                :placeholder="$t('base.pleaseEnterDefectKeywords')" />
                            </a-auto-complete>
                          </div>
                          <div class="mt-2">
                            <div style="font-size: 85%">{{ field.defect_type_label }}</div>
                            <a-select v-model:value="field.defect_type" style="width: 100%" v-if="!readonlyRef"
                              :options="defectTypeOptions" @change="onChangeDefectItem"
                              :getPopupContainer="triggerNode => triggerNode.parentNode"></a-select>
                            <div v-else>
                              <a-tag v-for="type in field.defect_type" :key="type" style="margin-top: 5px;">{{ type
                                }}</a-tag>
                            </div>
                          </div>
                          <div class="mt-2">
                            <div style="font-size: 85%">{{ field.defect_count_label }}</div>
                            <a-input-number v-model:value="field.defect_count" style="width: 100%;" :min="0"
                              v-if="!readonlyRef" @change="onChangeDefectItem" />
                            <div v-else> {{ field.defect_count }} </div>
                          </div>
                        </div>
                        <a-input v-model:value="field.data" allowClear @change="onChange" :readonly="readonlyRef"
                          v-else></a-input>
                      </div>
                    </div>
                    <div class="field relative" v-else-if="field.value == 'images'">
                      <div>
                        <div>
                          <a-row type="flex" :gutter="[16, 16]">
                            <a-col v-for="item in field.data" :key="item.url" :span="8">
                              <div style="width: 100%; aspect-ratio: 1 / 1;">
                                <a-image :src="item.url"
                                  style="width: 100%; aspect-ratio: 1 / 0.6; object-fit: cover;" />
                                <div v-if="item.desc" style="font-size: 12px">{{ item.desc }}</div>
                                <div class="flex pt-2" style="justify-content: space-around;" v-if="!readonlyRef">
                                  <a-button size="small" type="primary" @click="editImage(field, item)">
                                    <template #icon>
                                      <EditOutlined />
                                    </template>
                                  </a-button>
                                  <a-button size="small" type="danger" @click="deleteImage(field, item)">
                                    <template #icon>
                                      <DeleteOutlined />
                                    </template>
                                  </a-button>
                                  <a-button size="small" type="default" @click="remarkImage(field, item)">
                                    <template #icon>
                                      <FormOutlined />
                                    </template>
                                  </a-button>
                                </div>
                              </div>
                            </a-col>
                          </a-row>
                        </div>
                        <div v-if="!readonlyRef">
                          <a-button size="small" type="primary"
                            @click="onClickUpload(field, `${field.value}-${index}-${props.item.key}`)"
                            style="font-size: 80%">
                            <template #icon>
                              <camera-outlined />
                            </template>
                            {{ props.item.data.take_photo_label }}
                          </a-button>
                        </div>
                      </div>
                    </div>
                    <div class="field" v-else>
                      <div>
                        <a-textarea :auto-size="{ minRows: 1, maxRows: 5 }" v-model:value="field.data"
                          :readonly="readonlyRef" />
                      </div>
                    </div>
                  </a-form-item>
                </div>
                <div class="delete-record">
                  <a-button size="small" style="font-size: 80%;" type="text" @click="onClickDeleteRecord(index)"
                    v-if="index > 0">
                    <template #icon>
                      <delete-outlined />
                    </template>
                  </a-button>
                </div>
                <a-button type="default" size="small" style="font-size: 80%" @click="onClickAddField"
                  v-if="props?.item?.data?.has_fields_management">
                  <template #icon>
                    <tags-outlined />
                  </template>{{ props.item?.data?.column_manage_label || $t('base.FieldManagement') }}
                </a-button>
              </div>
            </a-badge-ribbon>
          </div>
        </div>
      </a-form-item>
      <div v-if="props?.item?.hasRemark" style="margin-top:10px;">
        <a-textarea :auto-size="{ minRows: 1, maxRows: 5 }" v-model:value="props.value.remark" @change="onChange"
          :readonly="readonlyRef" :placeholder="$t('base.PleaseEnterRemark')" />
      </div>
      <input type="file" ref="fileBtnRef" style="display: none" @change="onUploadInputChange"
        :accept="props?.item?.data?.accept" :multiple="targetEditImageRef === null" />
      <a-modal :getContainer="() => document.body" v-model:visible="isShowRemarkDialog" :title="$t('base.AddRemark')"
        @ok="handleRemarkOK">
        <a-form layout="vertical">
          <a-form-item :label="$t('base.Remark')" name="remark">
            <a-textarea :auto-size="{ minRows: 1, maxRows: 5 }" v-model:value="imageRemarkRef"></a-textarea>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal :getContainer="() => document.body" v-model:visible="isShowAddFieldDialog"
        :title="$t('base.FieldManagement')" @ok="handleAddFieldOK" :okText="$t('base.Close')" :footer="null">
        <a-form layout="vertical">
          <a-form-item :label="$t('base.FieldName')" name="label">
            <a-input v-model:value="fieldForm.label" />
          </a-form-item>
          <a-form-item label="">
            <a-button size="small" type="primary" style="font-size: 80%" @click="handleAddFieldOK"
              :disabled="!fieldForm.label">
              <template #icon>
                <plus-circle-outlined />
              </template>
              {{ $t('base.AddField') }}
            </a-button>
          </a-form-item>
          <a-form-item label="">
            <div>
              <div v-for="field in itemData.dataExtraFields" class="flex"
                style="border-bottom: 1px solid #ddd; padding-bottom: 5px; padding-top: 5px">
                <div class="flex-1">{{ field }}</div>
                <div>
                  <a-button size="small" type="text" style="font-size: 80%" @click="onClickDeleteField(field)">
                    <template #icon>
                      <delete-outlined />
                    </template>
                  </a-button>
                </div>
              </div>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
    </BaseSlot>
  </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { ReportTemplateStore } from "@/store/reportTemplate"
import { defineProps, ref, PropType, reactive, toRaw, watch, defineEmits, computed } from 'vue'
import Icon, { CheckSquareOutlined, CloseCircleFilled, EditOutlined } from '@ant-design/icons-vue';
import { MessageOutlined } from '@ant-design/icons-vue';
import { MessageOutlinedIconType } from "@ant-design/icons-vue/lib/icons/MessageOutlined";
import { findLeafNode, newJsonObject } from '@/utils/helpers'
import { ossUploadFiles } from "@/store/uploader"
import { message, Modal } from "ant-design-vue";
import { i18n } from "@/lang/i18n";
import { ReportFillStore } from "@/store/report_fill"
import { useRoute } from 'vue-router'
import { getStatusLabelColor, determineStatus } from "@/utils/helpers"
import { batchSizeData, qualityLimitation, aclList } from "@/utils/sampling"
import { find } from "lodash";
const emits = defineEmits(["update:value", "updateCollector", "updateConclusionInspectResult", "clearFieldError", "validateImagesField"])
const document = window.document
const route = useRoute()
const reportTemplateStore = ReportTemplateStore()
const readonlyRef = ref(route.path.includes('/customer_report/'))
const defectOptions = ref([])
// const dataSchema = ref([])
// const dataRecords = ref([])
const conclusionRef = ref(null)
const conclusionItemRef = ref(null)
const targetEditImageRef = ref(null)
const currentUploadRecordKeyRef = ref(null)
const fileBtnRef = ref(null);
const currentUploadField = ref(null)
const isShowRemarkDialog = ref(false)
const isShowAddFieldDialog = ref(false)
const imageRemarkRef = ref('')
const store = ReportFillStore()
// store.apiQueryDefectByReportId()
const props = defineProps({
  item: {
    type: Object,
  },
  value: {
    type: Object as PropType<any>,
  }
})
const itemData = reactive({
  conclusions: [],
  dataSchema: {},
  dataRecords: [],
  dataExtraFields: [],
  fields: [],
  defectsResult: {}
})
const statusForm = reactive({
  status: '',
  remark: ''
})
const fieldForm = reactive({
  label: '',
  value: '',
})


const isFieldRequire = (field) => {
  if (field.type === 'remark' || field.type === 'images') {
    return false
  } else if (itemData.dataExtraFields.includes(field.type)) {
    return false
  } else if(field.required) {
    return true
  }
  return false
}

const regex = /\s*\(((?:[^()]|\((?:[^()]|\([^()]*\))*\))*)\)\s*$/;

function transformFields(items) {
  return items.map(item  => {
    const transformed = {
      title: item.label.replace(regex, ''),
      dataIndex: item.value, 
      key: item.value, 
      required: item.required  
    };
 
    if (item.children?.length)  {
      transformed.children  = transformFields(item.children); 
    }
 
    return Object.fromEntries( 
      Object.entries(transformed).filter(([_,  v]) => v !== undefined)
    );
  });
}
const displayTableColumns = computed(() => {
  return transformFields(props.item?.data?.fields);
})

const displayTableSource = computed(() => {
  let source = []
  if (itemData.dataRecords && itemData.dataRecords.length > 0) {
    for (let record of itemData.dataRecords) {
      let item = {}
      for (let field of record) {
        item[field.value] = field.data
      }
      source.push(item)
    }
  }
  return source
})

const defectTypeMap = {
  'critical': 'AQL_CR',
  'major': 'AQL_MAJ',
  'minor': 'AQL_MIN'
}

const onChangeDefectItem = () => {
  autoUpdateDefectsResult()
}

const autoUpdateDefectsResult = () => {
  console.log("autoUpdateDefectsResult:", toRaw(store.defectsAllowedMap))
  if (!conclusionItemRef.value?.isDefect) {
    return
  }
  let defectsResult = {
    'critical': {
      'found': 0,
      'allowed': store.defectsAllowedMap[defectTypeMap['critical']],
      "status": "NotConform"
    },
    'major': {
      'found': 0,
      'allowed': store.defectsAllowedMap[defectTypeMap['major']],
      "status": "NotConform"
    },
    'minor': {
      'found': 0,
      'allowed': store.defectsAllowedMap[defectTypeMap['minor']],
      "status": "NotConform"
    }
  }
  for (let record of itemData.dataRecords) {
    for (let field of record) {
      if (field.value == 'remark') {
        if (field.defect_type && field.defect_count) {
          defectsResult[field.defect_type]['found'] += field.defect_count
        }
        break
      }

    }
  }
  for (let key in defectsResult) {
    if (defectsResult[key]['found'] > defectsResult[key]['allowed']) {
      defectsResult[key]['status'] = 'NotConform'
    } else {
      defectsResult[key]['status'] = 'Conform'
    }
  }
  itemData.defectsResult = defectsResult
  let allDefectStatus = Object.values(defectsResult).map(c => c.status)
  if (allDefectStatus.includes('NotConform')) {
    statusForm.status = 'NotConform'
  } else {
    statusForm.status = 'Conform'
  }
}

const onChange = (e) => {
  console.log('onChange:', toRaw(e))
  emits('update:value', exportValue())
  // emits('clearFieldError', e.target.id.replace('form_item_', ''))
}

const onChangeStatus = (e) => {
  console.log('onChangeStatus:', toRaw(e))
  let statuesRecords = itemData.dataRecords.map((item) => {
    return {
      status: item.find(c => c.value === 'status')?.data
    }
  })
  statusForm.status = determineStatus(statuesRecords)
  console.log('statusForm.status:', statusForm.status)
  emits('update:value', exportValue())
  emits('updateCollector', props.item)
  // emits('clearFieldError', e.target.id.replace('form_item_', ''))
}

const onConclusionChangeStatus = (e) => {
  console.log('onConclusionChangeStatus:', toRaw(e))
  if (conclusionItemRef.value) {
    emits('updateConclusionInspectResult', props.item, statusForm.status, statusForm.remark)
    // emits('clearFieldError', e.target.id.replace('form_item_', ''))
  }
}

const validateImagesField = (imageFieldId) => {
  emits('validateImagesField', imageFieldId)
};

const validateRequired = (rule, value, callback) => {
  let [fieldType, index, key] = rule.field.split('-')
  let result = true
  if (index === 'null') {
    if (statusForm.status === '') {
      result = false
    }
  } else {

    let field = itemData.dataRecords[index].find(c => c.value === fieldType)
    if (field && fieldType == 'images' && field?.data?.length === 0) {
      result = false
    } else {
      if (field && (field.data === '' || field.data === undefined || field.data === null)) {
        result = false
      }
    }
  }
  console.log('result:', result)
  return new Promise((resolve, reject) => {
    if (result) {
      resolve(true)
    } else {
      reject(false)
    }
  });
}

const defectTypeOptions = [
  { label: 'critical', value: 'critical' }, { label: 'major', value: 'major' }, { label: 'minor', value: 'minor' }
]

const onClickAdd = () => {
  console.log('props.value?.data?.dataSchema:', toRaw(props.value?.data?.dataSchema))
  if (props.value?.data?.dataSchema) {
    let dataSchema = []
    for (let item of props.value?.data?.dataSchema) {
      console.log('item:', typeof (item?.data))
      if (typeof item?.data === 'string') {
        let option = {
          label: item.label,
          value: item.value,
          data: ''
        }
        if (item.defect_type_label) {
          option.defect_type_label = item.defect_type_label
        }
        if (item.defect_count_label) {
          option.defect_count_label = item.defect_count_label
        }

        dataSchema.push(option)
      } else {
        dataSchema.push({
          label: item.label,
          value: item.value,
          data: []
        })
      }
    }
    itemData.dataRecords.push(newJsonObject(dataSchema))
  } else {
    itemData.dataRecords.push(newJsonObject(itemData.dataSchema))
  }
}


const onClickUpload = (field: any, key: string) => {
  currentUploadField.value = field
  targetEditImageRef.value = null
  currentUploadRecordKeyRef.value = key
  setTimeout(() => {
    fileBtnRef.value.click()
  }, 500)
}


const onUploadInputChange = async (e: Event) => {
  let images = await ossUploadFiles(e)
  if (targetEditImageRef.value !== null) {
    let targetImage = currentUploadField.value.data.find(item => item.url === targetEditImageRef.value.url)
    if (targetImage) {
      targetImage.url = images[0]
      targetImage.uid = images[0]
    }
  } else {
    if (!currentUploadField.value.data) {
      currentUploadField.value.data = []
    }
    for (let item of images) {
      currentUploadField.value.data.push({
        name: "",
        url: item,
        status: "done",
        uid: item,
        desc: ""
      })
    }
  }
  emits('update:value', exportValue())
  validateImagesField(currentUploadRecordKeyRef.value)
}


const onChangeItemNumber = (itemNumbers: string[], index: number) => {
  emits('update:value', exportValue())
  let targetCom = store.report.template?.items?.find(c => c.key === props?.item?.data?.sample_size_item_key)
  let targetValue = store.formState[props?.item?.data?.sample_size_item_key]
  if (targetCom && targetValue) {
    let sampleSize = 0
    for (let itemNumber of itemNumbers) {
      for (let record of targetValue.data.dataRecords) {
        let recordItemNumbers = record.find(c => c.value === 'item_number')?.data
        let recordSampleSize = record.find(c => c.value === 'quantity')?.data
        if (itemNumber === recordItemNumbers[0] && recordSampleSize) {
          sampleSize += parseInt(recordSampleSize)
        }
      }
    }
    itemData.dataRecords[index].find(c => c.value === 'quantity').data = sampleSize
  }

}

const editImage = (field: any, item: any) => {
  targetEditImageRef.value = item
  setTimeout(() => {
    fileBtnRef.value.click()
  }, 500)
}
const remarkImage = (field: any, item: any) => {
  targetEditImageRef.value = item
  imageRemarkRef.value = item.desc
  isShowRemarkDialog.value = true
}


const deleteImage = (field: any, item: any) => {
  Modal.confirm({
    title: i18n.global.t('base.Delete'),
    content: i18n.global.t('base.Delete'),
    getContainer: () => document.body,
    zIndex: 1001,
    onOk() {
      field.data = field.data.filter(i => i.url !== item.url)
      emits('update:value', exportValue())
      if (field.value == 'images') {
        validateImagesField(`form-item-${field.value}-${itemData.dataRecords.indexOf(field)}`)
      }
    },
    onCancel() {
    },
  });
}

const handleRemarkOK = () => {
  isShowRemarkDialog.value = false
  targetEditImageRef.value.desc = imageRemarkRef.value
  targetEditImageRef.value = null
  imageRemarkRef.value = ''
  emits('update:value', exportValue())
}


const onClickDeleteRecord = (index: number) => {
  Modal.confirm({
    title: i18n.global.t('base.Delete'),
    content: i18n.global.t('base.Delete'),
    zIndex: 1001,
    getContainer: () => document.body,
    onOk() {
      itemData.dataRecords.splice(index, 1)
      emits('update:value', exportValue())
    },
    onCancel() {
      console.log('Cancel  button clicked');
    },
  });
}

const onClickAddField = (index: number) => {
  isShowAddFieldDialog.value = true
}

const handleAddFieldOK = () => {
  for (let record of itemData.dataRecords) {
    let needAdd = true
    for (let field of record) {
      if (field.label === fieldForm.label || field.value === fieldForm.value) {
        needAdd = false
        break
      }
    }
    if (needAdd) {
      if (!itemData.dataExtraFields.includes(fieldForm.label)) {
        itemData.dataExtraFields.push(fieldForm.label)
      }
      record.push({
        label: fieldForm.label,
        value: fieldForm.label,
        data: fieldForm.value
      })
      if (!itemData.dataSchema.find(c => c.label === fieldForm.label || c.value === fieldForm.label)) {
        itemData.dataSchema.push({
          label: fieldForm.label,
          value: fieldForm.label
        })
      }
      emits('update:value', exportValue())
    } else {
      message.error('Field already exists')
    }
  }
  console.log('handleAddFieldOK2:', toRaw(itemData))
  fieldForm.label = ''
  fieldForm.value = ''
}

const onClickDeleteField = (fieldKey: string) => {
  for (let record of itemData.dataRecords) {
    for (let field of record) {
      if (field.label === fieldKey || field.value === fieldKey) {
        record.splice(record.indexOf(field), 1)
        break
      }
    }
  }
  if (!itemData.dataExtraFields.includes(fieldForm.label)) {
    itemData.dataExtraFields = itemData.dataExtraFields.filter(c => c != fieldKey)
  }
  itemData.dataSchema = itemData.dataSchema.filter(c => c.label !== fieldKey && c.value !== fieldKey)
  emits('update:value', exportValue())
}

const handleSearchDefect = (value) => {
  console.log('handleSearchDefect:', value)
  defectOptions.value = value ? store.defects.filter((s) => s?.content_en?.toLowerCase()?.includes(value.toLowerCase()) || s?.content?.toLowerCase()?.includes(value.toLowerCase())) : []
}
const onDefectSelect = (e, field) => {
  let defect = store.defects.find((s) => s.id == e)
  field.data = i18n.global.locale == 'en' ? defect.content_en : defect.content
  field.defect_id = defect.id
  if (defect.types && defect.types.length > 0) {
    field.defect_types = defect.types
  }
  console.log('defect:', toRaw(defect))
  if (defect.types && defect.types.length > 0) {
    field.defect_types = defect.types
  }
}

// const exportData = () => {
//   let data = {
//     ...props.item,
//     data: {
//       ...itemData
//     }
//   }
//   console.log('export-data:', toRaw(data))
//   return data
// }


const exportValue = () => {
  console.log('export-value-data:', toRaw(itemData))
  return { data: { ...itemData } }
}


const refreshValue = (data: any) => {

}


const initialization = () => {
  itemData.conclusions = props.item?.data?.conclusions || []
  itemData.dataSchema = props.item?.data?.dataSchema || {}
  itemData.dataRecords = props.item?.data?.dataRecords || []
  itemData.fields = props.item?.data?.fields || []
  itemData.dataExtraFields = props.item?.data?.dataExtraFields || []
  if (props?.item?.data?.conclusion_key) {
    conclusionRef.value = store.report.template?.items?.find(c => c.key === props?.item?.data?.conclusion_key)
    if (props?.item?.data?.conclusion_item_key) {
      conclusionItemRef.value = conclusionRef.value?.data?.conclusions?.find(c => c.key === props?.item?.data?.conclusion_item_key)
      if (store.report?.values && [props?.item?.data?.conclusion_key]?.data?.conclusions && store.report?.values[props?.item?.data?.conclusion_key]?.data?.conclusions?.length != 0) {
        let conclusionItemValue = store.report?.values[props?.item?.data?.conclusion_key]?.data?.conclusions?.find(c => c.key === props?.item?.data?.conclusion_item_key)
        if (conclusionItemValue) {
          statusForm.status = conclusionItemValue.status || ''
          statusForm.remark = conclusionItemValue.remark || ''
        }
      }
    } else {
      conclusionItemRef.value = null
    }
  } else {
    conclusionRef.value = null
    conclusionItemRef.value = null
  }

  if (route.path.includes('/template/design')) {
    if (props?.item?.data?.conclusion_key) {
      conclusionRef.value = reportTemplateStore.reportTemplate?.items?.find(c => c.key === props?.item?.data?.conclusion_key)
      if (props?.item?.data?.conclusion_item_key) {
        conclusionItemRef.value = conclusionRef.value?.data?.conclusions?.find(c => c.key === props?.item?.data?.conclusion_item_key)
      } else {
        conclusionItemRef.value = null
      }
    } else {
      conclusionRef.value = null
      conclusionItemRef.value = null
    }
  }

  if (!props.value) {
    let sourceItems = []
    if (props.item?.data?.hasItemNumber) {
      sourceItems.push({
        label: props.item?.data?.item_number_label || 'Item No.',
        value: 'item_number',
        data: []
      },)
    }
    if (props.item?.data?.hasSampleSize) {
      sourceItems.push({
        label: props.item?.data?.sample_size_label || 'Sample Size',
        value: 'quantity',
        data: ""
      })
    }
    if (props.item?.data?.hasItemStatus) {
      sourceItems.push({
        label: props.item?.data?.inspect_result_label || 'Inspect Result',
        value: 'status',
        data: ""
      })
    }
    if (props.item?.data?.hasItemRemarks) {
      let optionItem = {
        label: props.item?.data?.remarks_label || 'Remarks',
        value: 'remark',
        data: "",
        defect_id: "",
        defect_type: "",
        defect_type_label: "",
        defect_types: [],
        defect_count_label: "",
        defect_count: ""
      }
      if (props.item?.data?.isDefect) {
        optionItem.defect_type_label = props.item?.data?.defect_type_label || 'Defect Type'
        optionItem.defect_types = []
        optionItem.defect_count_label = props.item?.data?.defect_count_label || 'Defects Count'
        optionItem.defect_count = ""
      }
      sourceItems.push(optionItem)
    }
    if (props.item?.data?.hasImages) {
      sourceItems.push({
        label: props.item?.data?.images_label || 'Images',
        value: 'images',
        data: []
      })
    }

    if (itemData?.fields && itemData?.fields.length > 0) {
      let nodes = findLeafNode(itemData?.fields)
      itemData.dataSchema = newJsonObject([...sourceItems, ...nodes])
      if (props?.item?.data?.showFieldsAtStart) {
        itemData.dataRecords = [newJsonObject(itemData.dataSchema)]
      }
    } else {
      itemData.dataSchema = newJsonObject([...sourceItems])
      if (props?.item?.data?.showFieldsAtStart) {
        itemData.dataRecords = [newJsonObject(itemData.dataSchema)]
      }
    }
  } else {
    if (props.value?.data?.dataRecords && props.value?.data?.dataRecords.length > 0) {
      itemData.dataRecords = props.value?.data?.dataRecords
      itemData.dataSchema = props.value?.data?.dataSchema
      itemData.dataExtraFields = props.value?.data?.dataExtraFields
    } else {
      if (props.value?.data?.fields && props.value?.data?.fields.length > 0) {
        let nodes = findLeafNode(props.value?.data?.fields)
        itemData.dataSchema = newJsonObject([...nodes])
        itemData.dataRecords = [newJsonObject(itemData.dataSchema)]
      } else {
        itemData.dataSchema = newJsonObject([])
        itemData.dataRecords = [newJsonObject(itemData.dataSchema)]
      }
    }
  }
}

initialization()

defineExpose({
  props,
  itemData,
  exportValue,
  // exportData,
  refreshValue,
  initialization
})

</script>

<style scoped>
.field {
  margin-bottom: 10px;
}

.label {
  font-size: 13px;
}

.record {
  padding: 20px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #f0f0f0;
  position: relative;
  margin-bottom: 20px;
}

/* .records {
  margin-bottom: 20px;
} */

.badge {
  position: absolute;
  right: 0;
  top: 0
}

.record .delete-record {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
<style>
.table-row-warning {
  background-color: rgba(255, 242, 240, 0.85) !important;
}

.custom-row:hover {
  background-color: transparent !important;
  /* 使背景颜色透明，防止更改 */
}

.table-row-warning.custom-row:hover {
  background-color: rgba(255, 242, 240, 0.85) !important;
}
</style>