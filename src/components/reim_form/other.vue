<template>
    <BaseComponent :title="props.title" ref="baseModal">
        <template #inner>
            <a-form-item label="">
                <a-button type="primary" @click="modelVisible = true">add</a-button>
            </a-form-item>
            <div v-for="item in store.reimRecordItem.items">
                {{ item }}
            </div>
            <a-modal width="100%" wrap-class-name="full-modal" v-model:visible="modelVisible" :title="props.title"
                :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
                <a-form ref="formRef" style="max-width: 600px; margin: 0 auto;" layout="vertical">
                    <a-form-item label="amount">
                        <a-input-number v-model:value="store.reimOtherPoint.amount" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="date">
                        <a-date-picker v-model:value="store.reimOtherPoint.start_at" style="width: 100%;" />
                    </a-form-item>
                    <a-form-item label="remark">
                        <a-textarea v-model:value="store.reimOtherPoint.remark" />
                    </a-form-item>
                </a-form>
            </a-modal>

        </template>
    </BaseComponent>
</template>
<script lang="ts" setup>
import { toRaw, defineProps, ref } from "vue";
import BaseComponent from "./index.vue";
import { ReimRecordStore } from "@/store/record";
import { ossUploadFiles } from '@/store/uploader'
import RemoteSelect from '@/components/remote_select/index.vue';
import dayjs from 'dayjs';
const orderSelectRef = ref<any>(null);
const uploadFilesRef = ref<[]>()
const baseModal = ref<any>(null);
const modelVisible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const props = defineProps({
    formValues: {
        type: Object,
    },
    title: {
        type: String,
        default: ''
    }
})
const store = ReimRecordStore();

const toggleModal = (item: any) => {
    baseModal.value.toggleModal(item)
}

const handleCancel = () => {
    modelVisible.value = false
}

const handleOk = () => {
    store.reimRecordItem.items.push({ ...store.reimOtherPoint })
    confirmLoading.value = true
    setTimeout(() => {
        confirmLoading.value = false
        modelVisible.value = false
        store.resetItem('other')
    }, 2000)
}


const uploadFile = () => {
  const input = document.createElement('input');
  input.id = 'willUploadFileInput';
  input.type = 'file';
  let prefix = `reim/${dayjs().format('YYYYMMDD')}`

  // if (editThirdpartyRecord.value?.order?.company?.id) {
  //   prefix = `reim/${editThirdpartyRecord.value?.order?.company?.id}/${dayjs().format('YYYYMMDD')}`
  // } else {
  //   prefix = `reim/${dayjs().format('YYYYMMDD')}`
  // }

  input.onchange = async (e: any) => {
    const files = e.target.files;
    for (let file of files) {
      //   uploadFilesRef.value.push({ file: file, kind: kind, item: item })
      const fileSize = file.size;
      const fileSizeInMB = fileSize / (1024 * 1024);
      const fileSizeFormatted = fileSizeInMB.toFixed(2);
      console.log(fileSizeFormatted);
      let result = await ossUploadFiles(e, prefix)
      console.log('upload-result:', result)
      uploadFilesRef.value.push(result[0])
      // remove child by ID
      const willUploadFileInput = document.getElementById('willUploadFileInput');
      willUploadFileInput?.parentNode?.removeChild(willUploadFileInput);
    }
  };
  input.click();
}


defineExpose({ toggleModal })
</script>