<template>
  <BaseComponent :title="props.title" ref="baseModal">
    <template #inner>
      <a-form-item label="">
        <a-list class="demo-loadmore-list" item-layout="horizontal" :data-source="store.reimRecordItem.items">
          <template #header>
            <div :style="{ textAlign: 'left', height: '32px', lineHeight: '32px' }">
              <a-button @click="modelVisible = true">Add transportation</a-button>
            </div>
          </template>
          <template #renderItem="{ item, index }">
            <a-list-item>
              <template #actions>
                <edit-outlined key="edit" @click="onEdit(index)" />
                <delete-outlined key="delete" @click="onDelete(index)" />
              </template>
              <div>
                <a-list-item-meta :description="item.remark">
                  <template #title>
                    <a href="#">{{ item.amount }}</a>
                  </template>
                  <template #avatar>
                    <dollar-circle-outlined style="font-size: 32px;" />
                  </template>
                </a-list-item-meta>
                <div>{{ item.trans_type }}</div>
                <div>[{{ item?.dateRange[0]?.format('YYYY-MM-DD HH:mm') }} ~ {{ item?.dateRange[1]?.format('YYYY-MM-DD HH:mm') }}] </div>
                <div>{{ item?.start_location }} ~ {{ item?.end_location }}</div>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-form-item>
      <a-modal width="100%" wrap-class-name="full-modal" v-model:visible="modelVisible" :title="props.title"
        :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel" :afterClose="afterClose">
        <a-form ref="formRef" style="max-width: 600px; margin: 0 auto;" layout="vertical" :validateOnRuleChange="true" :scrollToFirstError="true">
          <a-form-item label="order">
            <RemoteSelect ref="orderSelectRef" type="order" v-model:value="store.reimTransportationPoint.order"
              searchKey="name" display_key="order_no" v-on:updateSelected="onUpdateOrderSelect" />
          </a-form-item>
          <a-form-item label="amount" v-bind="validateInfos.amount">
            <a-input-number v-model:value="store.reimTransportationPoint.amount" style="width: 100%;" />
          </a-form-item>
          <a-form-item label="trans_type" v-bind="validateInfos.trans_type">
            <a-radio-group v-model:value="store.reimTransportationPoint.trans_type" button-style="solid"
              @change="onChangeTransType">
              <a-radio-button :value="option.value" v-for="option in trans_types">{{ option.label
              }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="gas_criteria" v-if="store.reimTransportationPoint.trans_type == 'car'"
            v-bind="validateInfos.gas_criteria">
            <a-input v-model:value="store.reimTransportationPoint.gas_criteria" />
          </a-form-item>
          <a-form-item label="distance" v-if="store.reimTransportationPoint.trans_type == 'car'"
            v-bind="validateInfos.distance">
            <a-input v-model:value="store.reimTransportationPoint.distance" />
          </a-form-item>
          <a-form-item label="time" v-bind="validateInfos.dateRange">
            <a-range-picker v-model:value="store.reimTransportationPoint.dateRange" :show-time="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm" style="width: 100%;" />
          </a-form-item>
          <a-form-item label="start_location" v-bind="validateInfos.start_location">
            <a-textarea v-model:value="store.reimTransportationPoint.start_location" />
          </a-form-item>
          <a-form-item label="end_location" v-bind="validateInfos.end_location">
            <a-textarea v-model:value="store.reimTransportationPoint.end_location" />
          </a-form-item>
          <a-form-item label="remark">
            <a-textarea v-model:value="store.reimTransportationPoint.remark" />
          </a-form-item>
        </a-form>
      </a-modal>

    </template>
  </BaseComponent>
</template>
<script lang="ts" setup>
import { toRaw, defineProps, ref, reactive, computed } from "vue";
import { toArray } from 'lodash-es';
import BaseComponent from "./index.vue";
import { ReimRecordStore } from "@/store/record";
import RemoteSelect from '@/components/remote_select/index.vue';
import { i18n } from '@/lang/i18n';
import dayjs from 'dayjs';
import { Form } from 'ant-design-vue';
const useForm = Form.useForm;
const orderSelectRef = ref<any>(null);
const baseModal = ref<any>(null);
const modelVisible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const editIndexRef = ref(null)
const props = defineProps({
  expense_type_id: {
    type: String,
  },
  title: {
    type: String,
    default: ''
  }
})

const store = ReimRecordStore();
const driverRules = {
  gas_criteria: [
    {
      required: true,
      message: 'Please select gas_criteria',
      type: 'array',
    },
  ],
  distance: [
    {
      required: true,
      message: 'Please select distance',
      type: 'array',
    },
  ],
}
const rulesRef = reactive({
  amount: [
    {
      required: true,
      message: 'Please input amount',
    },
    {
      type: 'number',
      message: 'Please input amount as number',
    },
  ],
  trans_type: [
    {
      required: true,
      message: 'Please select trans_type',
    },
  ],
  dateRange: [
    {
      required: true,
      message: 'Please select dateRange',
    },
  ],
  start_location: [
    {
      required: true,
      message: 'Please enter start_location',
    },
    {
      min: 1,
      message: 'Please enter end_location',
    },
  ],
  end_location: [
    {
      required: true,
      message: 'Please enter end_location',
    },
    {
      min: 1,
      message: 'Please enter end_location',
    },
  ],
});
// const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(store.reimTransportationPoint, rulesRef, {
//   onValidate: (...args) => {console.log('onValidate:', ...args); console.log('store:', toRaw(store.reimTransportationPoint))},
// });
const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(store.reimTransportationPoint, rulesRef);
const errorInfos = computed(() => {
  return mergeValidateInfo(toArray(validateInfos));
});
const trans_types = [
  { label: i18n.global.t('plane'), value: 'plane' },
  { label: i18n.global.t('train'), value: 'train' },
  { label: i18n.global.t('public'), value: 'public' },
  { label: i18n.global.t('taxi'), value: 'taxi' },
  { label: i18n.global.t('car'), value: 'car' },
]

const onChangeTransType = (e: Event) => {
  console.log('e.target.value:', e.target.value)
  if (e.target.value == 'car') {
    rulesRef.gas_criteria = driverRules.gas_criteria
    rulesRef.distance = driverRules.distance
  } else {
    rulesRef.gas_criteria = []
    rulesRef.distance = []
  }
}

const toggleModal = (item: any) => {
  baseModal.value.toggleModal(item)
}

const afterClose = () => {
  console.log('afterClose')
  store.resetItem('transportation')
}

const handleCancel = () => {
  modelVisible.value = false

}

const handleOk = () => {
  console.log('store.reimTransportationPoint:', toRaw(store.reimTransportationPoint))
  validate()
    .then((result) => {
      console.log('result:', result)

      let hasError = false

      for (let item of toArray(validateInfos)) {
        console.log('key:', item)
        // if(validateInfos[key].errors.length > 0) {
        //   hasError = true
        //   break
        // }
      }
      if(editIndexRef.value !== null) {
        store.reimRecordItem.items[editIndexRef.value] = { ...store.reimTransportationPoint }
        editIndexRef.value = null
      } else {
        store.reimRecordItem.items.push({ ...store.reimTransportationPoint })
      }
      confirmLoading.value = true
      setTimeout(() => {
        confirmLoading.value = false
        modelVisible.value = false
      }, 2000)

    })
    .catch(err => {
      console.log('error', err);
    });
}


const onUpdateOrderSelect = (selected: any) => {
  if (selected && selected.length > 0) {
    store.reimTransportationPoint.order = selected[0].id
    store.reimTransportationPoint.factory_name = selected[0].factory_name
    store.reimTransportationPoint.dateRange = [dayjs(selected[0].inspect_date), dayjs(selected[0].inspect_date)]
  }
}

const onEdit = (index: number) => {
  editIndexRef.value = index
  store.reimTransportationPoint.order = store.reimRecordItem.items[index].order
  store.reimTransportationPoint.amount = store.reimRecordItem.items[index].amount
  store.reimTransportationPoint.trans_type = store.reimRecordItem.items[index].trans_type
  store.reimTransportationPoint.gas_criteria = store.reimRecordItem.items[index].gas_criteria
  store.reimTransportationPoint.distance = store.reimRecordItem.items[index].distance
  store.reimTransportationPoint.start_location = store.reimRecordItem.items[index].start_location
  store.reimTransportationPoint.end_location = store.reimRecordItem.items[index].end_location
  store.reimTransportationPoint.remark = store.reimRecordItem.items[index].remark
  store.reimTransportationPoint.dateRange = [...store.reimRecordItem.items[index].dateRange]
  modelVisible.value = true
}
const onDelete = (index: number) => {
  store.reimRecordItem.items.splice(index, 1)
}

defineExpose({ toggleModal })
</script>