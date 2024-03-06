<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref, toRaw } from 'vue';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { EditOutlined, DeleteOutlined, ExperimentOutlined, SettingOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import { ApproveStatusOptions, ApproveStatus } from "@/utils/constant"
import { ReportCompanyContactStore, ReportCompanyContact } from "@/store/company_contact"
import { ReportCompanyStore } from "@/store/company"
import { paginationConfig } from 'ant-design-vue/lib/pagination';
import { getSessionInfo } from '@/utils/session'
import RemoteSelect from '@/components/remote_select/index.vue'
const isViewForm = ref(false)
const store = ReportCompanyContactStore()
const companyStore = ReportCompanyStore()
const searchKeywords = ref("")
const companyRemoteSelectRef = ref(null)
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'E-mail',
    dataIndex: 'email',
  },
  { title: 'Status', dataIndex: 'status' },
  { title: 'Create at', dataIndex: 'create_at' },
  { title: 'OP', dataIndex: 'edit', width: 40 },
];


const Ctl = reactive({
  records: [] as ReportCompanyContact[],
  page: 1,
  pagesize: 10,
  total: 0,
  isNew: false
});

const createTimeRef = ref<Dayjs>(dayjs());


const initializeData = async () => {
  let result = await store.apiQuery()
  companyStore.pagination.page = 1
  companyStore.pagination.pagesize = 10
  let companyResult = await companyStore.apiQuery()
  console.log('companyResult:', companyResult)
}

initializeData()

function addNew() {
  isViewForm.value = false
  showModal.value = true;
  Ctl.isNew = true;
}

const showModal = ref(false);

const newReportCompanyContact = (reportCompanyContact?: ReportCompanyContact) => {
  createTimeRef.value = dayjs()
  let create_at = createTimeRef.value.format('YYYY-MM-DD HH:mm:ss')
  if (!reportCompanyContact) {

    return <ReportCompanyContact>{
      id: '',
      email: '',
      mobile: '',
      phone: '',
      name: '',
      remark: '',
      company_id: '',
      status: '1',
      create_at: create_at
    }
  } else {
    reportCompanyContact.name = '';
    reportCompanyContact.email = '';
    reportCompanyContact.mobile = '';
    reportCompanyContact.phone = '';
    reportCompanyContact.remark = '';
    reportCompanyContact.company_id = '';
    reportCompanyContact.status = '1';
    reportCompanyContact.create_at = create_at;
    return reportCompanyContact;
  }
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(source).forEach((key) => (target[key] = source[key]));
};

const form = reactive<ReportCompanyContact>(newReportCompanyContact());
console.log('form:', form)
function reset() {
  return newReportCompanyContact(form);
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
    mobile: form.mobile,
    phone: form.phone,
    remark: form.remark,
    company_id: form.company_id,
    status: form.status,
    org_id: session.user_data.org_id,
    is_customer: true
  }
  formModel.value
    ?.validateFields()
    .then(async (res: ReportCompanyContact) => {
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

const editRecord = ref<ReportCompanyContact>();

/**
 * 编辑
 * @param record
 */
function edit(record: ReportCompanyContact) {
  isViewForm.value = false
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  if(record?.company?.id) {
    form.company_id = record.company.id
  }
  showModal.value = true;
  setTimeout(() => {
      companyRemoteSelectRef.value?.getEntity([form.company_id])
    }, 1000)
}
function view(record: ReportCompanyContact) {
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  isViewForm.value = true
  showModal.value = true;
}


const goDesign = (record: ReportCompanyContact) => {
  router.push({
    name: 'design',
    query: {
      id: record.id,
    },
  });
}

const deleteRecord = async (record: ReportCompanyContact) => {
  console.log('record:', record)
  // await db.delReportCompanyContact(record.id)
  initializeData()
}

const onClickSearch = async () => {
  store.queryArgs.keyword = searchKeywords.value
  console.log('store.queryArgs.keyword:', store.queryArgs.keyword)
  store.apiQuery()
}
async function extractImg(file: Blob, Company: ReportCompanyContact) {
  await getBase64(file).then((res) => {
    Company.avatar = res;
  });
}

</script>
<template>
  <a-modal :title="Ctl.isNew ? 'Create' : 'Edit'" v-model:visible="showModal" @ok="submit" @cancel="cancel"
    :ok-button-props="{ disabled: isViewForm }" :cancel-button-props="{ disabled: isViewForm }">
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
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
      <a-form-item label="Company" name="company_id" required>
        <RemoteSelect ref="companyRemoteSelectRef" type="company" v-model:value="form.company_id" searchKey="name" />
      </a-form-item>
      <a-form-item required label="Status" name="status">
        <a-select style="width: 100%" v-model:value="form.status" :options="ApproveStatusOptions" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities"
    @change="store.changePage" :pagination="{
      current: store.pagination.page, pageSize: store.pagination.pagesize, total: store.pagination.total, showSizeChanger: true, showQuickJumper: true
    }">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>Company Contact</h4>
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
