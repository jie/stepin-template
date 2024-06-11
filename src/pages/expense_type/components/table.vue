<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { EditOutlined, ReadOutlined } from '@ant-design/icons-vue';
import { ExpenseType, ExpenseTypeStore } from '@/store/expense_type';
import { ApproveStatusOptions, ApproveStatus } from '@/utils/constant';
import { i18n } from '@/lang/i18n';

const store = ExpenseTypeStore();
const columns = [
  {
    title: i18n.global.t('base.Name').toString(),
    dataIndex: 'name',
  },
  {
    title: i18n.global.t('base.NameInEnglish').toString(),
    dataIndex: 'name_en',
  },
  {
    title: i18n.global.t('base.Sort').toString(),
    dataIndex: 'sort',
  },
  { title: i18n.global.t('base.CreateAt').toString(), dataIndex: 'create_at' },
  { title: i18n.global.t('base.OP').toString(), dataIndex: 'edit', width: 80 },
];


function addNew() {
  showModal.value = true;
  store.isNew = true;
}

const showModal = ref(false);

const newRecord = (record?: ExpenseType) => {
  store.isNew = true
  record.name = "";
  record.name_en = "";
  record.sort = 0;
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

const form = reactive<ExpenseType>(newRecord({}));

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
    .then(async (res: ExpenseType) => {
      if (store.isNew) {
        await store.apiSave({name: form.name, status: form.status, settings: form.settings, name_en: form.name_en, sort: form.sort})
      } else {
        await store.apiUpdate({id: form.id, name: form.name, status: form.status, settings: form.settings, name_en: form.name_en, sort: form.sort})
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

const editRecord = ref<ExpenseType>();

/**
 * Edit
 * @param record
 */
function edit(record: ExpenseType) {
  store.isNew = false
  editRecord.value = record;
  copyObject(form, record);
  form.id = record.id;
  showModal.value = true;
}


const initializeData = async () => {
  store.apiQuery()
};

const deleteRecord = async (record: ExpenseType) => {
  await store.apiDelete(record.id)
  initializeData()
};

initializeData()

</script>
<template>
  <a-modal :title="form._isNew ? 'Create' : 'Edit'" v-model:visible="showModal" @ok="submit" @cancel="cancel">
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
      <a-form-item label="Name" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="Name in English" required name="name_en">
        <a-input v-model:value="form.name_en" />
      </a-form-item>
      <a-form-item label="Sort" required name="sort">
        <a-input-number v-model:value="form.sort" />
      </a-form-item>
      <a-form-item label="Settings" required name="name">
        <a-textarea v-model:value="form.settings" :rows="8" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" :pagination="false">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>{{ $t('menu.expense_type') }}</h4>
        <a-button type="primary" @click="addNew" :loading="formLoading">
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
