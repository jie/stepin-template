<template>
  <div>
    <div>{{$t('base.EditComponent')}} {{ baseForm?.title }}</div>
    <div>
      <BaseForm ref="baseForm" />
    </div>
    <div>
      <a-form :model="extraSettingForm" name="Extra Settings" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-form-item :label="$t('base.IsRequire')" name="hasAddRowButton">
          <a-switch v-model:checked="extraSettingForm.hasAddRowButton" />
        </a-form-item>
        <a-form-item  :label="$t('base.IsTable')" name="isTable">
          <a-switch v-model:checked="extraSettingForm.isTable" />
        </a-form-item>
        <a-form-item  :label="$t('base.ColumnNumber')" name="column">
          <a-radio-group v-model:value="extraSettingForm.column" button-style="solid">
            <a-radio-button value="1">1</a-radio-button>
            <a-radio-button value="2">2</a-radio-button>
            <a-radio-button value="3">3</a-radio-button>
            <a-radio-button value="4">4</a-radio-button>
            <a-radio-button value="5">5</a-radio-button>
            <a-radio-button value="6">6</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </div>
    <div>
      <a-modal v-model:visible="colFormVisibleRef" zIndex="99999" @ok="handConfirmAddCol">
        <a-form :model="colForm" name="Column Settings" layout="vertical">
          <a-form-item :label="$t('base.Title')" name="title" required>
            <a-input v-model:value="colForm.title" />
          </a-form-item>
          <a-form-item :label="$t('base.Name')" name="name" required>
            <a-input v-model:value="colForm.name" />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model:visible="rowFormVisibleRef" zIndex="99999" @ok="handConfirmAddRow">
        <a-form :model="rowForm" :label="$t('base.Row')" layout="vertical">
          <template v-if="extraSettingForm.columns && extraSettingForm.columns.length != 0">
            <a-form-item label="Column">
              <a-select @change="onChangeColumn" :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }">
                <a-select-option v-for="item in extraSettingForm.columns" :key="item.key" :value="item.key">
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$t('base.Title')" name="title" readonly required>
              <a-input v-model:value="rowForm.title" />
            </a-form-item>
            <a-form-item :label="$t('base.Name')" name="name" readonly required>
              <a-input v-model:value="rowForm.name" />
            </a-form-item>
          </template>
          <template v-else>
            <a-form-item :label="$t('base.Title')" name="title" required>
              <a-input v-model:value="rowForm.title" />
            </a-form-item>
            <a-form-item :label="$t('base.Name')" name="name" required>
              <a-input v-model:value="rowForm.name" />
            </a-form-item>
          </template>
          <a-form-item :label="$t('base.Summary')" name="summary">
            <a-input v-model:value="rowForm.summary" />
          </a-form-item>
          <a-form-item :label="$t('base.Description')" name="desc">
            <a-input v-model:value="rowForm.desc" />
          </a-form-item>
          <a-form-item :label="$t('base.DefaultValue')" name="default_value">
            <a-input v-model:value="rowForm.default_value" />
          </a-form-item>
          <a-form-item :label="$t('base.Type')" name="required">
            <a-radio-group v-model:value="rowForm.type" button-style="solid">
              <a-radio-button value="input">{{ $t('base.Input') }}</a-radio-button>
              <a-radio-button value="text">{{ $t('base.Text') }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('base.IsRequire')" name="required">
            <a-switch v-model:checked="rowForm.required" />
          </a-form-item>
          <a-form-item :label="$t('base.IsTextarea')" name="is_textarea">
            <a-switch v-model:checked="rowForm.is_textarea" />
          </a-form-item>
          <a-form-item :label="$t('base.IsDefect')" name="is_defect">
            <a-switch v-model:checked="rowForm.is_defect" />
          </a-form-item>
          <a-form-item :label="$t('base.IsRepeat')" name="is_repeat">
            <a-switch v-model:checked="rowForm.is_repeat" />
          </a-form-item>
        </a-form>
      </a-modal>
      <div>
        <a-form name="Row Column" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
          <a-form-item :label="$t('base.AddColumn')">
            <a-button @click="showColFormModal" type="primary">{{ $t('base.AddColumn') }}</a-button>
          </a-form-item>
          <a-form-item :label="$t('base.Column')">
            <a-table :dataSource="extraSettingForm.columns" :columns="headerFormColumn" :pagination="false">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'delete'">
                  <a-popconfirm :title="$t('base.ConfirmDelete')" :ok-text="$t('base.Yes')" :cancel-text="$t('base.No')" @confirm="deleteCol(record)">
                    <DeleteOutlined></DeleteOutlined>
                  </a-popconfirm>
                </template>
                <template v-else-if="column.key === 'edit'">
                  <EditOutlined @click="onClickEditCol(record)"></EditOutlined>
                </template>
              </template>
            </a-table>
          </a-form-item>
        </a-form>
      </div>
      <div>
        <a-form name="Row Settings" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
          <a-form-item :label="$t('base.AddRow')">
            <a-button @click="showRowFormModal" type="primary">{{ $t('base.AddRow') }}</a-button>
          </a-form-item>
          <a-form-item :label="$t('base.Row')">
            <a-table :dataSource="extraSettingForm.rows" :columns="rowFormColumn" :pagination="false">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'required'">
                  <a>
                    {{ record.required }}
                  </a>
                </template>
                <template v-else-if="column.key === 'title'">
                  <div>
                    {{ record.title }}  
                  </div>
                  <div>
                    {{ record.default_value }}  
                  </div>
                </template>
                <template v-else-if="column.key === 'is_defect'">
                  <a>
                    {{ record.is_defect }}
                  </a>
                </template>
                <template v-else-if="column.key === 'is_textarea'">
                  <a>
                    {{ record.is_textarea }}
                  </a>
                </template>
                <template v-else-if="column.key === 'is_repeat'">
                  <a>
                    {{ record.is_repeat }}
                  </a>
                </template>
                <template v-else-if="column.key === 'delete'">
                  <a-popconfirm :label="$t('base.ConfirmDelete')" :ok-text="$t('base.Yes')" :cancel-text="$t('base.No')" @confirm="deleteRow(record)">
                    <DeleteOutlined></DeleteOutlined>
                  </a-popconfirm>
                </template>
                <template v-else-if="column.key === 'edit'">
                  <EditOutlined @click="onClickEditRow(record)"></EditOutlined>
                </template>
              </template>
            </a-table>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, toRaw } from "vue"
