<template>
    <div class="login flex items-center justify-center">
      <regist-box class="shadow-lg" @success="onLoginSuccess" />
    </div>
  </template>
  <script lang="ts" setup>
    import RegistBox from './RegistBox.vue';
    import { useRouter } from 'vue-router';
  
    const router = useRouter();
    function onLoginSuccess() {
      router.push({
        name: "report"
      });
    }
  </script>
  <style scoped lang="less">
    .login {
      min-height: max(100vh, 720px);
      margin-top: -78px;
    }
  </style>
  