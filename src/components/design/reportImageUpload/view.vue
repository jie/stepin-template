<template>
    <div class="clearfix">
  
      <BaseSlot :item="props?.item">
        <div>
          <a-row type="flex" v-for="items in computedItems" :gutter="[16,16]"  style="margin-bottom: 20px;">
            <a-col flex="1" v-for="item in items">
              <div style="margin-bottom: 5px;">
                <a-image :src="item.url" height="200px" width="100%"
                  style="border: 1px solid #ccc; border-radius: 5px; object-fit: contain;" />
              </div>
              <a-row type="flex" :gutter="[16,16]">
                <a-col flex="auto">
                  {{ item.desc }}
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </BaseSlot>
  
    </div>
  </template>
  <script lang="ts" setup>
  import BaseSlot from "../base_slot.vue"
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { ref, computed } from 'vue';
  import { groupArray } from "@/utils/objectUtils"
  import { getBase64 } from "@/utils/file"
  import type { UploadProps } from 'ant-design-vue';
  import { ossUploadFiles } from "@/store/uploader"
  import { ImageType } from "@/types/components/image"
  import { ReportFillStore } from "@/store/report_fill"
  const store = ReportFillStore()
  const props = defineProps({
    item: {
      type: Object,
    },
    value: {
      type: Array,
      default: []
    }
  });
  
  const computedItems = computed(() => {
    return groupArray(props.value, 2)
  })
  
  const fileBtnRef = ref(null);
  const previewVisible = ref(false);
  const previewImage = ref('');
  const previewTitle = ref('');
  const emits = defineEmits(["update:value"])
  
  const defectOptions = ref([])
  const handleSearchDefect = (value) => {
    defectOptions.value = value ? store.defects.filter((s) => s.content_en.toLowerCase().includes(value.toLowerCase())) : []
  }
  const onDefectSelect = (i, e) => {
    i.desc = store.defects.find((s) => s.id == e).content_en
  }
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