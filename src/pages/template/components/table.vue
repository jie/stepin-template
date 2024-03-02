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
import { ReportTemplateStore } from "@/store/reportTemplate"
import { Report } from '@/pages/constants';
import { statusFormSchema } from "@/types"
const isViewForm = ref(false)
const store = ReportTemplateStore()
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

type ReportTemplate = {
  id?: string;
  name?: string;
  status?: string;
  create_at?: string;
};

const Ctl = reactive({
  records: [] as ReportTemplate[],
  page: 1,
  pagesize: 10,
  total: 0,
  isNew: false
});

const createTimeRef = ref<Dayjs>(dayjs());


const initializeData = async () => {
  let result = await store.apiQuery()
  console.log('result:', result)

}

initializeData()

function addNew() {
  isViewForm.value = false
  showModal.value = true;
  Ctl.isNew = true;
}

const showModal = ref(false);

const newReportTemplate = (reportTemplate?: ReportTemplate) => {
  createTimeRef.value = dayjs()
  let create_at = createTimeRef.value.format('YYYY-MM-DD HH:mm:ss')
  if (!reportTemplate) {

    return <ReportTemplate>{
      id: '',
      name: '',
      status: '1',
      create_at: create_at
    }
  } else {
    reportTemplate.name = '';
    reportTemplate.status = '1';
    reportTemplate.create_at = create_at;
    return reportTemplate;
  }
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(source).forEach((key) => (target[key] = source[key]));
};

const form = reactive<ReportTemplate>(newReportTemplate());
console.log('form:', form)
function reset() {
  return newReportTemplate(form);
}

function cancel() {
  showModal.value = false;
  reset();
}

const formModel = ref<FormInstance>();

const formLoading = ref(false);


async function submit() {
  formLoading.value = true;
  formModel.value
    ?.validateFields()
    .then(async (res: ReportTemplate) => {
      if (Ctl.isNew === true) {
        await store.apiSave({ name: form.name, status: form.status })
      } else {
        await store.apiUpdate({ id: form.id, name: form.name, status: form.status })
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

const editRecord = ref<ReportTemplate>();

/**
 * 编辑
 * @param record
 */
function edit(record: ReportTemplate) {
  isViewForm.value = false
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  showModal.value = true;
}
function view(record: ReportTemplate) {
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  isViewForm.value = true
  showModal.value = true;
}


const goDesign = (record: ReportTemplate) => {
  router.push({
    name: 'design',
    query: {
      id: record.id,
    },
  });
}

const deleteRecord = async (record: ReportTemplate) => {
  console.log('record:', record)
  await store.apiDelete(record.id)
  initializeData()
}

const onClickSearch = async () => {
  store.queryArgs.keyword = searchKeywords.value
  console.log('store.queryArgs.keyword:', store.queryArgs.keyword)
  store.apiQuery()
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
      <a-form-item label="Name" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" @change="store.changePage" :pagination="{
    current: store.pagination.page, pageSize: store.pagination.pagesize, total: store.pagination.total, showSizeChanger: true, showQuickJumper: true
  }">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>Templates</h4>
        <div class="flex">
          <div class="mr-4">
            <span class="mr-2">Status {{ store.queryArgs.status }}</span>
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
              <a-menu-item key="4">
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
                <a-popconfirm title="Delete" content="Confirm delete?" okText="Yes" cancelText="No" @confirm="deleteRecord(record)">
                  <a rel="noopener noreferrer">
                    <DeleteOutlined />
                    Delete
                  </a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item key="2">
                <a @click="showStatusDialog(record)" rel="noopener noreferrer">
                  <VerifiedOutlined />
                  Verify
                </a>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3">
                <a @click="goDesign(record)" rel="noopener noreferrer">
                  <ExperimentOutlined />
                  Template Design
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
