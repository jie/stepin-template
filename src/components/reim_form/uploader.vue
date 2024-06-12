<template>
    <div @click="uploadFile">
        <a-button>
            <template #icon>
                <UploadOutlined />
            </template>
            {{ $t('base.Upload') }}
        </a-button>
    </div>
    <div v-if="props.modelValue.length != 0" style="margin-top: 20px;">
        <a-image-preview-group>
            <div style="display: flex; flex-wrap: wrap; width: 100%;">
                <div v-for="(image, index) in props.modelValue"
                    style="width: 120px; height: 150px; margin-right: 10px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
                    <a-image :width="120" :height="120" style="object-fit: cover; overflow: hidden;" :src="image.url"
                        :fallback="failbackImageBase64">
                        <template #placeholder v-if="image.type != 'PDF'">
                            <a-image
                                :src="`${image.url}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_120,w_120`"
                                :width="120" :height="120" :preview="false" />
                        </template>
                    </a-image>
                    <div style="display: flex; align-items: center; justify-content: center; border-top: 1px solid #ddd;">
                        <div style="flex: 1;display: flex; align-items: center; justify-content: center; height: 30px;">
                            <DeleteOutlined @click="onDeleteImage(index)" />
                        </div>
                        <div style="flex: 1;display: flex; align-items: center; justify-content: center;  height: 30px;">
                            <CloudDownloadOutlined @click="onDownloadImage(index)" />
                        </div>
                    </div>
                </div>
            </div>

        </a-image-preview-group>
    </div>
</template>


<script lang="ts" setup>
import { ref, computed, defineEmits, defineModel } from 'vue';
import { i18n } from '@/lang/i18n';
import { failbackImageBase64, downloadUrl } from "@/utils/helpers"
import dayjs from 'dayjs';
import { ossUploadFiles } from '@/store/uploader'
import { message } from 'ant-design-vue';
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    }
})
const emits = defineEmits(['change', 'update:modelValue'])
const uploadFile = () => {
    const input = document.createElement('input');
    input.id = 'willUploadFileInput';
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*, application/pdf';
    let prefix = `reim/${dayjs().format('YYYYMMDD')}`

    // if (editThirdpartyRecord.value?.order?.company?.id) {
    //   prefix = `reim/${editThirdpartyRecord.value?.order?.company?.id}/${dayjs().format('YYYYMMDD')}`
    // } else {
    //   prefix = `reim/${dayjs().format('YYYYMMDD')}`
    // }



    input.onchange = async (e: any) => {

        for (let file of e.target.files) {
            let file_type = file.type
            if (file_type.includes('image')) {
                file_type = 'Photo'
            } else if (file_type.includes('pdf')) {
                file_type = 'PDF'
            } else {
                file_type = 'File'
            }
            if (file_type === 'File') {
                message.error('Only support image and pdf file')
                return
            }
        }

        let result = await ossUploadFiles(e, prefix)
        for (let item of result) {
            props.modelValue.push({
                type: item.type,
                url: item.url,
                remark: ""
            })
            emits('update:modelValue', props.modelValue)
        }
        // remove child by ID
        const willUploadFileInput = document.getElementById('willUploadFileInput');
        willUploadFileInput?.parentNode?.removeChild(willUploadFileInput);
    };
    input.click();
}

const onDeleteImage = (index: number) => {
    props.modelValue.splice(index, 1)
    emits('update:modelValue', props.modelValue)
}
const onDownloadImage = (index: number) => {
    downloadUrl(props.modelValue[index].url)
}

</script>


<style>
.full-modal .ant-image {
    margin-right: 10px;
}

.full-modal .ant-image-img {
    width: 120px;
    height: 120px;
}
</style>