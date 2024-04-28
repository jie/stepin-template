<script lang="ts" setup>
import { ref } from "vue";
import { useAccountStore } from '@/store';
import { useRouter, useRoute } from 'vue-router';
const loading = ref(false);
const accountStore = useAccountStore();
const route = useRoute();
const router = useRouter();


const systemLogin = async () => {
  if (!route.query.staff_id) {
    console.error('staff_id is required')
    return
  }
  loading.value = true;
  let result;
  try {
    result = await accountStore.systemLogin(route.query.staff_id)
    console.log('systemLogin result:', result)
    setTimeout(() => {
      loading.value = false
      router.push('/report_system/workplace/dashboard')
    }, 2000)
  } catch (e) {
    console.error(e)
  } finally {
    if(!result) {
      loading.value = false
    }
  }
}
systemLogin()
</script>

<template>
  <div class="flex pt-20" style="justify-content:center;align-items:center">
    <div v-if="route.query.staff_id"> <a-spin v-if="loading" size="large"/> Loading...</div>
    <div v-else>
      <a-empty description="staff_id is required" />
    </div>
  </div>
</template>