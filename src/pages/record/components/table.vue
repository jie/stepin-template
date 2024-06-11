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
import ShoppingForm from '@/components/reim_form/shopping_bak.vue';
import AccommondationForm from '@/components/reim_form/accommondation_bak.vue';
import MealForm from '@/components/reim_form/meal_bak.vue';
import TransportationForm from '@/components/reim_form/transportation.vue';
import OvertimeForm from '@/components/reim_form/overtime_bak.vue';
import OtherForm from '@/components/reim_form/other_bak.vue';
import { toRaw } from 'vue';
import { computed } from 'vue';
const store = ReimRecordStore();
const loadingStore = useLoadingStore()
const expenseTypeStore = ExpenseTypeStore();
const activeKey = ref(null);
const showCreateModal = ref(false);
const shoppingFormRef = ref(null);
const accommondationFormRef = ref(null);
const mealFormRef = ref(null);
const transportationFormRef = ref(null);
const overtimeFormRef = ref(null);
const otherFormRef = ref(null);
const accountStore = useAccountStore()
const expense_types = computed(() => {
  return expenseTypeStore.entities?.filter((item: any) => {
    return accountStore.account?.permission_keys.includes(item.permission_key)
  })
})
console.log('accountStore:', toRaw(accountStore.account))

const columns = [
  {
    title: i18n.global.t('base.Name').toString(),
    dataIndex: 'name',
  },
  { title: i18n.global.t('base.CreateAt').toString(), dataIndex: 'create_at' },
  { title: i18n.global.t('base.OP').toString(), dataIndex: 'edit', width: 80 },
];


function addNew() {
  // showModal.value = true;
  // store.isNew = true;
  showCreateModal.value = false
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
  formModel.value
    ?.validateFields()
    .then(async (res: ReimRecord) => {
      if (store.isNew) {
        await store.apiSave({ name: form.name, status: form.status })
      } else {
        await store.apiUpdate({ id: form.id, name: form.name, status: form.status })
      }
      showModal.value = false;
      reset();
      initializeData()
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      formLoading.value = false;
    });
}

const editRecord = ref<ReimRecord>();

/**
 * Edit
 * @param record
 */
function edit(record: ReimRecord) {
  store.isNew = false
  editRecord.value = record;
  copyObject(form, record);
  form.id = record.id;
  showModal.value = true;
}


const initializeData = async () => {
  store.apiQuery()
};

const deleteRecord = async (record: ReimRecord) => {
  await store.apiDelete(record.id)
  initializeData()
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

initializeData()

</script>
<template>
  <ShoppingForm ref="shoppingFormRef" title="test shipping form" />
  <AccommondationForm ref="accommondationFormRef" title="test accommondationFormRef form" />
  <MealForm ref="mealFormRef" title="test mealFormRef form" />
  <TransportationForm ref="transportationFormRef" title="test transportationFormRef form" />
  <OvertimeForm ref="overtimeFormRef" title="test overtimeFormRef form" />
  <OtherForm ref="otherFormRef" title="test otherFormRef form" />
  <a-modal :title="form._isNew ? 'Create' : 'Edit'" v-model:visible="showModal" @ok="submit" @cancel="cancel">
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
      <a-form-item label="Name" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal width="100%" wrap-class-name="full-modal" :title="form._isNew ? 'Create' : 'Edit'"
    v-model:visible="showCreateModal" @ok="submit" @cancel="cancel">
    <div style="width: 100%; height: 100%;">
      <a-spin tip="Loading..." v-if="loadingStore.pageLoading"></a-spin>
      <div v-else>
        <a-collapse v-model:activeKey="activeKey" :bordered="true">
          <a-collapse-panel key="1" header="please choose expense type" style="width: 100%;">
            <div style="padding: 20px; display: flex; flex-wrap: wrap; margin: 0 auto; align-items: center; width: 100%;">
              <a-card :bordered="true" v-for="item in expense_types" style="margin: 10px; width: 180px;"
                :title="i18n.global.locale == 'en' ? item.name_en : item.name">
                <a-button type="default" @click="onClickCard(item)">add</a-button>
              </a-card>
            </div>
          </a-collapse-panel>
        </a-collapse>
        <div v-if="store.reimRecord.items && store.reimRecord.items.length != 0">
          <a-list class="demo-loadmore-list" item-layout="horizontal" :data-source="store.reimRecord.items">
            <template #header>
              <div :style="{ textAlign: 'left', height: '32px', lineHeight: '32px' }">Expense items</div>
            </template>
            <template #renderItem="{ item, index }">
              <a-list-item>
                <template #actions>
                  <edit-outlined key="edit" @click="onEdit(index)" />
                  <delete-outlined key="delete" @click="onDelete(index)" />
                </template>
                <div style="width: 100%;">
                  <a-list-item-meta :description="item.remark">
                    <template #title>
                      <a href="#">{{ item.amount }} ({{ item.expense_type.name }})</a>
                    </template>
                    <template #avatar>
                      <dollar-circle-outlined style="font-size: 32px;" />
                    </template>
                  </a-list-item-meta>
                </div>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
    </div>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" :pagination="false">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>{{ $t('menu.expense_type') }}</h4>
        <a-button type="primary" @click="openCreateModal" :loading="formLoading">
          <template #icon>
            <PlusOutlined />
          </template>
          Create
        </a-button>
      </div>
    </template>
    <template #bodyCell="{ column, text, record }">
      <div class="flex items-stretch" v-if="column.dataIndex === 'name'">
        <div class="flex-col flex justify-evenly ml-2">
          <span class="text-title font-bold">{{ text }}</span>
        </div>
      </div>
      <template v-else-if="column.dataIndex === 'status'">
        <a-badge class="text-subtext" :color="'green'">
          <template #text>
            <span class="text-subtext">{{ ApproveStatus[text] }}</span>
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
              <a-menu-item key="0">
                <a @click="edit(record)" rel="noopener noreferrer">
                  <EditOutlined />
                  Edit
                </a>
              </a-menu-item>
              <a-menu-item key="1">
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
