<template>
  <a-modal width="100%" wrap-class-name="full-modal" v-model:visible="modelVisible" :title="props.title"
    :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel" :afterClose="afterClose">
    <a-form ref="formRef" style="max-width: 600px; margin: 0 auto;" layout="vertical">
      <!-- <a-form-item label="chargeTo">
                <a-input v-model:value="store.reimRecordItem.chargeTo"></a-input>
            </a-form-item> -->
      <a-form-item label="currency">
        <a-select v-model:value="store.reimRecordItem.currency" :options="currencies"></a-select>
      </a-form-item>
      <a-form-item label="target_currency">
        <a-select v-model:value="store.reimRecordItem.target_currency" :options="currencies"></a-select>
      </a-form-item>
      <a-form-item label="total" v-if="store.reimRecordItem.items && store.reimRecordItem.items.length != 0">
        <a-input-number v-model:value="totalAmount" style="width: 100%;" readonly></a-input-number>
      </a-form-item>
      <a-form-item label="remark">
        <a-textarea v-model:value="store.reimRecordItem.remark"></a-textarea>
      </a-form-item>
      <slot name="inner" />
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, reactive, defineComponent, toRaw } from 'vue';
import Spin from "@/components/spin/index.vue";
import { CurrencyStore } from "@/store/currency";
import { ReimRecordStore } from "@/store/record";
import dayjs from 'dayjs';
import { ossUploadFiles } from '@/store/uploader'
const modelVisible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const currencyStore = CurrencyStore()
const store = ReimRecordStore()

const emits = defineEmits(['submit-form', 'cancel-form'])
const props = {
  title: {
    type: String,
    default: ''
  }
}

const totalAmount = computed(() => store.reimRecordItem.items.reduce((acc, cur) => acc + cur.amount, 0))

const currencies = computed(() => currencyStore.entities.map(c => { return { label: c.name, value: c.code } }))

const handleCancel = () => {
  modelVisible.value = false
  emits('cancel-form')
}

const handleOk = () => {
  confirmLoading.value = true
  emits('submit-form')
  console.log('reimMealPoint:', store.reimMealPoint)
  console.log('reimTransportationPoint:', store.reimTransportationPoint)
  console.log('reimAccommondationPoint:', store.reimAccommondationPoint)
  console.log('reimOvertimePoint:', store.reimOvertimePoint)
  console.log('reimOtherPoint:', store.reimOtherPoint)
  console.log('reimShoppingPoint:', store.reimShoppingPoint)
  console.log('store.reimRecordItem:', toRaw(store.reimRecordItem))
  store.reimRecordItem.amount = totalAmount.value

  if (store.reimRecordEditIndex !== null) {
    store.reimRecord.items[store.reimRecordEditIndex] = store.reimRecordItem
  } else {
    store.reimRecord.items.push({ ...store.reimRecordItem })
  }
  let totalItems = {}
  for (let item of store.reimRecord.items) {
    if (totalItems[item.currency] === undefined) {
      totalItems[item.currency] = 0
    }
    totalItems[item.currency] += item.amount
  }

  store.reimRecord.totalItems = totalItems
  store.resetItem('item')
  setTimeout(() => {
    confirmLoading.value = false
    modelVisible.value = false
  }, 2000)
}

const toggleModal = (item: any) => {

  modelVisible.value = !modelVisible.value
  if (modelVisible.value) {
    if (item?.id) {
      store.reimRecordItem.expense_type = item
    }
  } else {
    store.reimRecordItem.expense_type = null
  }
}

const initializeData = async () => {
  currencyStore.apiQuery()
};

const afterClose = () => {
  store.resetItem('item')
}



initializeData()

defineExpose({
  toggleModal
})
</script>


<style scoped></style>