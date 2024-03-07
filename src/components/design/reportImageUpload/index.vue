<template>
  <div class="clearfix">

    <BaseSlot :item="props?.item">
      <div>
        <a-button type="primary" @click="onClickTriggerButton">
          <template #icon>
            <plus-outlined />
          </template>
          Upload
        </a-button>
      </div>
      <div class="flex" style="flex-wrap: wrap;margin-top: 20px;">

        <div v-for="item in props.value" style="width: 50%; margin-bottom: 20px;" ref="boxRef">
          <a-image :src="item.url" style=" width: 300px; height: 300px;border: 1px solid #000;" />
          <div class="flex" style="height: 60px;padding-top: 10px;">
            <div style="flex: 1">
              <a-textarea style="width: 100%;" v-model:value="item.desc"
                placeholder="Please enter description"></a-textarea>
            </div>
            <div style="width:60px; height: 100%;display: flex;justify-content: center;align-items: center;">
              <a-popconfirm :getPopupContainer="triggerNode => {return triggerNode.parentNode||document.body;}" @confirm="deleteImage(item)" title="Confirm delete?" ok-text="Yes" cancel-text="No">
                <a-button shape="circle">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>
      </div>
      <input type="file" ref="fileBtnRef" style="display: none" @change="onUploadInputChange"
        :accept="props?.item?.data?.accept" multiple />
    </BaseSlot>

  </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { PlusOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { getBase64 } from "@/utils/file"
import type { UploadProps } from 'ant-design-vue';
import { ossUploadFiles } from "@/store/uploader"
import { ImageType } from "@/types/components/image"
const props = defineProps({
  item: {
    type: Object,
  },
  value: {
    type: Array,
    default: []
  }
});

const fileBtnRef = ref(null);
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const emits = defineEmits(["update:value"])

const onClickTriggerButton = async () => {
  // let targetElement = document.getElementById('btn_result_file')
  // if (targetElement != null && targetElement.value) {
  //   targetElement.value = ''
  // }
  fileBtnRef.value.click()
}


const onUploadInputChange = async (e: Event) => {
  let filelist = [...props.value]
  let images = await ossUploadFiles(e)
  console.log('images:', images)
  for (let item of images) {
    filelist.push({
      name: "",
      url: item,
      status: "done",
      uid: item,
      desc: ""
    })
  }
  emits('update:value', filelist)
}


const fileList = ref(<ImageType>[]);

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};

const exportData = () => {
  return {
    ...props.item,
    data: {
      images: fileList
    }
  }
}

const exportValue = () => {
  return { "images": fileList.value }
}

const deleteImage = (image: ImageType) => {
  fileList.value = fileList.value.filter(item => item.url !== image.url)
}

const refreshValue = (data: any) => {
  fileList.value = data.images
}

defineExpose({
  props,
  exportValue,
  exportData,
  refreshValue
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