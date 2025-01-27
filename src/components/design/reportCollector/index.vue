<template>
  <div>
    <BaseSlot :item="props?.item">
      <a-form-item :label="props?.item?.data?.label"
        :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}`, trigger: 'change' }]">
        <div>
          <div class="records">
            <a-badge-ribbon placement="start" :text="index + 1" :color="getStatusLabelColor(record)"
              v-for="(record, index) in itemData.dataRecords">
              <div class="record">
                <div class="record-fields" v-for="field in record">
                  <div class="field" v-if="field.value == 'item_number'">
                    <div class="label">
                      {{ field.label }}
                    </div>
                    <div>
                      <a-textarea :auto-size="{ minRows: 1, maxRows: 5 }" v-model:value="field.data" />
                    </div>
                  </div>
                  <div class="field" v-else-if="field.value == 'item_count'">
                    <div class="label">
                      {{ field.label }}
                    </div>
                    <div>
                      <a-textarea :auto-size="{ minRows: 1, maxRows: 5 }" v-model:value="field.data" />
                    </div>
                  </div>
                  <div class="field" v-else-if="field.value == 'status'">
                    <div class="label">
                      {{ field.label }}
                    </div>
                    <div>
                      <a-select v-model:value="field.data" style="width: 100%"
                        :getPopupContainer="triggerNode => triggerNode.parentNode">
                        <a-select-option v-for="option in conclusionRef?.data?.options" :key="option.value"
                          :value="option.value">
                          {{ option.label }}
                        </a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="field" v-else-if="field.value == 'remark'">
                    <div class="label">
                      {{ field.label }}
                    </div>
                    <div>
                      <a-auto-complete :getPopupContainer="triggerNode => triggerNode.parentNode" v-if="remarkIsDefect"
                        v-model:value="field.data" style="width: 100%" :options="defectOptions"
                        @search="handleSearchDefect" allowClear>
                        <template #option="{ content_en: content_en, id: id }">
                          <div style="display:flex" @click="onDefectSelect(id, field)">
                            <span style="flex: 1">{{ content_en }}</span>
                            <span style="font-weight: bold; width: 150px;">{{ content_en }}</span>
                          </div>
                        </template>
                        <a-textarea :auto-size="{ minRows: 1, maxRows: 5 }"
                          :placeholder="$t('base.pleaseEnterDefectKeywords')" />
                      </a-auto-complete>
                      <a-input v-model:value="field.data" allowClear v-else></a-input>
                    </div>
                  </div>
                  <div class="field" v-else-if="field.value == 'images'">
                    <div class="label">
                      {{ field.label }}
                    </div>
                    <div>
                      <div>
                        <a-row type="flex" :gutter="[16, 16]">
                          <a-col v-for="item in field.data" :key="item.url" :span="8">
                            <div style="width: 100%; aspect-ratio: 1 / 1;">
                              <a-image :src="item.url"
                                style="width: 100%; aspect-ratio: 1 / 0.6; object-fit: cover; " />
                              <div v-if="item.desc" style="font-size: 12px">{{ item.desc }}</div>
                              <div class="flex pt-2" style="justify-content: space-around;">
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
                      <div>
                        <a-button size="small" type="primary" @click="onClickUpload(field)" style="font-size: 80%">
                          <template #icon>
                            <camera-outlined />
                          </template>
                          {{ $t('base.Upload') }}
                        </a-button>
                      </div>
                    </div>
                  </div>
                  <div class="field" v-else>
                    <div class="label">
                      {{ field.label }}
                    </div>
                    <div>
                      <a-textarea :auto-size="{ minRows: 1, maxRows: 5 }" v-model:value="field.data" />
                    </div>
                  </div>
                </div>
                <div class="delete-record">
                  <a-button size="small" style="font-size: 80%;" type="text" @click="onClickDeleteRecord(index)"
                    v-if="index > 0">
                    <template #icon>
                      <delete-outlined />
                    </template>
                  </a-button>
                </div>
              </div>
            </a-badge-ribbon>
          </div>
          <div>
            <a-button type="primary" size="small" style="font-size: 80%; margin-right: 10px;"
              @click="onClickAdd"><template #icon>
                <plus-circle-outlined />
              </template>{{ $t('base.AddRecord') }}</a-button>
            <a-button type="default" size="small" style="font-size: 80%" @click="onClickAddField">
              <template #icon>
                <tags-outlined />
              </template>{{ $t('base.FieldManagement') }}
            </a-button>
          </div>
        </div>
      </a-form-item>
      <div v-if="props?.item?.hasRemark" style="margin-top:10px;">
        <a-textarea :auto-size="{ minRows: 1, maxRows: 5 }" v-model:value="props.value.remark" @change="onChange"
          :placeholder="$t('base.PleaseEnterRemark')" />
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
import { defineProps, ref, PropType, reactive, toRaw, watch, defineEmits } from 'vue'
import Icon, { CheckSquareOutlined, CloseCircleFilled, EditOutlined } from '@ant-design/icons-vue';
import { MessageOutlined } from '@ant-design/icons-vue';
import { MessageOutlinedIconType } from "@ant-design/icons-vue/lib/icons/MessageOutlined";
import { findLeafNode, newJsonObject } from '@/utils/helpers'
import { ossUploadFiles } from "@/store/uploader"
import { message, Modal } from "ant-design-vue";
import { i18n } from "@/lang/i18n";
import { ReportFillStore } from "@/store/report_fill"
import { useRoute } from 'vue-router'
import { dataTool } from "echarts";
const document = window.document
const route = useRoute()
const reportTemplateStore = ReportTemplateStore()
const defectOptions = ref([])
// const dataSchema = ref([])
// const dataRecords = ref([])
const conclusionRef = ref(null)
const conclusionItemRef = ref(null)
const targetEditImageRef = ref(null)
const fileBtnRef = ref(null);
const currentUploadField = ref(null)
const isShowRemarkDialog = ref(false)
const isShowAddFieldDialog = ref(false)
const imageRemarkRef = ref('')
const remarkIsDefect = ref(false)
const store = ReportFillStore()
store.apiQueryDefectByReportId()
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
  fields: []
})

const fieldForm = reactive({
  label: '',
  value: '',
})
// watch(() => props.item, (value) => {
//   console.log('watch.item:', toRaw(value))
// }, { deep: true })


watch(() => itemData, (value) => {
  store.formState[props.item.key] = exportValue()
}, { deep: true })

// watch(() => props.value, (value) => {
//   console.log('watch.value:', toRaw(value), toRaw(itemData))
//   itemData.dataRecords = value.dataRecords
//   updateItemDataByValue(value)
// }, { deep: true })


const updateItemDataByValue = (value) => {
  console.log('updateItemDataByValue:', toRaw(value.dataRecords), toRaw(value.dataSchema))
  if (value.dataRecords && value.dataRecords.length > 0) {
    itemData.dataRecords = value.dataRecords
  } else if (value.dataSchema && value.dataSchema.length > 0) {
    itemData.dataSchema = value.dataSchema
    itemData.dataRecords = [newJsonObject(value.dataSchema)]
  }
}

const onChange = (e) => {
  console.log('onChange:', e)
  emits('update:value', exportValue())
}


const onClickAdd = () => {
  itemData.dataRecords.push(newJsonObject(itemData.dataSchema))
}


const onClickUpload = (field: any) => {
  currentUploadField.value = field
  targetEditImageRef.value = null
  setTimeout(() => {
    fileBtnRef.value.click()
  }, 500)
}

const getStatusLabelColor = (fields: any) => {
  let status = "cyan"
  for (let field of fields) {
    if (field.value === 'status') {
      if (field.data == "conformed") {
        status = "green"
      } else if (field.data == "non_conformed") {
        status = "volcano"
      } else if (field.data == "not_applicable") {
        status = "red"
      } else if (field.data == "pending") {
        status = "purple"
      }
    }
  }
  return status
}


const onUploadInputChange = async (e: Event) => {
  let images = await ossUploadFiles(e)
  console.log('images:', images, ', targetEditImageRef.value:', targetEditImageRef.value)
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
    zIndex: 1001,
    onOk() {
      field.data = field.data.filter(i => i.url !== item.url)
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
}


const onClickDeleteRecord = (index: number) => {
  Modal.confirm({
    title: i18n.global.t('base.Delete'),
    content: i18n.global.t('base.Delete'),
    zIndex: 1001,
    getContainer: "triggerNode => triggerNode.parentNode",
    onOk() {
      itemData.dataRecords.splice(index, 1)
    },
    onCancel() {
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
    } else {
      message.error('Field already exists')
    }
  }
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
  defectOptions.value = value ? store.defects.filter((s) => s.content_en.toLowerCase().includes(value.toLowerCase())) : []
}
const onDefectSelect = (e, field) => {
  let defect = store.defects.find((s) => s.id == e)
  field.data = defect.content_en
  field.defect_id = defect.id
  if (defect.types && defect.types.length > 0) {
    field.defect_types = defect.types
  }
}

const emits = defineEmits(["update:value"])


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
  console.log('refresh-value-data:', toRaw(data))
  if (!data) {
    console.log('refresh-value-data2:', toRaw(props.item))
    itemData.conclusions = props.item?.data?.conclusions || []
    itemData.dataSchema = props.item?.data?.dataSchema || {}
    itemData.dataRecords = props.item?.data?.dataRecords || []
    itemData.dataExtraFields = props.item?.data?.dataExtraFields || []
    itemData.fields = props.item?.data?.fields || []
  } else {
    itemData.conclusions = data.conclusions || []
    itemData.dataSchema = data.dataSchema || {}
    itemData.dataRecords = data.dataRecords || []
    itemData.dataExtraFields = data.dataExtraFields || []
    itemData.fields = data.fields || []
  }

  console.log('refresh:', toRaw(data))
  if (!itemData.dataExtraFields) {
    itemData.dataExtraFields = []
  }
  let sourceItems = []
  if (route.path.includes('template/design'))
    if (itemData?.data?.conclusion_key) {
      conclusionRef.value = reportTemplateStore?.reportTemplate?.items?.find(c => c.key === itemData?.data?.conclusion_key)
      if (itemData?.data?.conclusion_item_key) {
        conclusionItemRef.value = conclusionRef.value?.data?.conclusions.find(c => c.key === itemData?.data?.conclusion_item_key)
      } else {
        conclusionItemRef.value = null
      }
    } else {
      conclusionRef.value = null
      conclusionItemRef.value = null
    }
  else {
    if (itemData?.data?.conclusion_key) {
      conclusionRef.value = store.report.template?.items?.find(c => c.key === itemData?.data?.conclusion_key)
      if (itemData?.data?.conclusion_item_key) {
        conclusionItemRef.value = conclusionRef.value?.data?.conclusions?.find(c => c.key === itemData?.data?.conclusion_item_key)
      } else {
        conclusionItemRef.value = null
      }
    } else {
      conclusionRef.value = null
      conclusionItemRef.value = null
    }
  }

  if (conclusionItemRef.value && conclusionItemRef.value?.hasStatus) {
    sourceItems.push({
      label: 'Status',
      value: 'status',
      data: ""
    })
  }
  if (conclusionItemRef.value && conclusionItemRef.value?.hasRemarks) {
    sourceItems.push({
      label: 'Remark',
      value: 'remark',
      data: ""
    })
  }
  if (conclusionItemRef.value && conclusionItemRef.value?.hasImages) {
    sourceItems.push({
      label: 'Images',
      value: 'images',
      data: []
    })
  }
  if (conclusionItemRef.value && conclusionItemRef.value?.IsDefect) {
    remarkIsDefect.value = true
  }
  if (data) {
    if (data?.data?.dataRecords && data?.data?.dataRecords.length > 0) {
      itemData.dataRecords = data?.data?.dataRecords
      itemData.dataSchema = data?.data?.dataSchema
      itemData.dataExtraFields = data?.data?.dataExtraFields
    } else {
      if (data?.data?.fields && data?.data?.fields.length > 0) {
        let nodes = findLeafNode(data?.data?.fields)
        itemData.dataSchema = newJsonObject([...sourceItems, ...nodes])
        itemData.dataRecords = [newJsonObject(itemData.dataSchema)]
      } else {
        itemData.dataSchema = newJsonObject([...sourceItems])
        itemData.dataRecords = [newJsonObject(itemData.dataSchema)]
      }
    }
  } else {
    if (itemData?.fields && itemData?.fields.length > 0) {
        let nodes = findLeafNode(itemData?.fields)
        itemData.dataSchema = newJsonObject([...sourceItems, ...nodes])
        itemData.dataRecords = [newJsonObject(itemData.dataSchema)]
      } else {
        itemData.dataSchema = newJsonObject([...sourceItems])
        itemData.dataRecords = [newJsonObject(itemData.dataSchema)]
      }
  }

}

const initialization = () => {
  if (store.formState[props.item.key] === null) {
    refreshValue(props.item)
  } else {
    refreshValue(store.formState[props.item.key])
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