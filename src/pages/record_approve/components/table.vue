<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { EditOutlined, ReadOutlined } from '@ant-design/icons-vue';
import { ReimRecord, ReimRecordStore } from '@/store/record';
import { ApproveStatusOptions, ApproveStatus } from '@/utils/constant';
import { ExpenseTypeStore } from '@/store/expense_type';
import { i18n } from '@/lang/i18n';
import { useLoadingStore } from '@/store/loading'
import { useAccountStore } from '@/store/account'
import { CurrencyStore } from '@/store';
import { toArray } from 'lodash-es';
import { toRaw } from 'vue';
import { computed } from 'vue';
import { Form } from 'ant-design-vue';
import { userInfo } from 'os';
const useForm = Form.useForm;
const store = ReimRecordStore();
const loadingStore = useLoadingStore()
const expenseTypeStore = ExpenseTypeStore();
const activeKey = ref(null);
const accountStore = useAccountStore()
const currencyStore = CurrencyStore()

const expense_types = computed(() => {
  return expenseTypeStore.entities?.filter((item: any) => {
    return accountStore.account?.permission_keys.includes(item.permission_key)
  })
})
console.log('accountStore:', toRaw(accountStore.account))



const columns = [
  {
    title: i18n.global.t('base.expense_total').toString(),
    dataIndex: 'totalItems',
  },
  { title: i18n.global.t('base.Status').toString(), dataIndex: 'status' },
  { title: i18n.global.t('base.CreateAt').toString(), dataIndex: 'create_at' },
  { title: i18n.global.t('base.OP').toString(), dataIndex: 'edit', width: 80 },
];


// status form
const ApproveStatusOptionsMap = {
  "1": [
    { label: i18n.global.t("STATUS_APPROVE"), value: "2"},
    { label: i18n.global.t("STATUS_DISAPPROVE"), value: "-2"},
  ],
  "2": [
    { label: i18n.global.t("STATUS_APPROVE"), value: "2"},
    { label: i18n.global.t("STATUS_DISAPPROVE"), value: "-2"},
  ],
  "3": [
    { label: i18n.global.t("STATUS_ADMIN_APPROVE"), value: "3"},
    { label: i18n.global.t("STATUS_ADMIN_DISAPPROVE"), value: "-3"},
  ],
  "4": [
    { label: i18n.global.t("STATUS_ACCOUNTANT_APPROVE"), value: "5"},
    { label: i18n.global.t("STATUS_ACCOUNTANT_REJECT"), value: "-5"},
    { label: i18n.global.t("STATUS_ACCOUNTANT_FINISH"), value: "6"},
  ]
}

const roleTypeMap = {
  "报销财务审核员": "4",
  "报销管理员": "3",
  "报销高级审核员": "2",
  "报销审核员": "1"
}

const computedStatusOptions = computed(() => {
  for(let role of accountStore?.account?.roles) {
    if(Object.keys(roleTypeMap).includes(role.name)) {
      return ApproveStatusOptionsMap[roleTypeMap[role.name]]
    }
  }
  return []
})


const statusForm = reactive({
  id: "",
  status: "",
  reason: ""
});
const statusFormModel = ref<FormInstance>()

const statusDialogRef = ref(false)
const showStatusDialog = (statusRecord: any) => {
  statusDialogRef.value = true
  statusForm.reason = statusRecord.reason || ''
  statusForm.id = statusRecord.id
  statusForm.status = statusRecord.status
}
const statusDialogConfirm = async () => {
  await store.apiSetStatus(statusForm)
  initializeData(false)
  statusDialogRef.value = false
}
const statusDialogCancel = () => {
  statusDialogRef.value = false
  statusForm.reason = ''
  statusForm.id = ''
  statusForm.status = ''
}



const showModal = ref(false);

const newRecord = (record?: ReimRecord) => {
  store.isNew = true
  record.name = "";
  record.settings = "";
  record.status = "3";
  record.create_at = null;
  return record;
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(target).forEach((key) => (target[key] = source[key]));
};

const form = reactive<ReimRecord>(newRecord({}));

function reset() {
  return newRecord(form);
}

function cancel() {
  showModal.value = false;
  reset();
}

const formModel = ref<FormInstance>();

const formLoading = ref(false);

function submit() {
  formLoading.value = true;
  return new Promise(async (resolve, reject) => {
    try {
      if (store.isNew) {
        await store.apiSave(store.reimRecord)
      } else {
        await store.apiUpdate(store.reimRecord)
      }
      showModal.value = false;
      reset();
      initializeData(false)
      formLoading.value = false;
      resolve(true);
    } catch (e) {
      formLoading.value = false;
      reject(e);
    }
  })
}


const currencyMap = ref({})

const initializeData = async (isOnce:Boolean) => {
  store.apiQuery({
      is_approver: true
    })
  if(isOnce) {
    await currencyStore.apiQuery()
    currencyMap.value = currencyStore.entities.reduce((acc, cur) => {
      acc[cur.code] = cur.name
      return acc
    }, {})
  }
};

