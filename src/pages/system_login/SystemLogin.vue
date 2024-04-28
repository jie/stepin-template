<script lang="ts" setup>
import {ref} from "vue";
import { useAccountStore } from '@/store';
import { useRouter, useRoute } from 'vue-router';
const loading = ref(false);
const accountStore = useAccountStore();
const route = useRoute();
const router = useRouter();


const systemLogin = async () => {
  loading.value = true;
  let result;
  try {
    result = await accountStore.systemLogin(route.query.staff_id)
    console.log('systemLogin result:', result)
    setTimeout(() => {
      router.push('/report_system/workplace/dashboard')
    }, 2000)
  } catch(e) {
    console.error(e)
  } finally {
    loading.value = false
  }

}
systemLogin()
</script>

<template>
  loading...
</template>