import BaseForm from "../base_editor.vue"
import { DeleteOutlined, EditOutlined, ReadOutlined } from '@ant-design/icons-vue';
import { i18n } from "@/lang/i18n";

const baseForm = ref(null)
const itemData = ref({})
const rowFormVisibleRef = ref(false)
const colFormVisibleRef = ref(false)
const extraSettingForm = reactive({
  isTable: true,
  hasAddRowButton: false,
  rows: [],
  columns: [],
  step: 1,
  value: [],
  column: 1
})
const rowForm = reactive({
  key: "",
  title: "",
  type: "input",
  name: "",
  summary: "",
  desc: "",
  default_value: "",
  required: false,
  is_defect: false,
  is_repeat: false,
  is_textarea: false,
  _edit: false
})

const colForm = reactive({
  key: "",
  title: "",
  name: "",
  _edit: false
})

const headerFormColumn = [
  {
    title: i18n.global.t('base.Title'),
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: i18n.global.t('base.Name'),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: i18n.global.t('base.Delete'),
    key: 'delete',
    fixed: 'right',
    width: 60,
  },
  {
    title: i18n.global.t('base.Edit'),
    key: 'edit',
    fixed: 'right',
    width: 60,
  },
]

const rowFormColumn = [
  {
    title: i18n.global.t('base.Title'),
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: i18n.global.t('base.IsRequire'),
    dataIndex: 'required',
    key: 'required',
    width: '80px'
  },
  {
    title: i18n.global.t('base.Type'),
    dataIndex: 'type',
    key: 'type',
    width: '80px'
  },
  {
    title: i18n.global.t('base.IsTextarea'),
    dataIndex: 'is_textarea',
    key: 'is_textarea',
    width: '80px'
  },
  {
    title: i18n.global.t('base.IsDefect'),
    dataIndex: 'is_defect',
    key: 'is_defect',
    width: '80px'
  },
  {
    title: i18n.global.t('base.IsRepeat'),
    dataIndex: 'is_repeat',
    key: 'is_repeat',
    width: '80px'
  },
  {
    title: i18n.global.t('base.Delete'),
    key: 'delete',
    fixed: 'right',
    width: 60,
  },
  {
    title: i18n.global.t('base.Edit'),
    key: 'edit',
    fixed: 'right',
    width: 60,
  },
]

