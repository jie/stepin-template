<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref, toRaw } from 'vue';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { EditOutlined, DeleteOutlined, ExperimentOutlined, SettingOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import { ApproveStatusOptions, ApproveStatus } from "@/utils/constant"
import { ReimUserStore, ReimUser } from "@/store/user"
import { ReimRoleStore } from "@/store/role"
import { getSessionInfo } from '@/utils/session'
import { statusFormSchema } from "@/types"
const isViewForm = ref(false)
const store = ReimUserStore()
const roleStore = ReimRoleStore()
const searchKeywords = ref("")
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  { title: 'Status', dataIndex: 'status' },
  { title: 'Staff', dataIndex: 'staff' },
  { title: 'Worker', dataIndex: 'worker' },
  { title: 'Create at', dataIndex: 'create_at' },
  { title: 'OP', dataIndex: 'edit', width: 40 },
];


const Ctl = reactive({
  records: [] as ReimUser[],
  page: 1,
  pagesize: 10,
  total: 0,
  isNew: false
});

const createTimeRef = ref<Dayjs>(dayjs());


const initializeData = async () => {
  let result = await store.apiQuery()
  console.log('result:', result)
  roleStore.pagination = { page: 1, pagesize: 1000 }
  roleStore.apiQuery()
}

initializeData()

function addNew() {
  isViewForm.value = false
  showModal.value = true;
  Ctl.isNew = true;
}

const showModal = ref(false);

const newReimUser = (reimUser?: ReimUser) => {
  createTimeRef.value = dayjs()
  let create_at = createTimeRef.value.format('YYYY-MM-DD HH:mm:ss')
  if (!reimUser) {

    return <ReimUser>{
      id: '',
      name: '',
      email: '',
      phone: '',
      mobile: '',
      remark: '',
      avatar: '',
      password: '',
      roles: [],
      status: '1',
      worker: "",
      staff: "",
      create_at: create_at
    }
  } else {
    reimUser.name = '';
    reimUser.email = '';
    reimUser.phone = '';
    reimUser.mobile = '';
    reimUser.name = '';
    reimUser.password = '';
    reimUser.remark = '';
    reimUser.avatar = '';
    reimUser.status = '1';
    reimUser.roles = [];
    reimUser.worker = "";
    reimUser.staff = "";
    reimUser.create_at = create_at;
    return reimUser;
  }
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(source).forEach((key) => (target[key] = source[key]));
};

const form = reactive<ReimUser>(newReimUser());
console.log('form:', form)
function reset() {
  return newReimUser(form);
}

function cancel() {
  showModal.value = false;
  reset();
}

const formModel = ref<FormInstance>();

const formLoading = ref(false);


