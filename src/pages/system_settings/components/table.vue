<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref, toRaw } from 'vue';
import dayjs from 'dayjs';
import { EditOutlined, ReadOutlined } from '@ant-design/icons-vue';
import { ReportSystemConfigStore, ReportSystemConfig } from '@/store/system_config';
import { ApproveStatusOptions, ApproveStatus } from '@/utils/constant';

const store = ReportSystemConfigStore();
const columns = [
  { title: 'Key', dataIndex: 'key', width: 400 },
  { title: 'Value', dataIndex: 'value', width: 400 },
  { title: 'Data type', dataIndex: 'data_type', width: 400 },
  { title: 'Is Enable', dataIndex: 'is_enable', width: 200},
  { title: 'Updated', dataIndex: 'update_at', width: 300},
  { title: 'OP', dataIndex: 'edit', width: 40 },
];



function addNew() {
  showModal.value = true;
  store.isNew = true;
}

const showModal = ref(false);

const newRecord = (role?: ReportSystemConfig) => {
  store.isNew = true
  role.key = "";
  role.value = "";
  role.desc = "";
  role.data_type = "string";
  role.is_enable = true;
  role.create_at = null;
  return role;
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(target).forEach((key) => (target[key] = source[key]));
};

const form = reactive<ReportSystemConfig>(newRecord({}));

function reset() {
  return newRecord(form);
}

function cancel() {
  showModal.value = false;
  reset();
}

const formModel = ref<FormInstance>();

const formLoading = ref(false);

async function extractImg(file: Blob, author: ReportSystemConfig) {
  await getBase64(file).then((res) => {
    author.avatar = res;
  });
}

function submit() {
  formLoading.value = true;
  formModel.value
    ?.validateFields()
    .then(async (res: ReportSystemConfig) => {
      if (store.isNew) {
        await store.apiSave({key: form.key, status: form.status, value: form.value, date_type: form.date_type, desc: form.desc, is_enable: form.is_enable})
      } else {
        await store.apiUpdate({id: form.id, key: form.key, status: form.status, value: form.value, date_type: form.date_type, desc: form.desc, is_enable: form.is_enable})
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

const editRecord = ref<ReportSystemConfig>();

/**
 * Edit
 * @param record
 */
function edit(record: ReportSystemConfig) {
  store.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  console.log('record:', toRaw(record))
  console.log('form:', toRaw(form))
  form.id = record.id;
  showModal.value = true;
}

const initializeData = async () => {
  store.apiQuery()
};

const deleteRecord = async (id:string) => {
  await store.apiDelete(id)
  initializeData()
}


initializeData()

</script>
<template>
  <a-modal :title="store.isNew ? 'Create' : 'Edit'" v-model:visible="showModal" @ok="submit" @cancel="cancel">
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
      <a-form-item label="Key" required name="key">
        <a-input v-model:value="form.key" />
      </a-form-item>
      <a-form-item label="Value" required name="value">
        <a-input v-model:value="form.value" />
      </a-form-item>
      <a-form-item label="Data type" required name="data_type">
        <a-select v-model:value="form.data_type" :options="[{'label':'string', 'value':'string'},{'label':'json', 'value':'json'}]"/>
      </a-form-item>
      <a-form-item label="Description" name="desc">
        <a-textarea v-model:value="form.desc" />
      </a-form-item>
      <a-form-item label="Is Enable" name="is_enable">
        <a-switch v-model:checked="form.is_enable" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" :pagination="false">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>System settings</h4>
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
      <template v-else-if="column.dataIndex === 'is_enable'">
        <a-switch :checked="record.is_enable" />
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
                <a-popconfirm title="Delete" content="Confirm delete?" okText="Yes" cancelText="No" @confirm="deleteRecord(record.id)">
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
