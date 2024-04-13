<template>
  <div>
    <div> edit {{ itemData?.title }}</div>
    <div>
      <BaseForm ref="baseForm" />
    </div>
    <div>
      <a-form name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-form-item :label="$t('base.FullWidth')" name="full width">
          <a-switch v-model:checked="imageItemSettings.isFullWidth" />
        </a-form-item>
        <a-form-item :label="$t('base.Width')" name="width" v-if="!imageItemSettings.isFullWidth">
          <a-input-number v-model:value="imageItemSettings.width" />
        </a-form-item>
        <a-form-item :label="$t('base.Column')" name="columns">
          <a-input-number v-model:value="imageItemSettings.columns" />
        </a-form-item>
        <a-form-item :label="$t('base.Image')" name="images" v-if="fileList && fileList.length != 0">
          <div class="flex">
            <div v-for="item in fileList">
              <div style="height: 200px;display: flex; justify-content: center;align-items: center;border:1px solid #f9f9f9;">
                <a-image style="width: 200px;" :src="item.url" />
              </div>
              <div style="text-align:center; padding-top: 10px;">
                <a-button type="primary" @click="onClickTriggerButton(item.url)">
                  <template #icon>
                    <edit-outlined />
                  </template>
                </a-button>
                <a-button style="margin-left: 10px;" type="danger" @click="onClickDeleteButton(item.url)">
                  <template #icon>
                    <delete-outlined />
                  </template>
                </a-button>
              </div>

            </div>
          </div>

        </a-form-item>
        <a-form-item :label="$t('base.Upload')" name="uploader">
          <a-button type="primary" @click="onClickTriggerButton('')">
            <template #icon>
              <plus-outlined />
            </template>
            {{ $t('base.Upload') }}
          </a-button>
          <input type="file" ref="fileBtnRef" style="display: none" @change="onUploadInputChange" accept="image/*"
            multiple />
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import BaseForm from "../base_editor.vue"
import type { UploadProps, UploadChangeParam } from 'ant-design-vue';
import { ReportTemplateStore } from "@/store/reportTemplate"
import { getBase64 } from "@/utils/file"
import { ossUploadFiles } from "@/store/uploader"
import { ImageType } from "@/types/components/image"
import { toRaw } from "vue";
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const reportTemplateStore = ReportTemplateStore()
const props = defineProps({
  item: {
    type: Object,
  }
})

const baseForm = ref(null)
const itemData = ref({})
const currentItemUrl = ref("")
const imageItemSettings = ref({})
const fileBtnRef = ref(null);
// const fileList = ref<UploadProps['fileList']>([]);
const fileList = ref(<ImageType>[]);
const initializeData = (item: any) => {
  console.log('initializeData')
  itemData.value = item
  baseForm.value.initializeData(item)
  imageItemSettings.value.width = item.data.width
  imageItemSettings.value.columns = item.data.columns
  imageItemSettings.value.isFullWidth = item.data.isFullWidth
  fileList.value = item.data.images
}
const exportData = (item: any) => {
  let _data = baseForm.value.exportData(item)
  return {
    ..._data,
    data: {
      width: imageItemSettings.value.width,
      columns: imageItemSettings.value.columns,
      isFullWidth: imageItemSettings.value.isFullWidth,
      images: fileList.value.map(c => { return { url: c.url } })
    }

  }
}

const onClickTriggerButton = async (url: string) => {
  currentItemUrl.value = url
  fileBtnRef.value.click()
}


const onUploadInputChange = async (e: Event) => {
  let images = await ossUploadFiles(e)
  console.log('currentItemUrl.value:', toRaw(currentItemUrl.value))
  if (currentItemUrl.value) {
    for(let item of fileList.value){
      if(item.url == currentItemUrl.value){
        item.url = images[0]
        break
      }
    }
  } else {
    for (let item of images) {
      fileList.value.push({
        name: "",
        url: item,
        status: "done",
        uid: item,
        desc: ""
      })
    }
  }
}


const onClickDeleteButton = (url: string) => {
  fileList.value = fileList.value.filter(c => c.url != url)
}


defineExpose({
  initializeData,
  exportData
})
</script>