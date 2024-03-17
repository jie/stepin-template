<template>
  <div>
    <div>edit</div>
    <div style="color: #333">
      <div class="mt-6">
        <div class="pb-6">
          <h3 class="" style="text-align:center; font-size:120%">{{ $t('base.Settings') }}</h3>
        </div>
        <div>
          <a-form :model="formData" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
            <a-form-item :label="$t('base.IsTextarea')" name="is_textarea">
              <a-switch v-model:checked="formData.is_textarea" />
            </a-form-item>
            <a-form-item :label="$t('base.IsBold')" name="is_bold">
              <a-switch v-model:checked="formData.is_bold" />
            </a-form-item>
            <a-form-item :label="$t('base.Alignment')" name="alignment">
              <a-radio-group v-model:value="formData.alignment" button-style="solid">
                <a-radio-button value="left">{{ $t('base.left') }}</a-radio-button>
                <a-radio-button value="center">{{ $t('base.center') }}</a-radio-button>
                <a-radio-button value="right">{{ $t('base.right') }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item :label="$t('base.FontSize')" name="font_size">
              <a-textarea v-model:value="formData.font_size" v-if="formData.font_size" />
              <a-input v-model:value="formData.font_size" v-else />
            </a-form-item>
            <a-form-item :label="$t('base.Text')" name="text">
              <a-textarea v-model:value="formData.text" v-if="formData.is_textarea" />
              <a-input v-model:value="formData.text" v-else />
            </a-form-item>
            <a-form-item :label="$t('base.Sort')" name="sort">
              <a-input-number v-model:value="formData.sort" />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue"
const formData = ref({
    is_textarea: false,
    is_bold: false,
    alignment: 'left',
    font_size: '12',
    text: "",
    sort: "0",
})

const initializeData = (item: any) => {
  console.log('initializeData')
  formData.value = item
}
const exportData = () => {
    console.log('baseForm.value.exportData():', formData.value)
    return {
      ...formData.value,
      data: {
        is_textarea: formData.value.is_textarea,
        is_bold: formData.value.is_bold,
        alignment: formData.value.alignment,
        font_size: formData.value.font_size,
        text: formData.value.text,
      }
    }
  }
  

defineExpose({
  initializeData,
  exportData
})
</script>