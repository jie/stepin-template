<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { EditOutlined, ReadOutlined } from '@ant-design/icons-vue';
import {Role, permissions, roles} from '@/pages/constants';
const columns = [
  {
    title: 'ROLE',
    dataIndex: 'name',
  },
  { title: 'PERMISSIONS', dataIndex: 'permissions', width: 400 },
  { title: 'STATUS', dataIndex: 'status' },
  { title: 'CREATED', dataIndex: 'time' },
  { title: 'OP', dataIndex: 'edit', width: 40 },
];



function addNew() {
  showModal.value = true;
  form._isNew = true;
}

const showModal = ref(false);

const newAuthor = (author?: Role) => {
  if (!author) {
    author = { _isNew: true };
  }
  author.name = undefined;
  author.status = 0;
  author.permissions = [];
  author.time = dayjs();
  return author;
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(target).forEach((key) => (target[key] = source[key]));
};

const form = reactive<Role>(newAuthor());

function reset() {
  return newAuthor(form);
}

function cancel() {
  showModal.value = false;
  reset();
}

const formModel = ref<FormInstance>();

const formLoading = ref(false);

async function extractImg(file: Blob, author: Role) {
  await getBase64(file).then((res) => {
    author.avatar = res;
  });
}

function submit() {
  formLoading.value = true;
  formModel.value
    ?.validateFields()
    .then((res: Role) => {
      if (form._isNew) {
        roles.push({ ...res });
      } else {
        copyObject(editRecord.value, res);
      }
      showModal.value = false;
      reset();
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      formLoading.value = false;
    });
}

const editRecord = ref<Role>();

/**
 * 编辑
 * @param record
 */
function edit(record: Role) {
  editRecord.value = record;
  copyObject(form, record);
  showModal.value = true;
}

type Status = 0 | 1;

const StatusDict = {
  0: 'disable',
  1: 'enable',
};

const getPermissionName = (slug: string) => {
  return permissions.find((item) => item.slug === slug).name;
};

</script>
<template>
  <a-modal :title="form._isNew ? '新增' : '编辑'" v-model:visible="showModal" @ok="submit" @cancel="cancel">
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
      <a-form-item label="名称" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="权限" required name="permissions">
        <a-select v-model:value="form.permissions" mode="multiple" :options="permissions" :fieldNames="{label: 'name', value: 'slug'}"/>
      </a-form-item>
      <a-form-item required label="状态" name="status">
        <a-select style="width: 90px" v-model:value="form.status" :options="[
          { label: 'disable', value: 0 },
          { label: 'enable', value: 1 },
        ]" />
      </a-form-item>
      <a-form-item label="日期" name="time">
        <a-date-picker v-model:value="form.time" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="roles" :pagination="false">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>角色</h4>
        <a-button type="primary" @click="addNew" :loading="formLoading">
          <template #icon>
            <PlusOutlined />
          </template>
          新增
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
          <a-tag color="#108ee9" v-for="permission in record.permissions">{{ getPermissionName(permission) }}</a-tag>
        </div>
      </div>
      <template v-else-if="column.dataIndex === 'status'">
        <a-badge class="text-subtext" :color="'green'">
          <template #text>
            <span class="text-subtext">{{ StatusDict[text as Status] }}</span>
          </template>
        </a-badge>
      </template>
      <template v-else-if="column.dataIndex === 'time'">
        {{ text?.format('YYYY-MM-DD') }}
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
                  查看
                </a>
              </a-menu-item>
              <a-menu-item key="0">
                <a @click="edit(record)" rel="noopener noreferrer">
                  <EditOutlined />
                  编辑
                </a>
              </a-menu-item>
              <a-menu-item key="1">
                <a @click="edit(record)" rel="noopener noreferrer">
                  <DeleteFilled />
                  删除
                </a>
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
