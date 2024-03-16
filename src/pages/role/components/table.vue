<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { EditOutlined, ReadOutlined } from '@ant-design/icons-vue';
import {permissions, roles} from '@/pages/constants';
import { ReportRoleStore, ReportRole } from '@/store/role';
import { ApproveStatusOptions, ApproveStatus } from '@/utils/constant';

const store = ReportRoleStore();
const columns = [
  {
    title: 'ROLE',
    dataIndex: 'name',
  },
  { title: 'PERMISSIONS', dataIndex: 'permissions', width: 400 },
  { title: 'CREATED', dataIndex: 'create_at' },
  { title: 'OP', dataIndex: 'edit', width: 40 },
];



function addNew() {
  showModal.value = true;
  store.isNew = true;
}

const showModal = ref(false);

const newRole = (role?: ReportRole) => {
  store.isNew = true
  role.name = "";
  role.status = "3";
  role.permissions = [];
  role.create_at = null;
  return role;
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(target).forEach((key) => (target[key] = source[key]));
};

const form = reactive<ReportRole>(newRole({}));

function reset() {
  return newRole(form);
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
    .then(async (res: ReportRole) => {
      if (store.isNew) {
        await store.apiSave({name: form.name, status: form.status, permissions: form.permissions})
      } else {
        await store.apiUpdate({id: form.id, name: form.name, status: form.status, permissions: form.permissions})
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

const editRecord = ref<ReportRole>();

/**
 * Edit
 * @param record
 */
function edit(record: ReportRole) {
  editRecord.value = record;
  copyObject(form, record);
  console.log('permissions:', record.permissions)
  form.permissions = record.permissions.map(c=>c.id)
  showModal.value = true;
}


const initializeData = async () => {
  store.apiQuery()
};

const deleteRecord = async (record: ReportRole) => {
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
      <a-form-item label="Permission" required name="permissions">
        <a-select v-model:value="form.permissions" mode="multiple" :options="permissions" :fieldNames="{label: 'name', value: 'id'}"/>
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" :pagination="false">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>Roles</h4>
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
      <div class="" v-else-if="column.dataIndex === 'permissions'">
        <div class="text-subtext">
          <a-tag color="#108ee9" v-for="permission in record.permissions">{{ permission.name }}</a-tag>
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
