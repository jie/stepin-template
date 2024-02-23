<template>
  <div>
    <div> edit {{ itemData?.title }}</div>
    <div>
      <BaseForm ref="baseForm" />
    </div>
    <div>
      <a-form  name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-form-item label="Full Width" name="full width">
          <a-switch v-model:checked="imageItemSettings.isFullWidth" />
        </a-form-item>
        <a-form-item label="Width" name="width" v-if="!imageItemSettings.isFullWidth">
          <a-input-number v-model:value="imageItemSettings.width" />
        </a-form-item>
        <a-form-item label="Columns" name="columns">
          <a-input-number v-model:value="imageItemSettings.columns" />
        </a-form-item>
        <a-form-item label="Images" name="images" v-if="fileList && fileList.length != 0">
          <!-- <a-image-preview-group>
            <a-image :width="240" :src="item.url" v-for="item in fileList" style="padding: 10px;" />
          </a-image-preview-group> -->
          <img alt="example" style="width: 200px; height: 200px;" :src="item.url" v-for="item in fileList"/>
        </a-form-item>
        <a-form-item label="Upload" name="uploader">
          <a-upload v-model:file-list="fileList" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type="picture-card" @preview="handlePreview" :show-upload-list="false" :accept="itemData?.data?.accept" @change="handleChange">
            <div v-if="fileList.length < 8">
              <plus-outlined />
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
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
const imageItemSettings = ref({})
const fileList = ref<UploadProps['fileList']>([

]);
const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
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
      images: fileList.value.map(c=>{return {url: c.url}})
    }
  
  }
}

const handleChange = async ({ file, fileList }: UploadChangeParam) => {
  if (file.status !== 'uploading') {
    console.log(file, fileList);
    for(let item of fileList) {
      item.url = "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    }
  }
};

defineExpose({
  initializeData,
  exportData
})
</script>