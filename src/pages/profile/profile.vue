<template>
  <div>
    <div>{{ $t('base.ChangePassword') }}</div>
    <hr>
    <a-form ref="userPasswordFormRef" :model="userPasswordForm" :labelCol="{ span: 5 }" :wrapperCol="{ span: 10 }"
      :validateFirst="true" layout="vertical" :roles="userPasswordFormRules">
      <a-form-item :label="$t('base.oldPassword')" v-bind="validateInfos.oldPassword">
        <a-input-password v-model:value="userPasswordForm.oldPassword" />
      </a-form-item>
      <a-form-item :label="$t('base.newPassword')" v-bind="validateInfos.newPassword">
        <a-input-password v-model:value="userPasswordForm.newPassword" />
      </a-form-item>
      <a-form-item :label="$t('base.confirmPassword')" v-bind="validateInfos.confirmPassword">
        <a-input-password v-model:value="userPasswordForm.confirmPassword" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click.prevent="submitUserPasswordForm">{{ $t('base.Submit') }}</a-button>
      </a-form-item>
    </a-form>

  </div>
</template>


<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useAccountStore } from '@/store/account';
import { i18n } from "@/lang/i18n"
import { Form } from 'ant-design-vue';

const useUserPasswordForm = Form.useForm;
const store = useAccountStore();

const userPasswordFormRef = ref();
const userPasswordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const userPasswordFormRules = reactive({
  oldPassword: [
    { required: true, message: i18n.global.t('base.please_enter_old_password') },
    { min: 6, message: i18n.global.t('base.password_length_error') }
  ],
  newPassword: [
    { required: true, message: i18n.global.t('base.please_enter_new_password') },
    { min: 6, message: i18n.global.t('base.password_length_error') }
  ],
  confirmPassword: [
    { required: true, message: i18n.global.t('base.please_enter_confirm_password') },
    { min: 6, message: i18n.global.t('base.password_length_error') },
    {
      validator: (rule, value, callback) => {
        return new Promise((resolve, reject) => {
          if (value !== userPasswordForm.newPassword) {
            reject(i18n.global.t('base.password_not_match'))
          } else {
            resolve(true)
          }
        })
      }
    }
  ],

})
const { resetFields, validate, validateInfos, mergeValidateInfo } = useUserPasswordForm(userPasswordForm, userPasswordFormRules);
const submitUserPasswordForm = () => {
  validate()
    .then(() => {
      store.changePassword(userPasswordForm.oldPassword, userPasswordForm.newPassword).then(() => {
        resetFields()
      })
      
    })
    .catch(err => {
      console.log('error', err);
    });
}
</script>