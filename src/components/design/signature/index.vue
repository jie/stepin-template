<template>
    <div class="clearfix" style="position: relative;">
      <BaseSlot :item="props?.item">
        <div>
          <a-row type="flex" v-for="(items, index) in computedItems" :gutter="[16, 16]" style="margin-bottom: 20px">
            <a-col flex="1" v-for="(item, sIndex) in items">
              <div v-if="item?.url">
                <div style="margin-bottom: 10px">
                  <a-image :src="item.url" height="200px" width="100%"
                    style="border: 1px solid #ccc; border-radius: 5px; object-fit: contain;" />
                </div>
                <a-row type="flex" :gutter="[16, 16]">
                  <a-col flex="auto">
                    <a-auto-complete :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="item.desc"
                      v-if="props.item?.is_defect" style="width: 100%" :options="defectOptions"
                      @search="handleSearchDefect" allowClear @blur="onBlur">
                      <a-textarea style="width: 100%;" :data-url="item.url" @drop.prevent="onDropImage" />
                      <template
                        #option="{ content_en: content_en, id: id, content: content, types: types, product: product, product_en: product_en }">
                        <div @click="onDefectSelect(item, id)">
                          <div style="margin-bottom: 2px"><a-tag v-for="tag in types">{{ tag }}</a-tag></div>
                          <div>{{ product }}: {{ content }}</div>
                          <div>{{ product_en }}: {{ content_en }}</div>
                        </div>
                      </template>
                    </a-auto-complete>
                    <a-textarea style="width: 100%;" :data-url="item.url" v-model:value="item.desc" v-else
                      @drop.prevent="onDropImage" @blur="onBlur" />
                  </a-col>
                  <a-col flex="160px">
                    <!-- <a-popconfirm :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body }"
                      @confirm="deleteImage(item)" :title="$t('base.ConfirmDelete')" :ok-text="$t('base.Yes')"
                      :cancel-text="$t('base.No')">
                      <a-button shape="circle" style="margin-top: 10px;">
                        <template #icon>
                          <DeleteOutlined />
                        </template>
                      </a-button>
                    </a-popconfirm> -->
                    <div class="flex" style="justify-content: space-around;">
                      <div style="margin-top: 10px"><a-checkbox v-model:checked="item.checked"></a-checkbox> ({{ showImageIndex(item.url)
                        }})</div>
                      <a-button shape="circle" style="margin-top: 10px;" @click="onClickDeleteImage(item)">
                        <template #icon>
                          <DeleteOutlined />
                        </template>
                      </a-button>
                      <a-button shape="circle" style="margin-top: 10px;" @click="onClickEditImage(item)">
                        <template #icon>
                          <EditOutlined />
                        </template>
                      </a-button>
                    </div>
  
                  </a-col>
                </a-row>
              </div>
              <div v-else></div>
            </a-col>
          </a-row>
        </div>
        <div style="margin-top: 10px;">
          <a-button type="primary" size="small" @click="onClickTriggerButton" style="font-size: 80%;">
            <template #icon>
              <plus-circle-outlined />
            </template>
            {{ $t('base.Upload') }}
          </a-button>
          <a-button size="small" style="font-size: 80%; margin-left: 10px;" v-if="hasOrderedItems(props?.value)"
            @click="showOrderItemsDialog()">
            <template #icon>
              <OrderedListOutlined />
            </template>
            Ordered
          </a-button>
        </div>
        <input type="file" ref="fileBtnRef" style="display: none" @change="onUploadInputChange"
          :accept="props?.item?.data?.accept" :multiple="targetEditImageRef === null" />
      </BaseSlot>
      <a-modal @ok="confirmDeleteImage" :ok-text="$t('base.Yes')" :getContainer="() => documentRef.body"
        v-model:visible="showDeleteImageRef" :cancel-text="$t('base.No')">
        <div>{{ $t('base.ConfirmDelete') }}</div>
      </a-modal>
      <a-modal :getContainer="() => documentRef.body" v-model:visible="isShowOrderedDialog" :title="$t('base.OrderedItems')"
        @ok="handleConfirmOrderedItems">
        <a-form layout="vertical">
          <a-form-item :label="$t('base.WillInsertImageTo')" name="targetIndex">
            <a-input-number v-model:value="orderedTargetIndexRef" :min="1"></a-input-number>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </template>
  <script lang="ts" setup>
  import BaseSlot from "../base_slot.vue"
  import { EditOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { ref, computed } from 'vue';
  import { groupArrayWithPatch } from "@/utils/objectUtils"
  import { message, Modal } from "ant-design-vue";
  import { ossUploadFiles } from "@/store/uploader"
  import { ImageType } from "@/types/components/image"
  import { ReportFillStore } from "@/store/report_fill"
  import { toRaw } from "vue";
  import { i18n } from "@/lang/i18n";
  const store = ReportFillStore()
  const documentRef = document
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
    return groupArrayWithPatch(props.value, 2)
  })
  
  const orderedTargetIndexRef = ref(null)
  const isShowOrderedDialog = ref(false)
  
  
  const hasOrderedItems = (images: any) => {
    return images?.some((item: any) => item?.checked)
  }
  
  const showOrderItemsDialog = () => {
    isShowOrderedDialog.value = true
  }
  
  const showImageIndex = (url: string) => {
    let index = props.value.findIndex((item: any) => item.url === url)
    return index + 1
  }
  
  const handleConfirmOrderedItems = () => {
    let items = [...props.value]
    let orderedImages = items.filter((item: any) => item.checked)
    // move orderImages to orderedTargetIndexRef
    let targetIndex = orderedTargetIndexRef.value
    if (targetIndex === null) {
      // message.error('Invalid target index')
      return
    }
  
    // insert orderedImages to targetIndex
    let images = items.filter((item: any) => !item.checked)
    images.splice(targetIndex, 0, ...orderedImages)
    images.forEach((item: any, index: number) => {
      item.checked = false
    })
  
    emits('update:value', images)
    autoSave(images)
    orderedTargetIndexRef.value = null
    isShowOrderedDialog.value = false
  }
  
  
  
  const fileBtnRef = ref(null);
  const previewVisible = ref(false);
  const previewImage = ref('');
  const previewTitle = ref('');
  const targetDeleteImageRef = ref(null);
  const showDeleteImageRef = ref(false);
  
  const targetEditImageRef = ref(null);
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
    targetEditImageRef.value = null
    setTimeout(() => {
      fileBtnRef.value.click()
    }, 500)
  
  }
  
  const onClickDeleteImage = (image: any) => {
    targetDeleteImageRef.value = image
    showDeleteImageRef.value = true
  }
  const onClickEditImage = (image: any) => {
    targetEditImageRef.value = image
    setTimeout(() => {
      fileBtnRef.value.click()
    }, 500)
  }
  
  const onUploadInputChange = async (e: Event) => {
    if(!e?.target?.files || e?.target?.files.length === 0) {
      return
    }
    let filelist = [...props.value]
    let images = await ossUploadFiles(e)
    console.log('images:', images, ', targetEditImageRef.value:', targetEditImageRef.value)
    if (targetEditImageRef.value !== null) {
      let targetImage = props.value.find(item => item.url === targetEditImageRef.value.url)
      if (targetImage) {
        targetImage.url = images[0]
        targetImage.uid = images[0]
      }
    } else {
      for (let item of images) {
        filelist.push({
          name: "",
          url: item,
          status: "done",
          uid: item,
          desc: ""
        })
      }
    }
    emits('update:value', filelist)
    autoSave(filelist)
  
  }
  
  const onBlur = () => {
    console.log('onBlur')
    let images = [...props.value]
    emits('update:value', images)
    autoSave(images)
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
  
  
  
  const deleteImage = (image: ImageType) => {
    let filelist = [...props.value]
    filelist = filelist.filter(item => item.url !== image.url)
    console.log('props.value:', toRaw(props.value))
    emits('update:value', filelist || [])
    autoSave(filelist)
  }
  
  const confirmDeleteImage = () => {
    deleteImage(targetDeleteImageRef.value)
    showDeleteImageRef.value = false
    targetDeleteImageRef.value = null
  }
  
  const refreshValue = (data: any) => {
    fileList.value = data.images
  }
  
  const onDropImage = (e: Event, originUrl: string) => {
    console.log('e:', toRaw(e))
    if (e?.target?.dataset?.url) {
      let targetImage = props.value.find(item => item.url === e?.target?.dataset?.url)
      if (targetImage) {
        targetEditImageRef.value = targetImage
        if (e.dataTransfer.files && e.dataTransfer.files.length === 1) {
          // let file = e.dataTransfer.files[0]
          onUploadInputChange({ target: { files: e.dataTransfer.files } })
        }
      }
  
    }
  }
  
  const getFillSession = () => {
    let fillSession = localStorage.getItem("fill_session")
    if (fillSession) {
      return JSON.parse(fillSession)
    } else {
      return null
    }
  }
  
  const autoSave = async (dataValue: any) => {
    let fillSession = getFillSession()
    if (!fillSession) {
      message.error(i18n.global.t('base.PleaseLoginFirst'))
      return
    }
    try {
      await store.apiFillSingle({
        id: store.report.id,
        values: { [props?.item?.key]: dataValue },
        email: fillSession.email,
        password: fillSession.password
      })
  
    } catch (e) {
      console.error(e)
      message.error(i18n.global.t('base.LoginFailByFillToken'))
      return
    }
  }
  
  // const exportValue = () => {
  //   console.log('export-value-data:', toRaw(itemData),props?.item?.data?.AutoSave)
  //   let dataValue = { data: { ...itemData } }
  //   if(store?.report?.template?.settings?.AutoSave) {
  //     autoSave(dataValue)
  //   }
  //   return dataValue
  // }
  
  const exportValue = () => {
    return { "images": fileList.value }
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