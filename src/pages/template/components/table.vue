<script lang="ts" setup>
import { FormInstance } from 'ant-design-vue';
import { reactive, ref, toRaw } from 'vue';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { EditOutlined, DeleteOutlined, ExperimentOutlined, SettingOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import { ApproveStatusOptions, ApproveStatus } from "@/utils/constant"
import { ReportTemplateStore, ReportTemplate } from "@/store/reportTemplate"
import { ReportConfigStore } from '@/store/config';
import { ReportCategoryStore } from "@/store/category"
import { statusFormSchema } from "@/types"
import {i18n} from "@/lang/i18n"
const isViewForm = ref(false)
const store = ReportTemplateStore()
const categoryStore = ReportCategoryStore()
const configStore = ReportConfigStore()
const searchKeywords = ref("")
const columns = [
  {
    title: i18n.global.t('base.Name'),
    dataIndex: 'name',
  },
  {
    title: i18n.global.t('base.Language'),
    dataIndex: 'language',
  },
  {
    title: i18n.global.t('base.Category'),
    dataIndex: 'category',
  },
  { title: i18n.global.t('base.Status'), dataIndex: 'status' },
  { title: i18n.global.t('base.CreateAt'), dataIndex: 'create_at' },
  { title: i18n.global.t('base.OP'), dataIndex: 'edit', width: 80 },
];


const Ctl = reactive({
  records: [] as ReportTemplate[],
  page: 1,
  pagesize: 10,
  total: 0,
  isNew: false,
  languages: [],
});

const createTimeRef = ref<Dayjs>(dayjs());



const initializeData = async () => {
  let result = await store.apiQuery()
  console.log('result:', result)
  await categoryStore.apiQueryParent(true)
  console.log('categoryStore.entities:', toRaw(categoryStore.entities))
  let languageConfig = await configStore.apiGetByKey("LANGUAGE")
  console.log('languageConfig:', toRaw(languageConfig))
  let languages = JSON.parse(languageConfig.entity.value)
  Ctl.languages = languages.map((item: any) => {
    return {
      label: item.name,
      value: item.code
    }
  })
  console.log('languageConfig:', toRaw(Ctl.languages))
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
      language: '',
      category_id: '',
      status: '1',
      create_at: create_at
    }
  } else {
    reportTemplate.name = '';
    reportTemplate.language = '';
    reportTemplate.category_id = '';
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
        await store.apiSave({ name: form.name, category_id: form.category_id ,status: form.status, language: form.language})
      } else {
        await store.apiUpdate({ id: form.id, name: form.name, category_id: form.category_id, status: form.status, language: form.language})
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

const getLanguage = (code: string) => {
  let language = Ctl.languages.find((item: any) => item.value === code)
  return language ? language.label : ''
}

</script>
<template>
  <!-- 审核dialog -->
  <a-modal title="Set Status" v-model:visible="statusDialogRef" @ok="statusDialogConfirm" @cancel="statusDialogCancel"
    width="660px">
    <a-form ref="statusFormModel" :model="statusForm" :label-col="{ style: { width: '150px' } }"
      :wrapper-col="{ span: 14 }">
      <a-form-item required  :label="$t('base.Status')" name="status">
        <a-select style="width: 100%" v-model:value="statusForm.status" :options="ApproveStatusOptions" />
      </a-form-item>
      <a-form-item  :label="$t('base.Reason')" name="reason">
        <a-textarea v-model:value="statusForm.reason" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal :title="Ctl.isNew ? $t('base.Create') : $t('base.Edit')" v-model:visible="showModal" @ok="submit" @cancel="cancel"
    :ok-button-props="{ disabled: isViewForm }" :cancel-button-props="{ disabled: isViewForm }">
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
      <a-form-item :label="$t('base.Name')" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item  :label="$t('base.Language')" required name="language">
        <a-select v-model:value="form.language" style="width: 100%" :options="Ctl.languages" />
      </a-form-item>
      <a-form-item  :label="$t('base.Category')" required name="category_id">
        <a-tree-select v-model:value="form.category_id" style="width: 100%" :placeholder="$t('base.please_select')" allow-clear :tree-data="categoryStore.entities" :field-names="{
            children: 'children',
            label: 'name',
            value: 'id',
            selectable: 'selectable'
          }" tree-node-filter-prop="name">
        </a-tree-select>
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" @change="store.changePage" :pagination="{
    current: store.pagination.page, pageSize: store.pagination.pagesize, total: store.pagination.total, showSizeChanger: true, showQuickJumper: true
  }">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>{{ $t('base.Template') }}</h4>
        <div class="flex">
          <div class="mr-4">
            <span class="mr-2">{{ $t('base.Status') }}</span>
            <a-select ref="select" style="width: 200px" v-model:value="store.queryArgs.status" allowClear>
              <a-select-option :value="item.value" v-for="item in ApproveStatusOptions">{{ item.label }}</a-select-option>
            </a-select>
          </div>
          <a-input v-model:value="searchKeywords" style="width: 240px" class="mr-4" allowClear>
            <template #addonBefore>
              {{$t('base.Keywords')}}
            </template>
          </a-input>
          <a-button class="mr-2" @click="onClickSearch">
            <template #icon>
              <SearchOutlined />
            </template>
            {{$t('base.Search')}}
          </a-button>
          <a-button type="primary" @click="addNew" :loading="formLoading">
            <template #icon>
              <PlusOutlined />
            </template>
            {{$t('base.Create')}}
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
      <template v-else-if="column.dataIndex === 'category'">
        {{ record?.category?.name }}
      </template>
      <template v-else-if="column.dataIndex === 'language'">
        {{ getLanguage(record?.language) }}
      </template>
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
                  {{$t('base.View')}}
                </a>
              </a-menu-item>
              <a-menu-item key="0">
                <a @click="edit(record)" rel="noopener noreferrer">
                  <EditOutlined />
                  {{$t('base.Edit')}}
                </a>
              </a-menu-item>
              <a-menu-item key="1">
                <a-popconfirm title="Delete" :content="$t('base.ConfirmDelete')" :okText="$t('base.Yes')" :cancelText="$('base.No')" @confirm="deleteRecord(record)">
                  <a rel="noopener noreferrer">
                    <DeleteOutlined />
                    {{$t('base.Delete')}}
                  </a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item key="2">
                <a @click="showStatusDialog(record)" rel="noopener noreferrer">
                  <VerifiedOutlined />
                  {{$t('base.Verify')}}
                </a>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3">
                <a @click="goDesign(record)" rel="noopener noreferrer">
                  <ExperimentOutlined />
                  {{$t('base.TemplateDesign')}}
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
