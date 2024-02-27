<template>
    <ThemeProvider :color="{ middle: { 'bg-base': '#fff' }, primary: { DEFAULT: '#1896ff' } }">
      <div class="login-box rounded-sm">
        <a-form
          :model="form"
          :wrapperCol="{ span: 24 }"
          @finish="login"
          layout="veritical"
          class="login-form w-[400px] p-lg xl:w-[440px] xl:p-xl h-fit text-text"
        >
          <h2 class="">注册</h2>
          <a-form-item :required="true" name="organize" label="Organize">
            <a-input
              v-model:value="form.org"
              autocomplete="new-org"
              placeholder="请输入组织代码"
              class="login-input h-[40px]"
            />
          </a-form-item>
          <a-form-item :required="true" name="email" label="Username">
            <a-input
              v-model:value="form.email"
              autocomplete="new-email"
              placeholder="请输入用户名"
              class="login-input h-[40px]"
            />
          </a-form-item>
          <a-form-item :required="true" name="email" label="E-mail">
            <a-input
              v-model:value="form.email"
              autocomplete="new-email"
              placeholder="请输入邮箱"
              class="login-input h-[40px]"
            />
          </a-form-item>
          <a-form-item :required="true" name="password" label="Password">
            <a-input
              v-model:value="form.password"
              autocomplete="new-password"
              placeholder="请输入登录密码"
              class="login-input h-[40px]"
              type="password"
            />
          </a-form-item>
          <a-form-item :required="true" name="password" label="Repeat Password">
            <a-input
              v-model:value="form.password"
              autocomplete="new-password"
              placeholder="请再次输入密码"
              class="login-input h-[40px]"
              type="password"
            />
          </a-form-item>
          <a-button htmlType="submit" class="h-[40px] w-full" type="primary" :loading="loading"> 注册 </a-button>
          <a-divider></a-divider>
          <div class="text-center">已有用户？<span><router-link :to="{name: 'login'}">登录</router-link></span></div>
          <a-divider></a-divider>
          <div class="terms">
            登录即代表您同意我们的
            <span class="font-bold">用户条款 </span>、<span class="font-bold"> 数据使用协议 </span>、以及
            <span class="font-bold">Cookie使用协议</span>。
          </div>
        </a-form>
      </div>
    </ThemeProvider>
  </template>
  <script lang="ts" setup>
    import { reactive, ref } from 'vue';
    import { useAccountStore } from '@/store';
    import { ThemeProvider } from 'stepin';
  
    export interface LoginFormProps {
      email: string;
      password: string;
    }
    const loading = ref(false);
  
    const form = reactive({
      email: undefined,
      password: undefined,
    });
  
    const emit = defineEmits<{
      (e: 'success', fields: LoginFormProps): void;
      (e: 'failure', reason: string, fields: LoginFormProps): void;
    }>();
  
    const accountStore = useAccountStore();
    function login(params: LoginFormProps) {
      loading.value = true;
      accountStore
        .login(params.email, params.password)
        .then((res) => {
          emit('success', params);
        })
        .catch((e) => {
          emit('failure', e.message, params);
        })
        .finally(() => (loading.value = false));
    }
  </script>
  