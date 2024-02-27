<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref, toRaw } from 'vue';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { EditOutlined, DeleteOutlined, ExperimentOutlined, SettingOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import { db } from '@/hook/dexie_hook'
import { ApproveStatusOptions, ApproveStatus } from "@/utils/constant"
import { ReportUserStore, ReportUser } from "@/store/user"
import { ReportRoleStore } from "@/store/role"
import {getSessionInfo} from '@/utils/session'
const isViewForm = ref(false)
const userStore = ReportUserStore()
const roleStore = ReportRoleStore()
const searchKeywords = ref("")
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  { title: 'Status', dataIndex: 'status' },
  { title: 'Create at', dataIndex: 'create_at' },
  { title: 'OP', dataIndex: 'edit', width: 40 },
];


const Ctl = reactive({
  records: [] as ReportUser[],
  page: 1,
  pagesize: 10,
  total: 0,
  isNew: false
});

const createTimeRef = ref<Dayjs>(dayjs());


const initializeData = async () => {
    let result = await userStore.apiQueryReportUser()
    console.log('result:', result)
    roleStore.pagination = { page: 1, pagesize: 1000 }
    roleStore.apiQueryReportRole()
}

initializeData()

function addNew() {
  isViewForm.value = false
  showModal.value = true;
  Ctl.isNew = true;
}

const showModal = ref(false);

const newReportUser = (reportUser?: ReportUser) => {
  createTimeRef.value = dayjs()
  let create_at = createTimeRef.value.format('YYYY-MM-DD HH:mm:ss')
  if (!reportUser) {

    return <ReportUser>{
      id: '',
      name: '',
      email: '',
      phone: '',
      mobile: '',
      remark: '',
      avatar: '',
      roles: [],
      status: '1',
      create_at: create_at
    }
  } else {
    reportUser.name = '';
    reportUser.email = '';
    reportUser.phone = '';
    reportUser.mobile = '';
    reportUser.name = '';
    reportUser.remark = '';
    reportUser.avatar = '';
    reportUser.status = '1';
    reportUser.roles = [];
    reportUser.create_at = create_at;
    return reportUser;
  }
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(source).forEach((key) => (target[key] = source[key]));
};

const form = reactive<ReportUser>(newReportUser());
console.log('form:', form)
function reset() {
  return newReportUser(form);
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
    remark: form.remark,
    status: form.status,
    avatar: form.avatar,
    roles: form.roles,
    org_id:session.user_data.org_id,
  } 
  formModel.value
    ?.validateFields()
    .then(async (res: ReportUser) => {
      if (Ctl.isNew === true) {

        // await db.addReportTemplate({
        //   name: form.name,
        //   status: form.status,
        //   create_at: form.create_at
        // })
        await userStore.apiSaveReportUser(formValue)

      } else {
        // console.log('form:', form)
        // await db.updateReportTemplate({
        //   id: form.id,
        //   name: form.name,
        //   status: form.status,
        //   create_at: form.create_at
        // })
        await userStore.apiUpdateReportUser({id: form.id, ...formValue})
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

const editRecord = ref<ReportUser>();

/**
 * 编辑
 * @param record
 */
function edit(record: ReportUser) {
  isViewForm.value = false
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  showModal.value = true;
}
function view(record: ReportUser) {
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  isViewForm.value = true
  showModal.value = true;
}


const goDesign = (record: ReportUser) => {
  router.push({
    name: 'design',
    query: {
      id: record.id,
    },
  });
}

const deleteRecord = async (record: ReportUser) => {
  console.log('record:', record)
  // await db.delReportUser(record.id)
  initializeData()
}

const onClickSearch = async () => {
  userStore.queryArgs.keyword = searchKeywords.value
  console.log('userStore.queryArgs.keyword:', userStore.queryArgs.keyword)
  userStore.apiQueryReportUser()
}
async function extractImg(file: Blob, user: ReportUser) {
    await getBase64(file).then((res) => {
      user.avatar = res;
    });
  }

</script>
<template>
  <a-modal :title="Ctl.isNew ? 'Create' : 'Edit'" v-model:visible="showModal" @ok="submit" @cancel="cancel"
  
      :ok-button-props="{ disabled: isViewForm }"
      :cancel-button-props="{ disabled: isViewForm }"
  >
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
      <a-form-item label="Mobile" name="mobile">
        <a-input v-model:value="form.mobile" />
      </a-form-item>
      <a-form-item label="Phone" name="phone">
        <a-input v-model:value="form.phone" />
      </a-form-item>
      <a-form-item label="Role" required name="roles">
        <a-select v-model:value="form.roles" mode="multiple" :options="roleStore.entities" :fieldNames="{label: 'name', value: 'id'}"/>
      </a-form-item>
      <a-form-item required label="Status" name="status">
        <a-select
          style="width: 100%"
          v-model:value="form.status"
          :options="ApproveStatusOptions"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="userStore.entities" @change="userStore.changePage" :pagination="{
    current: userStore.pagination.page, pageSize: userStore.pagination.pagesize, total: userStore.pagination.total, showSizeChanger:true, showQuickJumper: true} ">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>Templates</h4>
        <div class="flex">
          <div class="mr-4">
            <span class="mr-2">Status</span>
            <a-select ref="select" style="width: 200px" v-model:value="userStore.queryArgs.status" allowClear>
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
          <span class="text-title font-bold">{{  text }}</span>
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