const initializeData = (item: any) => {
  // console.log('initializeData:', toRaw(item))
  itemData.value = item
  baseForm.value.initializeData(item)
  extraSettingForm.rows = item.data.rows
  extraSettingForm.columns = item.data.columns
  extraSettingForm.column = item.data.column
  extraSettingForm.hasAddRowButton = item.data.hasAddRowButton
  extraSettingForm.isTable = item.data.isTable
  extraSettingForm.step = item.data.step
}

const exportData = () => {
  console.log('baseForm.value.exportData():', baseForm.value.exportData())
  let data = baseForm.value.exportData()
  return {
    ...data,
    data: {
      value: [],
      ...extraSettingForm
    }
  }
}

const showRowFormModal = () => {
  rowFormVisibleRef.value = true
  rowForm._edit = false
}
const showColFormModal = () => {
  colFormVisibleRef.value = true
  colForm._edit = false
}

const handConfirmAddCol = () => {
  if (colForm._edit == true) {
    extraSettingForm.columns.map(c => {
      if (c.key == colForm.key) {
        for (let key of Object.keys(colForm)) {
          c[key] = colForm[key]
        }
      }
      return c
    })
  } else {
    extraSettingForm.columns.push({ ...colForm })
  }
  extraSettingForm.columns.map((row, index) => {
    row.key = index.toString()
    return row
  })

  colForm.title = ""
  colForm.name = ""
  colFormVisibleRef.value = false
}
const handConfirmAddRow = () => {
  if (rowForm._edit == true) {
    extraSettingForm.rows.map(c => {
      if (c.key == rowForm.key) {
        for (let key of Object.keys(rowForm)) {
          c[key] = rowForm[key]
        }
      }
      return c
    })
  } else {
    extraSettingForm.rows.push({ ...rowForm })
  }
  extraSettingForm.rows.map((row, index) => {
    row.key = index.toString()
    return row
  })
  resetRowForm()
  rowFormVisibleRef.value = false
}
const resetRowForm = () => {
  rowForm.title = ""
  rowForm.name = ""
  rowForm.summary = ""
  rowForm.desc = ""
  rowForm.default_value = ""
  rowForm.type = "input"
  rowForm.required = false
  rowForm.is_defect = false
  rowForm.is_repeat = false
  rowForm.is_textarea = false
}

const deleteRow = (record: any) => {
  extraSettingForm.rows = extraSettingForm.rows.filter(item => item.key != record.key)
  extraSettingForm.rows.map((row, index) => {
    row.key = index.toString()
    return row
  })
}
const deleteCol = (record: any) => {
  extraSettingForm.columns = extraSettingForm.columns.filter(item => item.key != record.key)
  extraSettingForm.columns.map((row, index) => {
    row.key = index.toString()
    return row
  })
}

const onClickEditRow = (record: any) => {
  rowForm.key = record.key
  rowForm.title = record.title
  rowForm.name = record.name
  rowForm.summary = record.summary
  rowForm.desc = record.desc
  rowForm.default_value = record.default_value
  rowForm.type = record.type
  rowForm.required = record.required
  rowForm.is_defect = record.is_defect
  rowForm.is_repeat = record.is_repeat
  rowForm.is_textarea = record.is_textarea
  rowForm._edit = true
  rowFormVisibleRef.value = true
}
const onClickEditCol = (record: any) => {
  colForm.key = record.key
  colForm.title = record.title
  colForm.name = record.name
  colForm._edit = true
  colFormVisibleRef.value = true
}

const onChangeColumn = (index) => {
  console.log('index:', toRaw(index))
  rowForm.title = extraSettingForm.columns[index].title
  rowForm.name = extraSettingForm.columns[index].name
}

defineExpose({
  initializeData,
  exportData
})
</script>