<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref, toRaw } from 'vue';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { EditOutlined, DeleteOutlined, ExperimentOutlined, SettingOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import { ApproveStatusOptions, ApproveStatus } from "@/utils/constant"
import { ReportFactoryStore, ReportFactory } from "@/store/factory"
import {getSessionInfo} from '@/utils/session'
const isViewForm = ref(false)
const store = ReportFactoryStore()
const searchKeywords = ref("")
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Shortcut',
    dataIndex: 'shortname',
  },
  { title: 'Status', dataIndex: 'status' },
  { title: 'Create at', dataIndex: 'create_at' },
  { title: 'OP', dataIndex: 'edit', width: 40 },
];


const Ctl = reactive({
  records: [] as ReportFactory[],
  page: 1,
  pagesize: 10,
  total: 0,
  isNew: false
});

const createTimeRef = ref<Dayjs>(dayjs());


const initializeData = async () => {
    let result = await store.apiQuery()
}

initializeData()

function addNew() {
  isViewForm.value = false
  showModal.value = true;
  Ctl.isNew = true;
}

const showModal = ref(false);

const newReportFactory = (reportFactory?: ReportFactory) => {
  createTimeRef.value = dayjs()
  let create_at = createTimeRef.value.format('YYYY-MM-DD HH:mm:ss')
  if (!reportFactory) {

    return <ReportFactory>{
      id: '',
      shortname: '',
      name: '',
      remark: '',
      status: '1',
      create_at: create_at
    }
  } else {
    reportFactory.name = '';
    reportFactory.shortname = '';
    reportFactory.remark = '';
    reportFactory.status = '1';
    reportFactory.create_at = create_at;
    return reportFactory;
  }
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(source).forEach((key) => (target[key] = source[key]));
};

const form = reactive<ReportFactory>(newReportFactory());
console.log('form:', form)
function reset() {
  return newReportFactory(form);
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
    shortname: form.shortname,
    remark: form.remark,
    status: form.status,
    org_id:session.user_data.org_id,
    is_factory: true
  }
  formModel.value
    ?.validateFields()
    .then(async (res: ReportFactory) => {
      if (Ctl.isNew === true) {
        await store.apiSave(formValue)
      } else {
        await store.apiUpdate({id: form.id, ...formValue})
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

const editRecord = ref<ReportFactory>();

/**
 * 编辑
 * @param record
 */
function edit(record: ReportFactory) {
  isViewForm.value = false
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  showModal.value = true;
}
function view(record: ReportFactory) {
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  isViewForm.value = true
  showModal.value = true;
}


const goDesign = (record: ReportFactory) => {
  router.push({
    name: 'design',
    query: {
      id: record.id,
    },
  });
}

const deleteRecord = async (record: ReportFactory) => {
  console.log('record:', record)
  await store.apiDelete(record.id)
  initializeData()
}

const onClickSearch = async () => {
  store.queryArgs.keyword = searchKeywords.value
  console.log('store.queryArgs.keyword:', store.queryArgs.keyword)
  store.apiQuery()
}
async function extractImg(file: Blob, Factory: ReportFactory) {
    await getBase64(file).then((res) => {
      Factory.avatar = res;
    });
  }

</script>
<template>
  <a-modal :title="Ctl.isNew ? 'Create' : 'Edit'" v-model:visible="showModal" @ok="submit" @cancel="cancel"
  
      :ok-button-props="{ disabled: isViewForm }"
      :cancel-button-props="{ disabled: isViewForm }"
  >
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
      <a-form-item label="Name" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="Shortcut" required name="shortname">
        <a-input v-model:value="form.shortname" />
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
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" @change="store.changePage" :pagination="{
    current: store.pagination.page, pageSize: store.pagination.pagesize, total: store.pagination.total, showSizeChanger:true, showQuickJumper: true} ">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>Factory</h4>
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
