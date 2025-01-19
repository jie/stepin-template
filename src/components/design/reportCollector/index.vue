<template>
  <div>
    <BaseSlot :item="props?.item">
      <a-form-item :label="props?.item?.data?.label"
        :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}`, trigger: 'change' }]">
        <div>
          <div class="records">
            <a-badge-ribbon placement="start" :text="index + 1" :color="getStatusLabelColor(record)" v-for="(record, index) in dataRecords">
              <div class="record">
                <div class="record-fields" v-for="field in record">
                  <div class="field" v-if="field.value == 'item_number'">
                    <div class="label">
                      {{ field.label }}
                    </div>
                    <div>
                      <a-textarea v-model:value="field.data" />
                    </div>
                  </div>
                  <div class="field" v-else-if="field.value == 'item_count'">
                    <div class="label">
                      {{ field.label }}
                    </div>
                    <div>
                      <a-textarea v-model:value="field.data" />
                    </div>
                  </div>
                  <div class="field" v-else-if="field.value == 'status'">
                    <div class="label">
                      {{ field.label }}
                    </div>
                    <div>
                      <a-select v-model:value="field.data" style="width: 100%">
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
                      <a-textarea v-model:value="field.data" />
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
                            <plus-outlined />
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
                      <a-textarea v-model:value="field.data" />
                    </div>
                  </div>
                </div>
                <div>
                  <a-button type="danger" @click="onClickDeleteRecord(index)">{{ $t('base.Delete') }}</a-button>
                </div>
              </div>
            </a-badge-ribbon>
          </div>
          <div>
            <a-button type="primary" @click="onClickAdd">{{ $t('base.Add') }}</a-button>
          </div>
        </div>
      </a-form-item>
      <div v-if="props?.item?.hasRemark" style="margin-top:10px;">
        <a-textarea v-model:value="props.value.remark" @change="onChange" :placeholder="$t('base.PleaseEnterRemark')" />
      </div>
      <input type="file" ref="fileBtnRef" style="display: none" @change="onUploadInputChange"
        :accept="props?.item?.data?.accept" :multiple="targetEditImageRef === null" />
      <a-modal :getContainer="() => document.body" v-model:visible="isShowRemarkDialog" :title="$t('base.AddRemark')"
        @ok="handleRemarkOK">
        <a-form layout="vertical">
          <a-form-item :label="$t('base.Remark')" name="remark">
            <a-textarea v-model:value="imageRemarkRef"></a-textarea>
          </a-form-item>
        </a-form>
      </a-modal>
    </BaseSlot>
  </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { ReportTemplateStore } from "@/store/reportTemplate"
import { defineProps, ref, PropType, reactive, toRaw, watch } from 'vue'
import Icon, { CheckSquareOutlined, CloseCircleFilled, EditOutlined } from '@ant-design/icons-vue';
import { MessageOutlined } from '@ant-design/icons-vue';
import { MessageOutlinedIconType } from "@ant-design/icons-vue/lib/icons/MessageOutlined";
import { findLeafNode, newJsonObject } from '@/utils/helpers'
import { ossUploadFiles } from "@/store/uploader"
import { Modal } from "ant-design-vue";
import { i18n } from "@/lang/i18n";
import { h } from "vue";
const document = window.document
const reportTemplateStore = ReportTemplateStore()
const dataSchema = ref([])
const dataRecords = ref([])
const conclusionRef = ref(null)
const conclusionItemRef = ref(null)
const targetEditImageRef = ref(null)
const fileBtnRef = ref(null);
const currentUploadField = ref(null)
const isShowRemarkDialog = ref(false)
const imageRemarkRef = ref('')
const props = defineProps({
  item: {
    type: Object,
  },
  value: {
    type: Array,
    default: []
  }
})

watch(() => props.item, (value) => {
  refreshValue(value)
}, { deep: true })

const emits = defineEmits(["update:value"])

const itemData = ref({
  parent_com_key: '',
  parent_key: '',
  languageType: 'single',
  conclusions: []
})

const onChange = (e) => {
  console.log('onChange:', e)
  emits('update:value', exportValue())
}


const onClickAdd = () => {
  dataRecords.value.push(newJsonObject(dataSchema.value))
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
  for(let field of fields) {
    if(field.value === 'status') {
      if(field.data == "conformed") {
        status = "green"
      } else if(field.data == "non_conformed") {
        status = "volcano"
      } else if(field.data == "not_applicable") {
        status = "red"
      } else if(field.data == "pending") {
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


const onClickDeleteRecord = (index:number) => {
  Modal.confirm({
    title: i18n.global.t('base.Delete'),
    content: i18n.global.t('base.Delete'),
    zIndex: 1001,
    onOk() {
      dataRecords.value.splice(index, 1)
    },
    onCancel() {
    },
  });
}
const exportData = () => {
  let data = {
    ...props.item,
    data: {
      ...itemData.value
    }
  }
  console.log('exportData-data:', toRaw(data))
  return data
}


const exportValue = () => {
  console.log('exportValue-data:', toRaw(itemData.value))
  return { ...itemData.value }
}


const refreshValue = (data: any) => {
  console.log('refreshValue-data:', toRaw(data))
  itemData.value = data
  let sourceItems = []
  if (itemData.value?.data?.conclusion_key) {
    conclusionRef.value = reportTemplateStore.reportTemplate.items.find(c => c.key === itemData.value?.data?.conclusion_key)
    if (itemData.value?.data?.conclusion_item_key) {
      conclusionItemRef.value = conclusionRef.value?.data?.conclusions.find(c => c.key === itemData.value?.data?.conclusion_item_key)
    } else {
      conclusionItemRef.value = null
    }
  } else {
    conclusionRef.value = null
    conclusionItemRef.value = null
  }
  console.log('conclusionItemRef.value:', toRaw(conclusionItemRef.value))

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
  if (itemData.value?.data?.fields && itemData.value?.data?.fields.length > 0) {
    let nodes = findLeafNode(itemData.value?.data?.fields)
    dataSchema.value = newJsonObject([...sourceItems, ...nodes])
    dataRecords.value = [newJsonObject(dataSchema.value)]
    console.log('dataSchema:', toRaw(dataSchema.value), ', dataRecords:', toRaw(dataRecords.value))
  }
}


defineExpose({
  props,
  itemData,
  exportValue,
  exportData,
  refreshValue
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
</style>