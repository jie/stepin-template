<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref, toRaw } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { DeleteOutlined, EditOutlined, ReadOutlined } from '@ant-design/icons-vue';
import { ReportCategory as Category, ReportCategoryStore } from '@/store/category';
import { ApproveStatusOptions } from '@/utils/constant';
import {i18n} from "@/lang/i18n"
const store = ReportCategoryStore()
const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  { title: i18n.global.t('base.Name'), dataIndex: 'name', width: 200 },
  { title: i18n.global.t('base.NameInEnglish'), dataIndex: 'name_en', width: 200 },
  { title: i18n.global.t('base.Remark'), dataIndex: 'remark' },
  { title: i18n.global.t('base.CreateAt'), dataIndex: 'create_at' },
  { title: i18n.global.t('base.OP'), dataIndex: 'edit', width: 80 },
];



function addNew() {
  showModal.value = true;
  form._isNew = true;
}

const showModal = ref(false);

const newRecord = (record?: Category) => {
  if (!record) {
    record = { _isNew: true };
  }
  record.name = "";
  record.name_en = "";
  record.remark = "";
  record.children = [];
  record.status = "3";
  return record;
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(target).forEach((key) => (target[key] = source[key]));
};

const form = reactive<Category>(newRecord());

function reset() {
  return newRecord(form);
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
    .then((res: Category) => {
      if (form._isNew) {
        store.apiSave(form)
      } else {
        store.apiUpdate(form)
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



const editRecord = ref<Category>();

/**
 * 编辑
 * @param record
 */
function edit(record: Category) {
  editRecord.value = record;
  copyObject(form, record);
  console.log('form:', toRaw(form))
  console.log('record:', toRaw(record))
  form.id = record.id
  showModal.value = true;
}

const initializeData = async () => {
  let result = await store.apiQueryParent()
}


const deleteRecord = async (id:string) => {
  await store.apiDelete(id)
  initializeData()
}
initializeData()
</script>
<template>
  <a-modal :title="form._isNew ? $t('base.Add') : $t('base.Edit')" v-model:visible="showModal" @ok="submit" @cancel="cancel" >
    <a-form ref="formModel" :model="form" layout="vertical">
      <a-form-item :label="$t('base.Name')" required name="name">
        <a-input v-model:value="form.name" allowClear />
      </a-form-item>
      <a-form-item :label="$t('base.NameInEnglish')" required name="name_en">
        <a-input v-model:value="form.name_en" allowClear />
      </a-form-item>
      <a-form-item :label="$t('base.ParentCategory')" name="parent_id">
        <!-- <a-select v-model:value="form.parent_id" allowClear>
                    <a-select-option v-for="item in records" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select> -->
        <a-tree-select v-model:value="form.parent_id" show-search style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allow-clear
          tree-default-expand-all :tree-data="store.entities" :field-names="{
            children: 'children',
            label: 'name',
            value: 'id',
          }" tree-node-filter-prop="name">
        </a-tree-select>
      </a-form-item>
      <a-form-item :label="$t('base.Remark')" required name="remark">
        <a-textarea v-model:value="form.remark" allowClear />
      </a-form-item>
      <!-- <a-form-item required label="状态" name="status">
        <a-select style="width: 90px" v-model:value="form.status" :options="ApproveStatusOptions" allowClear />
      </a-form-item> -->
    </a-form>
  </a-modal>

  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" :pagination="false" :selection="{key: 'id'}">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>{{ $t('base.Category') }}</h4>
        <a-button type="primary" @click="addNew" :loading="formLoading">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ $t('base.Add') }}
        </a-button>
      </div>
    </template>
    <template #bodyCell="{ column, text, record }">
      <div class="flex items-stretch" v-if="column.dataIndex === 'name'">
        <div class="flex-col flex justify-evenly ml-2">
          <span class="text-title font-bold">{{ text }}</span>
        </div>
      </div>
      <div class="" v-else-if="column.dataIndex === 'name'">
        <div class="text-subtext">{{ text }}</div>
      </div>
      <template v-else-if="column.dataIndex === 'status'">
        <a-badge class="text-subtext" :color="'green'">
          <template #text>
            <span class="text-subtext">{{ text }}</span>
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
                  {{ $t('base.View') }}
                </a>
              </a-menu-item>
              <a-menu-item key="0">
                <a @click="edit(record)" rel="noopener noreferrer">
                  <EditOutlined />
                  {{ $t('base.Edit') }}
                </a>
              </a-menu-item>
              <a-menu-item key="1">
                <a-popconfirm title="Delete" :content="$t('base.ConfirmDelete')" :okText="$t('base.Yes')" :cancelText="$t('base.No')" @confirm="deleteRecord(record)">
                  <a rel="noopener noreferrer">
                    <DeleteOutlined />
                    {{ $t('base.Delete') }}
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
