<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref, toRaw } from 'vue';
import dayjs from 'dayjs';
import { EditOutlined, SearchOutlined, ReadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import {
  VerifyStatuses
} from "@/pages/constants";
import { formatStatusColor } from "@/utils/formatter";
import RemoteSelect from "@/components/remote_select/index.vue"
import { ApproveStatus, ApproveStatusOptions } from "@/utils/constant";
import { ReportStore, Report } from '@/store/report'
import { DayjsDateRangeSchema, statusFormSchema } from '@/types'
import { ReportCategoryStore } from '@/store/category'
import {useRouter} from 'vue-router'
const router = useRouter()
const store = ReportStore()
const categoryStore = ReportCategoryStore()
const searchKeywords = ref('');
const reportTemplateSelectRef = ref(null)
const reportWorkerRef = ref(null)
const reportUsersReviewRef = ref(null)
const reportCompanyReviewRef = ref(null)
const searchDateRangeRef = ref<DayjsDateRangeSchema>()
const columns = [
  {
    title: 'Report',
    dataIndex: 'name',
    fixed: 'left',
    width: 260,
  },
  { title: 'DATE', dataIndex: 'inspect_date', width: 120 },
  { title: 'CUSTOMER', dataIndex: 'company', width: 200 },
  { title: 'WORKERS', dataIndex: 'workers', width: 200 },
  { title: 'CATEGORY', dataIndex: 'category', width: 160 },
  { title: 'STATUS', dataIndex: 'status', width: 80 },
  { title: 'Review', dataIndex: 'approve_status', width: 80 },
  { title: 'OP', dataIndex: 'edit', width: 50 },
];


function addNew() {
  showModal.value = true;
  form._isNew = true;
}

const showModal = ref(false);

const newRecord = (record?: Report) => {
  if (!record) {
    record = { _isNew: true };
  }
  record.name = undefined;
  record.status = '0';
  record.settings = {
    validate_password: false,
    validate_permission: false,
    approve_password: false,
    approve_permission: false,
  }
  return record;
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(target).forEach((key) => (target[key] = source[key]));
};

const form = reactive<Report>(newRecord());

function reset() {
  return newRecord(form);
}

function cancel() {
  showModal.value = false;
  reset();
}

const formModel = ref<FormInstance>();


const formLoading = ref(false);

async function extractImg(file: Blob, record: Report) {
  await getBase64(file).then((res) => {
    record.avatar = res;
  });
}

function submit() {
  formLoading.value = true;
  formModel.value
    ?.validateFields()
    .then(async (res: Report) => {
      let reqData = {
        name: form.name,
        title: form.title,
        summary: form.summary,
        report_template_id: form.report_template_id,
        category_id: form.category_id,
        workers: form.workers,
        users: form.users,
        users_review: form.users_review,
        factory_id: form.factory_id,
        company_id: form.company_id,
        settings: form.settings,
      }
      if (form.order_id) {
        reqData.id = form.id
      }
      await store.apiUpdate(reqData)

      showModal.value = false;
      initializeData()
      reset();
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      formLoading.value = false;
    });
}

const editRecord = ref<Report>();

/**
 * Edit
 * @param record
 */
function edit(record: any) {
  editRecord.value = record;
  copyObject(form, record);
  console.log('record:', toRaw(record))
  console.log('form:', toRaw(form))
  form.id = record.id
  form.order_id = record?.order?.id
  form.name = record?.name
  form.title = record?.title
  form.summary = record?.summary
  form.report_template_id = record?.report_template
  form.workers = record?.workers
  form.users_review = record?.users_review
  form.company_id = record?.company
  form.settings = record?.settings
  if(form.settings.validate_password === undefined) {
    form.settings.validate_password = false
  }
  if(form.settings.validate_permission === undefined) {
    form.settings.validate_permission = false
  }
  if(form.settings.approve_password === undefined) {
    form.settings.approve_password = false
  }
  if(form.settings.approve_permission === undefined) {
    form.settings.approve_permission = false
  }
  showModal.value = true;
  setTimeout(async () => {
    console.log('company_id:', form.company_id)
    reportCompanyReviewRef.value?.getEntity([form.company_id])
    await reportTemplateSelectRef.value?.getEntity([form.report_template_id])
    await reportWorkerRef.value?.getEntity(form.workers)
    console.log('users_review:', form.users_review)
    await reportUsersReviewRef.value?.getEntity(form.users_review)
  }, 1000)
}

const deleteRecord = async (record: Report) => {
  console.log('record:', record)
  await store.apiDelete(record.id)
  initializeData()
}


const onClickSearch = async () => {
  store.queryArgs.keyword = searchKeywords.value
  console.log('store.queryArgs.keyword:', store.queryArgs.keyword)
  if (searchDateRangeRef.value) {
    store.queryArgs.inspect_start = searchDateRangeRef.value[0].format('YYYY-MM-DD')
    store.queryArgs.inspect_end = searchDateRangeRef.value[1].format('YYYY-MM-DD')
  }
  store.apiQuery()
}


const initializeData = async () => {
  await store.apiQuery()
  await categoryStore.apiQueryParent()
}

// status form
const statusForm = reactive<statusFormSchema>({
  id: "",
  status: "",
  reason: ""
});
const statusFormModel = ref<FormInstance>()

const statusDialogRef = ref(false)
const showStatusDialog = (record: Report) => {
  statusDialogRef.value = true
  statusForm.reason = record.reason || ''
  statusForm.id = record.id
  statusForm.status = record.status
}
const statusDialogConfirm = async () => {
  await store.apiSetStatus(statusForm)
}
const statusDialogCancel = () => {
  statusDialogRef.value = false
  statusForm.reason = ''
  statusForm.id = ''
  statusForm.status = ''
}


const goPublicFillReport = (report:any) => {
  console.log('form:', toRaw(form))
  let url = router.resolve({
    name: 'report_fill',
    params: {
      reportId: report.id
    }
  })
  console.log('url:', url.href)
  window.open(url.href, '_blank')

}

initializeData()

</script>
<template>
  <!-- <a-modal :title="form._isNew ? 'Create' : 'Edit'" v-model:visible="showModal" @ok="submit" @cancel="cancel" width="660px">
    <a-form ref="formModel" :model="form" :label-col="{ style: { width: '150px' } }" :wrapper-col="{ span: 14 }">
      <a-form-item label="Name" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item required label="Status" name="status">
        <a-select style="width: 100%" v-model:value="form.status" :options="ApproveStatusOptions"/>
      </a-form-item>
      <a-form-item label="Inspect Date" name="inspect_date">
        <a-date-picker v-model:value="form.inspect_date" style="width: 100%" />
      </a-form-item>
      <a-form-item label="Category" name="category">
        <a-select v-model:value="form.category">
          <a-select-option  :value="c.id" v-for="c in categories">{{ c.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Workers" name="workers">
        <RemoteSelect type="worker" v-model:value="form.workers" :rows="workers" searchKey="name" :isMultiple="true"/>
      </a-form-item>
      <a-form-item label="Customer" name="customer">
        <RemoteSelect type="customer" v-model:value="form.customer" :rows="customers" searchKey="name"/>
      </a-form-item>
      <a-form-item label="Factory" name="factory">
        <RemoteSelect type="factory" v-model:value="form.factory" :rows="factories" searchKey="name" />
      </a-form-item>
      <a-form-item label="Category" name="category">
        <a-tree-select v-model:value="store.queryArgs.category_id" show-search style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allow-clear
          tree-default-expand-all :tree-data="categoryStore.entities" :field-names="{
            children: 'children',
            label: 'name',
            value: 'id',
          }" tree-node-filter-prop="name">
        </a-tree-select>
      </a-form-item>
      <a-form-item label="Template" name="report_template">
        <RemoteSelect type="template" v-model:value="form.report_template" searchKey="name" />
      </a-form-item>
    </a-form>
  </a-modal> -->

  <a-modal :title="form._isNew ? 'Create' : 'Edit'" v-model:visible="showModal" @ok="submit" @cancel="cancel"
    width="660px">
    <a-form ref="formModel" :model="form" :label-col="{ style: { width: '150px' } }" :wrapper-col="{ span: 14 }">
      <a-form-item required label="Name" name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="Title" name="title">
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item label="Summary" name="summary">
        <a-textarea v-model:value="form.summary" />
      </a-form-item>
      <a-form-item label="Order ID" name="order">
        <a-input v-model:value="form.order_id" />
      </a-form-item>
      <hr />
      <a-form-item label="Fill by password" name="validate_password">
        <a-switch v-model:checked="form.settings.validate_password" />
      </a-form-item>
      <a-form-item label="Fill by permission" name="validate_permission">
        <a-switch v-model:checked="form.settings.validate_permission" />
      </a-form-item>
      <a-form-item label="Review by password" name="approve_password">
        <a-switch v-model:checked="form.settings.approve_password" />
      </a-form-item>
      <a-form-item label="Review by permission" name="approve_permission">
        <a-switch v-model:checked="form.settings.approve_permission" />
      </a-form-item>
      <hr />
      <a-form-item label="Template" name="report_template">
        <RemoteSelect ref="reportTemplateSelectRef" type="report_template" v-model:value="form.report_template_id"
          searchKey="name" />
      </a-form-item>
      <a-form-item label="Workers" name="workers">
        <RemoteSelect ref="reportWorkerRef" type="worker" v-model:value="form.workers" :isMultiple="true"
          searchKey="name" />
      </a-form-item>
      <a-form-item label="Customer" name="users_review">
        <RemoteSelect ref="reportUsersReviewRef" type="customer" v-model:value="form.users_review" :isMultiple="true"
          searchKey="name" />
      </a-form-item>
      <a-form-item label="Company" name="company">
        <RemoteSelect ref="reportCompanyReviewRef" type="company" v-model:value="form.company_id"
          searchKey="name" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 审核dialog -->
  <a-modal title="Set Status" v-model:visible="statusDialogRef" @ok="statusDialogConfirm" @cancel="statusDialogCancel"
    width="660px">
    <a-form ref="statusFormModel" :model="statusForm" :label-col="{ style: { width: '150px' } }" :wrapper-col="{ span: 14 }">
      <a-form-item required label="Status" name="status">
        <a-select style="width: 100%" v-model:value="statusForm.status" :options="ApproveStatusOptions" />
      </a-form-item>
      <a-form-item label="Reason" name="reason">
        <a-textarea v-model:value="statusForm.reason" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 成员表格 -->
  <div style="width: 100%">
    <a-table v-bind="$attrs" :loading="store.loading" :columns="columns" :dataSource="store.entities" :pagination="{
      current: store.pagination.page, pageSize: store.pagination.pagesize, total: store.pagination.total, showSizeChanger: true, showQuickJumper: true
    }" :scroll="{ y: 600 }">
      <template #title>
        <div class="">
          <h4>Report</h4>
          <a-row type="flex" style="width: 100%" :gutter="[16, 16]">
            <a-col :span="6">
              <div>
                <span class="mr-2">Date</span>
                <div><a-range-picker v-model:value="searchDateRangeRef" allowClear style="width: 100%;" /></div>
              </div>
            </a-col>
            <a-col :span="6">
              <div>
                <span class="mr-2">Customer</span>
                <a-input v-model:value="store.queryArgs.company_name" allowClear>
                </a-input>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="">
                <span class="mr-2">Workers</span>
                <a-input v-model:value="store.queryArgs.worker_name" allowClear>
                </a-input>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="">
                <span class="mr-2">Status</span>
                <div>
                  <a-select class="w-full" ref="select" v-model:value="store.queryArgs.status" allowClear>
                    <a-select-option :value="item.value" v-for="item in ApproveStatusOptions">{{ item.label
                    }}</a-select-option>
                  </a-select>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row type="flex" style="width: 100%;margin-top:10px;" :gutter="[16, 16]">
            <a-col :span="6">
              <div class="mr-2">Category</div>
              <a-tree-select v-model:value="store.queryArgs.category_id" show-search style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allow-clear
                tree-default-expand-all :tree-data="categoryStore.entities" :field-names="{
                  children: 'children',
                  label: 'name',
                  value: 'id',
                }" tree-node-filter-prop="name">
              </a-tree-select>
            </a-col>
            <a-col :span="6">

            </a-col>
            <a-col :span="6">

            </a-col>
            <a-col :span="6">
              <a-button type="primary" @click="addNew" :loading="formLoading" style="float: right;">
                <template #icon>
                  <PlusOutlined />
                </template>
                Create
              </a-button>
              <a-button class="mr-2" @click="onClickSearch" style="float: right;">
                <template #icon>
                  <SearchOutlined />
                </template>
                Search
              </a-button>

            </a-col>
          </a-row>
        </div>
      </template>
      <template #bodyCell="{ column, text, record }">
        <div class="flex items-stretch" v-if="column.dataIndex === 'name'">
          <div class="flex-col flex justify-evenly">
            <span class="text-title font-bold">{{ text }}</span>
          </div>
        </div>
        <div class="" v-else-if="column.dataIndex === 'company'">
          <div class="text-title font-bold" v-if="record.order">
            {{ record.order_data.company.shortname }}
          </div>
          <div class="text-title font-bold" v-else>
            {{ record.company.shortname }}
          </div>
        </div>
        <div class="" v-else-if="column.dataIndex === 'workers'">
          <div class="text-title font-bold" v-if="record.order">
            {{ record.order_data.workers }}
          </div>
          <div class="text-title font-bold" v-else>
            {{ record.workers }}
          </div>
        </div>
        <div class="" v-else-if="column.dataIndex === 'category'">
          <div class="text-title font-bold" v-if="record.order">
            {{ record.order_data.category.name }}
          </div>
          <div class="text-title font-bold" v-else>
            {{ record.workers }}
          </div>
        </div>
        <template v-else-if="column.dataIndex === 'status'">
          <a-badge class="text-subtext" :color="formatStatusColor(text)">
            <template #text>
              <span class="text-subtext">{{ VerifyStatuses[text] }}</span>
            </template>
          </a-badge>
        </template>
        <template v-else-if="column.dataIndex === 'approve_status'">
          <a-badge class="text-subtext" :color="formatStatusColor(text)">
            <template #text>
              <span class="text-subtext">{{ VerifyStatuses[text] }}</span>
            </template>
          </a-badge>
        </template>
        <template v-else-if="column.dataIndex === 'inspect_date'">
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
                  <a-popconfirm title="Delete" content="Confirm delete?" okText="Yes" cancelText="Cancel"
                    @confirm="deleteRecord(record)">
                    <a rel="noopener noreferrer">
                      <DeleteOutlined />
                      Delete
                    </a>
                  </a-popconfirm>

                </a-menu-item>
                <a-menu-item key="1">
                  <a @click="showStatusDialog(record)" rel="noopener noreferrer">
                    <VerifiedOutlined />
                    Verify
                  </a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a @click="goPublicFillReport(record)" rel="noopener noreferrer">
                    <VerifiedOutlined />
                    Public View
                  </a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a @click="edit(record)" rel="noopener noreferrer">
                    <MailOutlined />
                    Send to Customer
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
  </div>
</template>
