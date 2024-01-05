<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { EditOutlined, DeleteOutlined, ExperimentOutlined, SettingOutlined } from '@ant-design/icons-vue';
import router from '@/router';

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  { title: '状态', dataIndex: 'status' },
  { title: '创建时间', dataIndex: 'time' },
  { title: 'OP', dataIndex: 'edit', width: 40 },
];

type ReportTemplate = {
  name?: string;
  status?: number;
  time?: Dayjs;
  _edit?: boolean;
  _isNew?: boolean;
};

const authors = reactive<ReportTemplate[]>([
  {
    name: 'Li Zhi',
    status: 1,
    time: dayjs(),
  },
  {
    name: 'Li Zhi',
    status: 0,
    time: dayjs(),
  },
  {
    name: 'Li Zhi',
    status: 1,
    time: dayjs(),
  },
  {
    name: 'Li Zhi',
    status: 0,
    time: dayjs(),
  },
]);

function addNew() {
  showModal.value = true;
  form._isNew = true;
}

const showModal = ref(false);

const newReportTemplate = (reportTemplate?: ReportTemplate) => {
  if (!reportTemplate) {
    reportTemplate = { _isNew: true };
  }
  reportTemplate.name = undefined;
  reportTemplate.status = 0;
  reportTemplate.time = dayjs();
  return reportTemplate;
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(target).forEach((key) => (target[key] = source[key]));
};

const form = reactive<ReportTemplate>(newReportTemplate());

function reset() {
  return newReportTemplate(form);
}

function cancel() {
  showModal.value = false;
  reset();
}

const formModel = ref<FormInstance>();

const formLoading = ref(false);


function submit() {
  formLoading.value = true;
  formModel.value
    ?.validateFields()
    .then((res: ReportTemplate) => {
      if (form._isNew) {
        authors.push({ ...res });
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

const editRecord = ref<ReportTemplate>();

/**
 * 编辑
 * @param record
 */
function edit(record: ReportTemplate) {
  editRecord.value = record;
  copyObject(form, record);
  showModal.value = true;
}

type Status = 0 | 1;

const StatusDict = {
  0: 'offline',
  1: 'online',
};


const design = (record: ReportTemplate) => {
  router.push({
    name: 'design',
    query: {
      id: "1",
    },
  });
}

</script>
<template>
  <a-modal :title="form._isNew ? '新增' : '编辑'" v-model:visible="showModal" @ok="submit" @cancel="cancel">
    <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
      <a-form-item label="名称" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item required label="状态" name="status">
        <a-select style="width: 90px" v-model:value="form.status" :options="[
          { label: 'offline', value: 0 },
          { label: 'online', value: 1 },
        ]" />
      </a-form-item>
      <a-form-item label="日期" name="time">
        <a-date-picker v-model:value="form.time" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="authors" :pagination="false">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>模版</h4>
        <div class="flex">
          <div class="mr-4">
            <span class="mr-2">模版状态</span>
            <a-select ref="select" style="width: 120px" allowClear>
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
        <div class="flex-col flex justify-evenly">
          <span class="text-title font-bold">{{ text }}</span>
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
                <a @click="edit(record)" rel="noopener noreferrer">
                  <DeleteOutlined />
                  删除
                </a>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3">
                <a @click="design(record)" rel="noopener noreferrer">
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
