<script lang="ts" setup>
  import { getBase64 } from '@/utils/file';
  import { FormInstance } from 'ant-design-vue';
  import { reactive, ref } from 'vue';
  import dayjs from 'dayjs';
  import { Dayjs } from 'dayjs';
  import { DeleteOutlined, EditFilled, EditOutlined, ReadOutlined } from '@ant-design/icons-vue';
  import { roles } from '@/pages/constants';
  const columns = [
    {
      title: 'STAFF',
      dataIndex: 'name',
    },
    { title: 'ROLES', dataIndex: 'roles' },
    { title: 'STATUS', dataIndex: 'status' },
    { title: 'CREATED', dataIndex: 'time' },
    { title: 'OP', dataIndex: 'edit', width: 40 },
  ];

  type Staff = {
    name?: string;
    email?: string;
    avatar?: string;
    roles?: string[];
    status?: number;
    time?: Dayjs;
    _edit?: boolean;
    _isNew?: boolean;
  };

  const staffs = reactive<Staff[]>([
    {
      name: '管理员1',
      email: '1126263215@qq.com',
      avatar: '/src/assets/avatar/face-1.jpg',
      status: 1,
      time: dayjs(),
      roles: ['1'],
    },
    {
      name: '审核员2',
      email: '1126263215@qq.com',
      avatar: '/src/assets/avatar/face-2.jpg',
      status: 0,
      time: dayjs(),
      roles: ['2'],
    },
    {
      name: '客户3',
      email: '1126263215@qq.com',
      avatar: '/src/assets/avatar/face-3.jpg',
      status: 1,
      time: dayjs(),
      roles: ['3'],
    },
    {
      name: '检验员4',
      email: '1126263215@qq.com',
      avatar: '/src/assets/avatar/face-4.jpg',
      status: 0,
      time: dayjs(),
      roles: ['4'],
    },
  ]);

  function addNew() {
    showModal.value = true;
    form._isNew = true;
  }

  const showModal = ref(false);

  const newStaff = (staff?: Staff) => {
    if (!staff) {
      staff = { _isNew: true };
    }
    staff.name = undefined;
    staff.email = undefined;
    staff.avatar = undefined;
    staff.status = 0;
    staff.time = dayjs();
    return staff;
  };

  const copyObject = (target: any, source?: any) => {
    if (!source) {
      return target;
    }
    Object.keys(target).forEach((key) => (target[key] = source[key]));
  };

  const form = reactive<Staff>(newStaff());

  function reset() {
    return newStaff(form);
  }

  function cancel() {
    showModal.value = false;
    reset();
  }

  const formModel = ref<FormInstance>();

  const formLoading = ref(false);

  async function extractImg(file: Blob, staff: Staff) {
    await getBase64(file).then((res) => {
      staff.avatar = res;
    });
  }

  function submit() {
    formLoading.value = true;
    formModel.value
      ?.validateFields()
      .then((res: Staff) => {
        if (form._isNew) {
          staffs.push({ ...res });
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

  const editRecord = ref<Staff>();

  /**
   * 编辑
   * @param record
   */
  function edit(record: Staff) {
    editRecord.value = record;
    copyObject(form, record);
    showModal.value = true;
  }

  type Status = 0 | 1;

  const StatusDict = {
    0: 'disable',
    1: 'enable',
  };

const getRoleName = (id: string) => {
  const role = roles.find((role) => role.id === id);
  return role?.name;
};

</script>
<template>
  <a-modal :title="form._isNew ? '新增' : '编辑'" v-model:visible="showModal" @ok="submit" @cancel="cancel">
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
      <a-form-item label="头像" required name="avatar">
        <a-upload :show-upload-list="false" :beforeUpload="(file: File) => extractImg(file, form)">
          <img class="h-8 p-0.5 rounded border border-dashed border-border" v-if="form.avatar" :src="form.avatar" />
          <a-button v-else type="dashed">
            <template #icon>
              <UploadOutlined />
            </template>
            上传
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="姓名" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item required label="邮箱" name="email">
        <a-input v-model:value="form.email" />
      </a-form-item>
      <a-form-item label="角色" required name="roles">
        <a-select v-model:value="form.roles" mode="multiple" :options="roles" :fieldNames="{label: 'name', value: 'id'}"/>
      </a-form-item>
      <a-form-item required label="状态" name="status">
        <a-select
          style="width: 90px"
          v-model:value="form.status"
          :options="[
            { label: 'disable', value: 0 },
            { label: 'enable', value: 1 },
          ]"
        />
      </a-form-item>
      <a-form-item label="日期" name="time">
        <a-date-picker v-model:value="form.time" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="staffs" :pagination="false">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>成员</h4>
        <div class="flex">
            <div class="mr-4">
              <span class="mr-2">状态</span>
              <a-select ref="select"  style="width: 120px" allowClear>
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
                <a-select-option value="disabled" disabled>Disabled</a-select-option>
                <a-select-option value="Yiminghe">yiminghe</a-select-option>
              </a-select>
            </div>
            <a-input v-model:value="searchKeywords" style="width: 240px" class="mr-4">\
              <template #addonBefore>
                关键词
              </template>
            </a-input>
            <a-button class="mr-2">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
            <a-button type="primary" @click="addNew" :loading="formLoading">
              <template #icon>
                <PlusOutlined />
              </template>
              新增
            </a-button>
          </div>
      </div>
    </template>
    <template #bodyCell="{ column, text, record }">
      <div class="flex items-stretch" v-if="column.dataIndex === 'name'">
        <img class="w-12 rounded" :src="record.avatar" />
        <div class="flex-col flex justify-evenly ml-2">
          <span class="text-title font-bold">{{ text }}</span>
          <span class="text-xs text-subtext">{{ record.email }}</span>
        </div>
      </div>
      <div class="" v-else-if="column.dataIndex === 'roles'">
        <div class="text-subtext">
            <a-tag color="#108ee9" v-for="role in record.roles">{{ getRoleName(role) }}</a-tag>
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
          <span class="ant-dropdown-link" @click.prevent>
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
                  <DeleteOutlined />
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
