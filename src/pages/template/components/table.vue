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
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  { title: '状态', dataIndex: 'status' },
  { title: '创建时间', dataIndex: 'create_at' },
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
  let result = await db.paginateReportTemplate(Ctl.page, Ctl.pagesize)
  Ctl.records = result.data.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      status: item.status,
      create_at: item.create_at
    }
  })
  Ctl.total = result.total
  console.log('Ctl.records:', toRaw(Ctl.records))
}

initializeData()

function addNew() {
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

        await db.addReportTemplate({
          name: form.name,
          status: form.status,
          create_at: form.create_at
        })

      } else {
        console.log('form:', form)
        await db.updateReportTemplate({
          id: form.id,
          name: form.name,
          status: form.status,
          create_at: form.create_at
        })
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
  console.log('edit-record:', record)
  createTimeRef.value = dayjs(record.create_at)
  Ctl.isNew = false;
  editRecord.value = record;
  console.log('record1:', record)
  copyObject(form, record);
  console.log('form:', form)
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
  await db.delReportTemplate(record.id)
  initializeData()
}

</script>
<template>
  <a-modal :title="Ctl.isNew ? '新增' : '编辑'" v-model:visible="showModal" @ok="submit" @cancel="cancel">
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
      <a-form-item label="名称" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item required label="状态" name="status">
        <a-select style="width: 100%" v-model:value="form.status" :options="ApproveStatusOptions" />
      </a-form-item>
      <a-form-item label="日期" name="create_at">
        <a-date-picker v-model:value="createTimeRef" format="YYYY-MM-DD HH:mm:ss" :locale="locale" style="width:100%" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="Ctl.records" :pagination="false">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>模版</h4>
        <div class="flex">
          <div class="mr-4">
            <span class="mr-2">状态</span>
            <a-select ref="select" style="width: 200px" allowClear>
              <a-select-option value="0">Unapproved</a-select-option>
              <a-select-option value="1">Approved</a-select-option>
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
                <a-popconfirm title="删除" content="确认删除吗？" okText="确认" cancelText="取消" @confirm="deleteRecord(record)">
                  <a rel="noopener noreferrer">
                    <DeleteOutlined />
                    删除
                  </a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3">
                <a @click="goDesign(record)" rel="noopener noreferrer">
                  <ExperimentOutlined />
                  模版设计
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