const deleteRecord = async (record: ReimRecord) => {
  await store.apiDelete(record.id)
  initializeData(false)
};

const openCreateModal = async () => {
  await expenseTypeStore.apiQuery()
  showCreateModal.value = true
};

const onClickCard = (item: any) => {
  console.log('item.name:', item.name)
  store.reimRecordEditIndex = null
  if (item.name === '购物') {
    shoppingFormRef.value.toggleModal(item)
  } else if (item.name === '住宿费') {
    accommondationFormRef.value.toggleModal(item)
  } else if (item.name === '餐补') {
    mealFormRef.value.toggleModal(item)
  } else if (item.name === '交通费') {
    transportationFormRef.value.toggleModal(item)
  } else if (item.name === '加班费') {
    overtimeFormRef.value.toggleModal(item)
  } else {
    otherFormRef.value.toggleModal(item)
  }
};

const onEdit = (index: number) => {
  let targetItem = store.reimRecord.items[index]
  store.reimRecordItem = targetItem
  store.reimRecordEditIndex = index
  let expenseItem = expenseTypeStore.entities.find((item: any) => item.id === targetItem.expense_type.id)
  if (expenseItem.name === '购物') {
    shoppingFormRef.value.toggleModal(expenseItem)
  } else if (expenseItem.name === '住宿费') {
    accommondationFormRef.value.toggleModal(expenseItem)
  } else if (expenseItem.name === '餐补') {
    mealFormRef.value.toggleModal(expenseItem)
  } else if (expenseItem.name === '交通费') {
    transportationFormRef.value.toggleModal(expenseItem)
  } else if (expenseItem.name === '加班费') {
    overtimeFormRef.value.toggleModal(expenseItem)
  } else {
    otherFormRef.value.toggleModal(expenseItem)
  }
}
const onDelete = (index: number) => {
  store.reimRecord.items.splice(index, 1)
}

const formatTotalItems = (items) => {
  let _items = []
  for (let key of Object.keys(items)) {
    let currency = currencyStore.entities.find((currency) => currency.id === key)
    if (currency) {
      _items.push({
        total: items[key],
        currency: currency.name
      })
    }
  }
  return _items
}

initializeData(true)

</script>
<template>
  <!-- 审核dialog -->
  <a-modal :title="$t('base.SetStatus')" v-model:visible="statusDialogRef" @ok="statusDialogConfirm"
    @cancel="statusDialogCancel" width="660px">
    <a-form ref="statusFormModel" :model="statusForm" layout="vertical">
      <a-form-item required :label="$t('base.ReportResult')" name="status">
        {{ computedStatusOptions }}
        <a-select style="width: 100%" v-model:value="statusForm.status" :options="computedStatusOptions" />
      </a-form-item>
      <a-form-item :label="$t('base.Reason')" name="reason">
        <a-textarea v-model:value="statusForm.reason" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" :pagination="false">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>{{ $t('menu.expense_type') }}</h4>
      </div>
    </template>
    <template #bodyCell="{ column, text, record }">
      <div class="flex items-stretch" v-if="column.dataIndex === 'totalItems'">
        <div class="flex-col flex justify-evenly ml-2">
          <span class="text-title font-bold" v-for="key in Object.keys(record.totalItems)">{{ currencyMap[key] }}: {{
            record.totalItems[key] }}</span>
        </div>
      </div>
      <template v-else-if="column.dataIndex === 'status'">
        <span v-if="record.status == '1' && record.create_by == accountStore.account?.id">
          <a-button>Submit</a-button>
        </span>
        <a-badge class="text-subtext" :color="'green'" v-else>
          <template #text>
            <span class="text-subtext">
              {{ ApproveStatus[record.status || '1'] }}
            </span>
          </template>
        </a-badge>
      </template>
      <template v-else-if="column.dataIndex === 'create_at'">
        {{ dayjs(text)?.format('YYYY-MM-DD HH:mm') }}
      </template>
      <template v-else-if="column.dataIndex === 'edit'">
        <a-dropdown>
          <span class="ant-dropdown-link cursor-pointer" @click.prevent>
            <SettingOutlined />
          </span>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0">
                <a @click="edit(record)" rel="noopener noreferrer">
                  <ReadOutlined />
                  View
                </a>
              </a-menu-item>
              <a-menu-item key="2">
                <a @click="showStatusDialog(record)" rel="noopener noreferrer">
                  <EditOutlined />
                  Set Status
                </a>
              </a-menu-item>
              <a-menu-item key="3">
                <a-popconfirm :title="$t('base.ConfirmDelete')" :okText="$t('base.Yes')" :cancelText="$t('base.No')"
                  @confirm="deleteRecord(record)">
                  <a rel="noopener noreferrer">
                    <DeleteOutlined />
                    Delete
                  </a>
                </a-popconfirm>

              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <div v-else class="text-subtext">
        {{ text }}
      </div>
    </template>
  </a-table>
</template>
