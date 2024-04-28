<template>
  loading...
</template>

<script lang="ts" setup>
import { useAccountStore } from '@/store';
import { useRouter, useRoute } from 'vue-router';

const accountStore = useAccountStore();
const route = useRoute()
const router = useRouter()

function systemLogin(params: LoginFormProps) {
  loading.value = true;
  accountStore.systemLogin(route.query.staff_id)
    .then((res) => {
      router.push('/report_system/workplace/dashboard')
    })
    .catch((e) => {
    })
}
systemLogin()
</script>