<template>
  <div class="clearfix">

    <BaseSlot :item="props?.item">
      <div>
        <a-image-preview-group>
          <a-image :width="240" :src="item.url" v-for="item in fileList" style="padding: 10px;" />
        </a-image-preview-group>
      </div>
      <a-upload v-model:file-list="fileList" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        list-type="picture-card" @preview="handlePreview" :show-upload-list="false" :accept="props?.item?.data?.accept">
        <div v-if="fileList.length < 8">
          <plus-outlined />
          <div style="margin-top: 8px">Upload</div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </BaseSlot>

  </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import {getBase64} from "@/utils/file"
import type { UploadProps } from 'ant-design-vue';

const props = defineProps({
  item: {
    type: Object,
  },
});


const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const fileList = ref<UploadProps['fileList']>([
  // {
  //   uid: '-1',
  //   name: 'image.png',
  //   status: 'done',
  //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // },
  // {
  //   uid: '-2',
  //   name: 'image.png',
  //   status: 'done',
  //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // },
  // {
  //   uid: '-3',
  //   name: 'image.png',
  //   status: 'done',
  //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // },
  // {
  //   uid: '-4',
  //   name: 'image.png',
  //   status: 'done',
  //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // },
  // {
  //   uid: '-xxx',
  //   percent: 50,
  //   name: 'image.png',
  //   status: 'uploading',
  //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // },
  // {
  //   uid: '-5',
  //   name: 'image.png',
  //   status: 'error',
  // },
]);

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const exportData = () => {
  return props.item
}

defineExpose({
  props,
  exportData
})

</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>