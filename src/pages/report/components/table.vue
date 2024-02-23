<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { EditOutlined, SearchOutlined, ReadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import {
  ReportStatuses, reports, Report, customers,
  factories,
  workers,
  categories
} from "@/pages/constants";
import { formatStatusColor } from "@/utils/formatter";
import RemoteSelect from "@/components/remote_select/index.vue"
import { ApproveStatus, ApproveStatusOptions } from "@/utils/constant";
import { db } from '@/hook/dexie_hook';
const searchKeywords = ref('');
const onClickSearch = () => {
  console.log(searchKeywords.value);
}
const columns = [
  {
    title: 'Report',
    dataIndex: 'name',
    fixed: 'left',
    width: 260,
  },
  { title: 'DATE', dataIndex: 'time', width: 80 },
  { title: 'CUSTOMER', dataIndex: 'customer', width: 200 },
  { title: 'WORKER', dataIndex: 'worker', width: 200 },
  { title: 'CATEGORY', dataIndex: 'category', width: 160 },
  { title: 'STATUS', dataIndex: 'status', width: 120 },
  { title: 'OP', dataIndex: 'edit', width: 40 },
];


function addNew() {
  showModal.value = true;
  form._isNew = true;
}

const showModal = ref(false);

const newAuthor = (record?: Report) => {
  if (!record) {
    record = { _isNew: true };
  }
  record.name = undefined;
  record.status = '0';
  record.time = dayjs();
  return record;
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(target).forEach((key) => (target[key] = source[key]));
};

const form = reactive<Report>(newAuthor());

function reset() {
  return newAuthor(form);
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
    .then((res: Report) => {
      console.log('form:', form)
      // if (form._isNew) {
      //   reports.push({ ...res });
      // } else {
      //   copyObject(editRecord.value, res);
      // }
      console.log('submit:', res)
      db.addReportItem({
        name: form.name,
        status: form.status,
        inspect_date: form.inspect_date,
        customer: form.customer,
        workers: form.workers,
        category: form.category
      })
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

const editRecord = ref<Report>();

/**
 * 编辑
 * @param record
 */
function edit(record: Report) {
  editRecord.value = record;
  copyObject(form, record);
  showModal.value = true;
}


const queryReportTemplate = async () => {

}

</script>
<template>
  <a-modal :title="form._isNew ? '新增' : '编辑'" v-model:visible="showModal" @ok="submit" @cancel="cancel" width="660px">
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
        <RemoteSelect type="workers" v-model:value="form.workers" :rows="workers" searchKey="name" :isMultiple="true"/>
      </a-form-item>
      <a-form-item label="Customer" name="customer">
        <RemoteSelect type="customer" v-model:value="form.customer" :rows="customers" searchKey="name"/>
      </a-form-item>
      <a-form-item label="Factory" name="factory">
        <RemoteSelect type="factory" v-model:value="form.factory" :rows="factories" searchKey="name" />
      </a-form-item>
      <a-form-item label="Template" name="report_template">
        <RemoteSelect type="report_template" v-model:value="form.report_template" searchKey="name" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 成员表格 -->
  <div style="width: 100%">
    <a-table v-bind="$attrs" :columns="columns" :dataSource="reports"
      :pagination="{ position: 'bottomCenter', 'page-size': 5, 'total': 32, 'show-size-changer': true, 'show-quick-jumper': true }"
      :scroll="{ y: 600 }">
      <template #title>
        <div class="flex justify-between pr-4">
          <h4>报告</h4>
          <div class="flex">
            <div class="mr-4">
              <span class="mr-2">客户</span>
              <a-select ref="select" style="width: 120px" allowClear>
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
                <a-select-option value="disabled" disabled>Disabled</a-select-option>
                <a-select-option value="Yiminghe">yiminghe</a-select-option>
              </a-select>
            </div>
            <div class="mr-4">
              <span class="mr-2">检验员</span>
              <a-select ref="select" style="width: 120px" allowClear>
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
                <a-select-option value="disabled" disabled>Disabled</a-select-option>
                <a-select-option value="Yiminghe">yiminghe</a-select-option>
              </a-select>
            </div>
            <div class="mr-4">
              <span class="mr-2">报告状态</span>
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
        <div class="" v-else-if="column.dataIndex === 'position'">
          <div class="text-title font-bold">
            {{ record.jobs }}
          </div>
          <div class="text-subtext">
            {{ record.department }}
          </div>
        </div>
        <template v-else-if="column.dataIndex === 'status'">
          <a-badge class="text-subtext" :color="formatStatusColor(text)">
            <template #text>
              <span class="text-subtext">{{ ReportStatuses[text] }}</span>
            </template>
          </a-badge>
        </template>
        <template v-else-if="column.dataIndex === 'inspect_date'">
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
                <a-menu-item key="1">
                  <a @click="edit(record)" rel="noopener noreferrer">
                    <VerifiedOutlined />
                    审核报告
                  </a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a @click="edit(record)" rel="noopener noreferrer">
                    <MailOutlined />
                    发送邮件给客户
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
</div></template>
