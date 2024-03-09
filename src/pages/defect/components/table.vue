<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref, toRaw } from 'vue';
import dayjs from 'dayjs';
import { EditOutlined, ReadOutlined } from '@ant-design/icons-vue';
import { ReportDefectStore, ReportDefect } from '@/store/defect';
import { ReportCategoryStore } from "@/store/category"
import { ApproveStatusOptions, ApproveStatus } from '@/utils/constant';
const categoryStore = ReportCategoryStore()
const store = ReportDefectStore();
const columns = [
  { title: 'Name', dataIndex: 'name', width: 200 },
  { title: 'Name', dataIndex: 'name_en', width: 200 },
  { title: 'Product', dataIndex: 'product', width: 200 },
  { title: 'Product', dataIndex: 'product_en', width: 200 },
  { title: 'Code', dataIndex: 'code', width: 200 },
  { title: 'Content', dataIndex: 'content', width: 200},
  { title: 'Content En', dataIndex: 'content_en', width: 200},
  { title: 'OP', dataIndex: 'edit', width: 40 },
];

const defectTypes = [
  {'label':'Critical', 'value':'critical'},
  {'label':'Major', 'value':'major'},
  {'label':'Minor', 'value':'minor'}
]

function addNew() {
  showModal.value = true;
  store.isNew = true;
}

const showModal = ref(false);

const newRecord = (record?: ReportDefect) => {
  store.isNew = true
  record.name = "";
  record.name_en = ""
  record.product = "";
  record.product_en = ""
  record.code = "";
  record.content = "";
  record.content_en = "";
  record.types = [];
  return record;
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(target).forEach((key) => (target[key] = source[key]));
};

const form = reactive<ReportDefect>(newRecord({}));

function reset() {
  return newRecord(form);
}

function cancel() {
  showModal.value = false;
  reset();
}

const formModel = ref<FormInstance>();

const formLoading = ref(false);

async function extractImg(file: Blob, author: ReportDefect) {
  await getBase64(file).then((res) => {
    author.avatar = res;
  });
}

function submit() {
  formLoading.value = true;
  formModel.value
    ?.validateFields()
    .then(async (res: ReportDefect) => {
      if (store.isNew) {
        await store.apiSave({name: form.name, 
          status: form.status, 
          name_en: form.name_en, 
          types: form.types, 
          content: form.content, 
          content_en: form.content_en, 
          category_id: form.category_id, 
          product: form.product, 
          product_en: form.product_en, 
          code: form.code
        })
      } else {
        await store.apiUpdate({id: form.id, 
          name: form.name, 
          status: form.status, 
          name_en: form.name_en, 
          types: form.types, 
          content: form.content, 
          content_en: form.content_en, 
          category_id: form.category_id, 
          product: form.product, 
          product_en: form.product_en, 
          code: form.code})
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

const editRecord = ref<ReportDefect>();

/**
 * Edit
 * @param record
 */
function edit(record: ReportDefect) {
  store.isNew = false;
  editRecord.value = record;
  copyObject(form, record);
  console.log('record:', toRaw(record))
  console.log('form:', toRaw(form))
  form.id = record.id;
  form.category_id = record?.category?.id;
  showModal.value = true;
}

const initializeData = async () => {
  await store.apiQuery()
  await categoryStore.apiQueryParent(true)
};

const deleteRecord = async (id:string) => {
  await store.apiDelete(id)
  initializeData()
}


initializeData()

</script>
<template>
  <a-modal :title="store.isNew ? 'Create' : 'Edit'" v-model:visible="showModal" @ok="submit" @cancel="cancel">
    <a-form ref="formModel" :model="form" layout="vertical">

      <a-form-item label="Category" required name="category_id">
        <a-tree-select v-model:value="form.category_id" style="width: 100%" placeholder="Please select" allow-clear :tree-data="categoryStore.entities" :field-names="{
            children: 'children',
            label: 'name',
            value: 'id',
            selectable: 'selectable'
          }" tree-node-filter-prop="name">
        </a-tree-select>
      </a-form-item>
      <a-form-item label="Name" required name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="Name in English" name="name_en">
        <a-input v-model:value="form.name_en" />
      </a-form-item>
      <a-form-item label="Product" Product="product">
        <a-input v-model:value="form.product" />
      </a-form-item>
      <a-form-item label="Product in English" Product="product_en">
        <a-input v-model:value="form.product_en" />
      </a-form-item>
      <a-form-item label="Types" name="types">
        <a-select v-model:value="form.types" :options="defectTypes"  mode="multiple"/>
      </a-form-item>
      <a-form-item label="Content" required name="content">
        <a-textarea v-model:value="form.content" />
      </a-form-item>
      <a-form-item label="Content in English" name="content_en">
        <a-textarea v-model:value="form.content_en" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 成员表格 -->
  <a-table v-bind="$attrs" :columns="columns" :dataSource="store.entities" :pagination="false">
    <template #title>
      <div class="flex justify-between pr-4">
        <h4>Defect</h4>
        <a-button type="primary" @click="addNew" :loading="formLoading">
          <template #icon>
            <PlusOutlined />
          </template>
          Create
        </a-button>
      </div>
    </template>
    <template #bodyCell="{ column, text, record }">
      <div class="flex items-stretch" v-if="column.dataIndex === 'name'">
        <div class="flex-col flex justify-evenly ml-2">
          <span class="text-title font-bold">{{ text }}</span>
        </div>
      </div>
      <template v-else-if="column.dataIndex === 'is_enable'">
        <a-switch :checked="record.is_enable" />
      </template>
      <template v-else-if="column.dataIndex === 'create_at'">
        {{ dayjs(text)?.format('YYYY-MM-DD HH:mm') }}
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
                <a-popconfirm title="Delete" content="Confirm delete?" okText="Yes" cancelText="No" @confirm="deleteRecord(record.id)">
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
