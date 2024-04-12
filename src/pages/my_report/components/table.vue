<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref, toRaw } from 'vue';
import dayjs from 'dayjs';
import { EditOutlined, SearchOutlined, ReadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { formatStatusColor } from "@/utils/formatter";
import RemoteSelect from "@/components/remote_select/index.vue"
import { ApproveStatus, ApproveStatusOptions } from "@/utils/constant";
import { Report } from '@/store/report'
import { MyReportStore as ReportStore } from '@/store/my_report'
import { DayjsDateRangeSchema, statusFormSchema } from '@/types'
import { ReportCategoryStore } from '@/store/category'
import {useRouter} from 'vue-router'
import {i18n} from "@/lang/i18n"
import {openNewUrl} from "@/utils/helpers"
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
    title: i18n.global.t('base.Report'),
    dataIndex: 'name',
    fixed: 'left',
    width: 260,
  },
  { title: i18n.global.t('base.Date'), dataIndex: 'inspect_date', width: 120 },
  { title: i18n.global.t('base.Customer'), dataIndex: 'company', width: 200 },
  { title: i18n.global.t('base.Workers'), dataIndex: 'workers', width: 200 },
  { title: i18n.global.t('base.Category'), dataIndex: 'category', width: 160 },
  { title: i18n.global.t('base.Status'), dataIndex: 'status', width: 120 },
  { title: i18n.global.t('base.Review'), dataIndex: 'approve_status', width: 120 },
  { title: i18n.global.t('base.OP'), dataIndex: 'edit', width: 80 },
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
    validate_password: true,
    validate_permission: true,
    approve_password: true,
    approve_permission: true,
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
      if (form.id) {
        reqData.id = form.id
      }
      if(form.order_id) {
        reqData.order_id = form.order_id
      }
      if(form.id) {
        await store.apiUpdate(reqData)
      } else {
        await store.apiSave(reqData)
      }


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


const goPublicReviewReport = (report:any) => {
  console.log('form:', toRaw(form))
  openNewUrl(router, {
    name: 'report_review',
    params: {
      reportId: report.id
    }
  })
}


initializeData()

</script>
<template>
  <a-modal :title="form._isNew ? $t('base.Create') : $t('base.Edit')" v-model:visible="showModal" @ok="submit" @cancel="cancel"
    width="660px">
    <a-form ref="formModel" :model="form" :label-col="{ style: { width: '150px' } }" :wrapper-col="{ span: 14 }">
      <a-form-item required :label="$t('base.Name')" name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item :label="$t('base.Title')" name="title">
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item :label="$t('base.Summary')" name="summary">
        <a-textarea v-model:value="form.summary" />
      </a-form-item>
      <a-form-item :label="$t('base.OrderID')" name="order">
        <a-input v-model:value="form.order_id" />
      </a-form-item>
      <!-- <hr />
      <a-form-item :label="$t('base.FillByPassword')" name="validate_password">
        <a-switch v-model:checked="form.settings.validate_password" />
      </a-form-item>
      <a-form-item :label="$t('base.FillByPermission')" name="validate_permission">
        <a-switch v-model:checked="form.settings.validate_permission" />
      </a-form-item>
      <a-form-item :label="$t('base.ReviewByPassword')" name="approve_password">
        <a-switch v-model:checked="form.settings.approve_password" />
      </a-form-item>
      <a-form-item :label="$t('base.ReviewByPermission')" name="approve_permission">
        <a-switch v-model:checked="form.settings.approve_permission" />
      </a-form-item> -->
      <hr />
      <a-form-item :label="$t('base.Template')" name="report_template_id" required>
        <RemoteSelect ref="reportTemplateSelectRef" type="report_template" v-model:value="form.report_template_id"
          searchKey="name" />
      </a-form-item>
      <a-form-item :label="$t('base.Workers')" name="workers">
        <RemoteSelect ref="reportWorkerRef" type="worker" v-model:value="form.workers" :isMultiple="true"
          searchKey="name" />
      </a-form-item>
      <a-form-item :label="$t('base.Customer')" name="users_review">
        <RemoteSelect ref="reportUsersReviewRef" type="customer" v-model:value="form.users_review" :isMultiple="true"
          searchKey="name" />
      </a-form-item>
      <a-form-item :label="$t('base.Company')" name="company">
        <RemoteSelect ref="reportCompanyReviewRef" type="company" v-model:value="form.company_id"
          searchKey="name" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 审核dialog -->
  <a-modal :title="$t('base.SetStatus')" v-model:visible="statusDialogRef" @ok="statusDialogConfirm" @cancel="statusDialogCancel"
    width="660px">
    <a-form ref="statusFormModel" :model="statusForm"  layout="vertical">
      <a-form-item required :label="$t('base.Status')" name="status">
        <a-select style="width: 100%" v-model:value="statusForm.status" :options="ApproveStatusOptions" />
      </a-form-item>
      <a-form-item :label="$t('base.Reason')" name="reason">
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
          <h4>{{ $t('base.Report') }}</h4>
          <a-row type="flex" style="width: 100%" :gutter="[16, 16]">
            <a-col :span="6">
              <div>
                <span class="mr-2">{{ $t('base.Date') }}</span>
                <div><a-range-picker v-model:value="searchDateRangeRef" allowClear style="width: 100%;" /></div>
              </div>
            </a-col>
            <a-col :span="6">
              <div>
                <span class="mr-2">{{ $t('base.Customer') }}</span>
                <a-input v-model:value="store.queryArgs.company_name" allowClear>
                </a-input>
              </div>
            </a-col>
            <a-col :span="6">
              <!-- <div class="">
                <span class="mr-2">{{ $t('base.Workers') }}</span>
                <a-input v-model:value="store.queryArgs.worker_name" allowClear>
                </a-input>
              </div> -->
              <div class="mr-2">{{ $t('base.Category') }}</div>
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
              <div class="">
                <span class="mr-2">{{ $t('base.Status') }}</span>
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

            </a-col>
            <a-col :span="6">

            </a-col>
            <a-col :span="6">

            </a-col>
            <a-col :span="6">
              <a-button @click="onClickSearch" style="float: right;">
                <template #icon>
                  <SearchOutlined />
                </template>
                {{ $t('base.Search') }}
              </a-button>

            </a-col>
          </a-row>
        </div>
      </template>
      <template #bodyCell="{ column, text, record }">
        <div class="flex items-stretch" v-if="column.dataIndex === 'name'">
          <div class="flex-col flex justify-evenly">
            <span class="text-title font-bold">{{ text }}</span>
            <span class="text-title cursor-pointer template-name">{{ record?.template?.name }}</span>
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
              <span class="text-subtext">{{ ApproveStatus[text] }}</span>
            </template>
          </a-badge>
        </template>
        <template v-else-if="column.dataIndex === 'approve_status'">
          <a-badge class="text-subtext" :color="formatStatusColor(text)">
            <template #text>
              <span class="text-subtext">{{ ApproveStatus[text] }}</span>
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
                <a-menu-item key="2">
                  <a @click="goPublicReviewReport(record)" rel="noopener noreferrer">
                    <VerifiedOutlined />
                    {{ $t('base.PublicView') }}
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


<style scoped>
.template-name {
  color: #999;
  cursor: pointer;
  font-size: 80%;
}
</style>