async function submit() {
  let session = getSessionInfo()
  console.log('session:', session)
  formLoading.value = true;
  let formValue = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    mobile: form.mobile,
    password: form.password,
    remark: form.remark,
    status: form.status,
    avatar: form.avatar,
    roles: form.roles,
    worker: form.worker,
    staff: form.staff,
    org_id: session.user_data.org_id,
  }
  formModel.value
    ?.validateFields()
    .then(async (res: ReimUser) => {
      if (Ctl.isNew === true) {
        await store.apiSave(formValue)
      } else {
        await store.apiUpdate({ id: form.id, ...formValue })
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

const editRecord = ref<ReimUser>();

/**
 * 编辑
 * @param record
 */
function edit(record: ReimUser) {
  console.log(toRaw(record))
  isViewForm.value = false
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  if ((record.roles as any).length > 0) {
    form.roles = (record.roles as any).map((item: any) => item.id)
  }
  form.password = ''
  showModal.value = true;
}
function view(record: ReimUser) {
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  isViewForm.value = true
  showModal.value = true;
}



const deleteRecord = async (record: ReimUser) => {
  console.log('record:', record)
  await store.apiDelete(record.id)
  initializeData()
}

const onClickSearch = async () => {
  store.queryArgs.keyword = searchKeywords.value
  console.log('store.queryArgs.keyword:', store.queryArgs.keyword)
  store.apiQuery()
}
async function extractImg(file: Blob, user: ReimUser) {
  await getBase64(file).then((res) => {
    user.avatar = res;
  });
}

// status form
const statusForm = reactive<statusFormSchema>({
  id: "",
  status: "",
  reason: ""
});
const statusFormModel = ref<FormInstance>()

const statusDialogRef = ref(false)
const showStatusDialog = (record: any) => {
  statusDialogRef.value = true
  statusForm.reason = record.reason || ''
  statusForm.id = record.id
  statusForm.status = record.status
}
const statusDialogConfirm = async () => {
  await store.apiSetStatus(statusForm)
  statusDialogRef.value = false
  initializeData()
}
const statusDialogCancel = () => {
  statusDialogRef.value = false
  statusForm.reason = ''
  statusForm.id = ''
  statusForm.status = ''
}

</script>
<template>
  <!-- 审核dialog -->
  <a-modal title="Set Status" v-model:visible="statusDialogRef" @ok="statusDialogConfirm" @cancel="statusDialogCancel"
    width="660px">
    <a-form ref="statusFormModel" :model="statusForm" :label-col="{ style: { width: '150px' } }"
      :wrapper-col="{ span: 14 }">
      <a-form-item required label="Status" name="status">
        <a-select style="width: 100%" v-model:value="statusForm.status" :options="ApproveStatusOptions" />
      </a-form-item>
      <a-form-item label="Reason" name="reason">
        <a-textarea v-model:value="statusForm.reason" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal :title="Ctl.isNew ? 'Create' : 'Edit'" v-model:visible="showModal" @ok="submit" @cancel="cancel"
    :ok-button-props="{ disabled: isViewForm }" :cancel-button-props="{ disabled: isViewForm }">
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
      <a-form-item label="Avatar" name="avatar">
        <a-upload :show-upload-list="false" :beforeUpload="(file: File) => extractImg(file, form)">
          <img class="h-8 p-0.5 rounded border border-dashed border-border" v-if="form.avatar" :src="form.avatar" />
          <a-button v-else type="dashed">
            <template #icon>
              <UploadOutlined />
            </template>
            Upload
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="Name" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item required label="E-mail" name="email">
        <a-input v-model:value="form.email" />
      </a-form-item>
      <a-form-item label="Password" name="password">
        <a-input v-model:value="form.password" type="password"/>
      </a-form-item>
      <a-form-item label="Mobile" name="mobile">
        <a-input v-model:value="form.mobile" />
      </a-form-item>
      <a-form-item label="Phone" name="phone">
        <a-input v-model:value="form.phone" />
      </a-form-item>
      <a-form-item label="Worker Id" name="worker">
        <a-input v-model:value="form.worker" />
      </a-form-item>
      <a-form-item label="Staff Id" name="staff">
        <a-input v-model:value="form.staff" />
      </a-form-item>
      <a-form-item label="Role" required name="roles">
        <a-select v-model:value="form.roles" mode="multiple" :options="roleStore.entities"
          :fieldNames="{ label: 'name', value: 'id' }" />
      </a-form-item>
      <a-form-item required label="Status" name="status">
        <a-select style="width: 100%" v-model:value="form.status" :options="ApproveStatusOptions" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" @change="store.changePage" :pagination="{
    current: store.pagination.page, pageSize: store.pagination.pagesize, total: store.pagination.total, showSizeChanger: true, showQuickJumper: true
  }">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>User</h4>
        <div class="flex">
          <div class="mr-4">
            <span class="mr-2">Status</span>
            <a-select ref="select" style="width: 200px" v-model:value="store.queryArgs.status" allowClear>
              <a-select-option :value="item.value" v-for="item in ApproveStatusOptions">{{ item.label }}</a-select-option>
            </a-select>
          </div>
          <a-input v-model:value="searchKeywords" style="width: 240px" class="mr-4" allowClear>
            <template #addonBefore>
              Keywords
            </template>
          </a-input>
          <a-button class="mr-2" @click="onClickSearch">
            <template #icon>
              <SearchOutlined />
            </template>
            Search
          </a-button>
          <a-button type="primary" @click="addNew" :loading="formLoading">
            <template #icon>
              <PlusOutlined />
            </template>
            Create
          </a-button>
        </div>
      </div>
    </template>
    <template #bodyCell="{ column, text, record }">
      <div class="flex items-stretch" v-if="column.dataIndex === 'name'">
        <div class="flex-col flex justify-evenly">
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
        {{ text }}
      </template>
      <template v-else-if="column.dataIndex === 'edit'">
        <a-dropdown>
          <span class="ant-dropdown-link cursor-pointer" @click.prevent>
            <SettingOutlined />
          </span>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0">
                <a @click="view(record)" rel="noopener noreferrer">
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
                <a @click="showStatusDialog(record)" rel="noopener noreferrer">
                  <VerifiedOutlined />
                  Verify
                </a>
              </a-menu-item>
              <a-menu-item key="1">
                <a-popconfirm title="删除" content="确认删除吗？" okText="确认" cancelText="取消" @confirm="deleteRecord(record)">
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
