<template>
  <div>
    <BaseSlot :item="props?.item">
      <a-form-item :label="props?.item?.data?.label"
        :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}`, trigger: 'change' }]">
        <div v-for="(item, index) in itemData?.conclusions" class="conclusion-item flex">
          <div class="flex-1">
            <div>{{ item.title }}</div>
            <a-tag v-if="statusColorMap[item?.status || item?.userStatus]" :color="statusColorMap[item?.status || item?.userStatus]">{{ $t(`base.${item?.status || item?.userStatus}`) }}</a-tag>
            <div v-if="item?.remark" class="item-remark">{{ item?.remark }}</div>
          </div>
          <div class="buttons w-1/4 flex justify-end">
            <div>
              <a-button @click="onClickSetConclusion(index)" type="text">
                <template #icon>
                  <EditOutlined />
                  </template> 
              </a-button>
            </div>
          </div>
        </div>
      </a-form-item>
      <!-- <div v-if="props?.item?.hasRemarks" style="margin-top:10px;">
        <a-textarea v-model:value="props.value.remark" @change="onChange" :placeholder="$t('base.PleaseEnterRemark')" />
      </div> -->
      <a-modal :getContainer="() => document.body" v-model:visible="isShowStatusDialog" :title="$t('base.AddRemark')"
        @ok="handleStatusOK">
        <a-form layout="vertical">
          <a-form-item :label="$t('base.Status')" name="status">
            <a-radio-group size="small"  v-model:value="statusForm.status" button-style="solid">
              <a-radio-button style="font-size: 12px" v-for="option in props.item?.data?.options" :value="option.value">{{
                option.label
              }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('base.Remark')" name="remark" v-if="targetSetConclusionRef?.hasRemarks">
            <a-textarea :auto-size="{ minRows: 1, maxRows: 5 }" v-model:value="statusForm.remark"></a-textarea>
          </a-form-item>
        </a-form>
      </a-modal>
    </BaseSlot>
  </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineProps, ref, PropType, reactive, toRaw } from 'vue'
import Icon, { CheckSquareOutlined, CloseCircleFilled } from '@ant-design/icons-vue';
import { MessageOutlined } from '@ant-design/icons-vue';
import { MessageOutlinedIconType } from "@ant-design/icons-vue/lib/icons/MessageOutlined";
import { getStatusLabelColor, statusColorMap } from "@/utils/helpers"
const document = window.document
const isShowStatusDialog = ref(false)

const props = defineProps({
  item: {
    type: Object,
  },
  value: {
    type: Array,
    default: []
  }
})


const targetSetConclusionRef = ref(null)
const itemData = reactive({
  parent_com_key: '',
  parent_key: '',
  languageType: 'single',
  conclusions: [],
  options: [],
  results: {}
})
const statusForm = reactive({
  status: '',
  remark: ''
})

const emits = defineEmits(["update:value", "updateParentConclusion"])


const onChange = (e) => {
  console.log('onChange:', e)
  emits('update:value', exportValue())
}

const exportData = () => {
  let data = {
    ...props.item,
    data: {
      ...itemData
    }

  }
  console.log('exportData-data:', toRaw(data))
  return data
}


const exportValue = () => {
  console.log('conclusion-exportValue-data:', toRaw(itemData))
  return { data: { ...itemData } }
}


const refreshValue = (values: any) => {
  // itemData.values = values
}

const onClickSetConclusion = (index) => {
  isShowStatusDialog.value = true
  console.log('props.value?.data?.conclusions[index]:', toRaw(props.value?.data?.conclusions[index]))
  if(props.value?.data?.conclusions[index]) {
    targetSetConclusionRef.value = props.value?.data?.conclusions[index]
  } else {
    targetSetConclusionRef.value = itemData.conclusions[index]
  }
  console.log('targetSetConclusionRef.value.status:', targetSetConclusionRef.value.status)
  statusForm.status = targetSetConclusionRef.value.status || ''
  statusForm.remark = targetSetConclusionRef.value.remark || ''
}

const handleStatusOK = () => {
  targetSetConclusionRef.value.status = statusForm.status
  targetSetConclusionRef.value.remark = statusForm.remark
  statusForm.status = ''
  statusForm.remark = ''
  emits('update:value', exportValue())
  isShowStatusDialog.value = false
}


const initialization = () => {
  itemData.parent_com_key = props.item?.data?.parent_com_key || ""
  itemData.parent_key = props.item?.data?.parent_key || ""
  itemData.languageType = props.item?.data?.languageType || "single"
  itemData.conclusions = props.item?.data?.conclusions || []
  itemData.options = props.item?.data?.options || []
  console.log('props.value11:', toRaw(props.value), toRaw(props.item?.data?.conclusions))
  if(props.value && props.value?.length !== 0) {
    itemData.parent_com_key = props.value?.data?.parent_com_key || ""
    itemData.parent_key = props.value?.data?.parent_key || ""
    itemData.languageType = props.value?.data?.languageType || "single"
    itemData.conclusions = props.value?.data?.conclusions || []
    itemData.options = props.value?.data?.options || []
    console.log('props.value1122:', toRaw(props.value?.data?.conclusions))
  }
}

initialization()
defineExpose({
  props,
  itemData,
  exportValue,
  exportData,
  refreshValue,
  initialization
})

</script>

<style scoped>
.conclusion-item {
  margin-top: 20px;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 10px;
  position: relative;
}

.conclusion-item:last-child {
  border-bottom: 0
}

.conclusion-item .item-remark {
  font-size: 12px;
  color: #999;
}

.status-conformed {
  color: green;
}
</style>