<template>
  <div ref="allModal">
    <a-form-item
      :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}`, type: 'object' }]"
      :label="props?.item?.title" :extra="props?.item?.summary" :required="props?.item?.required"
      :name="props?.item?.key">
      <div v-if="rowItems.column == 1">
        <div v-for="row in rowItems.rows" style="margin-bottom: 10px;">
          <div v-if="row.title">{{ formatTitle(row) }}</div>
          <div v-if="row.summary">{{ row.summary }}</div>
          <a-input v-model:value="row.value" @change="onChange" allowClear></a-input>
          <div v-if="row.desc">{{ row.desc }}</div>
        </div>
      </div>


      <div v-else :class="{ 'tabled': props?.item?.data?.isTable }">
        <a-row class="r-table-header" style="margin-top: -1px;">
          <a-col :span="(24 - 3) / rowItems.column" v-for="col in props?.item?.data?.columns" class="r-group-col">
            <div class="r-table-label"><strong>{{ col.title }}</strong></div>
          </a-col>
          <a-col :span="3" align="center" class="r-group-col">
            <div class="r-table-label"><strong>Operation</strong></div>
          </a-col>
        </a-row>

        <a-row v-for="(items, $index) in rowGroupItems" style="margin-top: -1px;">
          <a-col :span="(24 - 3) / rowItems.column" v-for="row in items" class="r-group-col">
            <div style="padding: 10px" v-if="row.type == 'input'">
              <a-textarea v-model:value="row.value" @change="onChange" allowClear v-if="row.is_textarea" />
              <a-input v-model:value="row.value" @change="onChange" allowClear v-else />
            </div>
            <div v-else class="r-table-label"><strong>{{ formatStepText(row.default_value, row) }}</strong></div>
          </a-col>
          <a-col :span="3" align="center" class="r-group-col">
            <div style="display: flex; justify-content: align-items:center; width: 100%; height: 100%">
              <div style="flex:1;display: flex; justify-content:center; align-items:center;height: 100%;">
                <a-popconfirm title="Confirm delete?" @confirm="confirmDeleteRow($index)"
                  v-if="items[0].is_repeat || items[1].is_repeat"
                  :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }">

                  <a-button size="large">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button>

                </a-popconfirm>
              </div>
              <div style="flex:1;display: flex; justify-content; align-items:center;height: 100%;">
                <a-button size="large" @click="onEditRow($index)">
                  <template #icon>
                    <EditOutlined />
                  </template>
                </a-button>
              </div>

            </div>
          </a-col>
        </a-row>
      </div>
    </a-form-item>
    <a-form-item v-if="props?.item?.data.hasAddRowButton">
      <a-button type="primary" @click="onClickShowAddRow">Add Rows</a-button>
    </a-form-item>
    <a-modal style="max-height: 100%; overflow-y:scroll" v-model:visible="addRowDialogVisibleRef" zIndex="99999"
      @ok="onClickAddStep" :z-index="1001" :getContainer="() => $refs.allModal">
      <a-form name="Add Row" layout="vertical">
        <template v-for="(row, $index) in targetRepeatRows">
          <a-form-item :label="row.title.replace('{{step}}', '')" v-if="row.type == 'input'">
            <div v-if="row.summary">{{ row.summary }}</div>
            <a-auto-complete :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="row.value"
              style="width: 100%" :options="defectOptions" @search="handleSearchDefect"
              allowClear v-if="row.is_defect">
              <template #option="{ content_en: content_en, id: id }">
                <div style="display:flex" @click="onDefectSelect(row, id)">
                  <span style="flex: 1">{{ content_en }}</span>
                  <span style="font-weight: bold; width: 150px;">{{ content_en }}</span>
                </div>
              </template>
              <a-textarea v-if="row.is_textarea" />
            </a-auto-complete>
            <a-input v-model:value="row.value" allowClear v-else></a-input>
            <div v-if="row.desc">{{ row.desc }}</div>
          </a-form-item>
          <a-form-item :label="row.title.replace('{{step}}', '')" v-else>
            <a-textarea v-model:value="row.value" allowClear v-if="row.is_textarea"></a-textarea>
            <a-input v-model:value="row.value" allowClear v-else></a-input>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { ref, toRaw, computed } from "vue"
import { ReportFillStore } from "@/store/report_fill"
import { copyObject } from "@/utils/objectUtils"
import { DeleteFilled, DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
const store = ReportFillStore()
const props = defineProps({
  item: {
    type: Object,
  },
  value: {
    type: Object,
    default: {}
  }
})


type groupIputItem = {
  value?: ""
}

const addRowDialogVisibleRef = ref(false)
const isEditRow = ref(false)
const rowItems = ref({
  isTable: false,
  hasAddRowButton: false,
  rows: [],
  step: 1,
  value: [],
  column: 2,
  columns: []
})

const rowGroupItems = computed(() => {
  const result = [];
  let column = parseInt(rowItems.value.column)
  for (let i = 0; i < rowItems.value.rows.length; i += column) {
    result.push(rowItems.value.rows.slice(i, i + column));
  }
  return result;
});

const targetRepeatRows = ref([])
const targetStartStep = ref(1)
const defectOptions = ref([])
const handleSearchDefect = (value) => {
  defectOptions.value = value ? store.defects.filter((s) => s.content_en.toLowerCase().includes(value.toLowerCase())) : []
}
const onDefectSelect = (row, e) => {
  row.value = store.defects.find((s) => s.id == e).content_en
}
const onDefectChange = (e) => {
  emits('update:value', e)
}
const formatTitle = (row) => {
  return row.title.replace('{{step}}', row.step || 1)
}


const formatStepText = (text, row) => {
  return text.replace('{{step}}', row.step || 1)
}
const emits = defineEmits(["update:value"])


const onChange = (e) => {
  console.log('e:', toRaw(rowItems.value))
  emits('update:value', rowItems.value)
}


const onClickShowAddRow = () => {
  if (targetRepeatRows.value.length == 0) {
    targetRepeatRows.value = copyObject(props?.item?.data?.rows.filter(c => c.is_repeat))
  }
  let step = targetStartStep.value + 1
  console.log('targetRepeatRows.value:', targetRepeatRows.value)
  targetRepeatRows.value.map((item) => {
    item.step = step
    if (item.default_value) {
      item.value = item.default_value.replace('{{step}}', step)
    } else {
      item.value = ""
    }
    return item
  })
  addRowDialogVisibleRef.value = true
  isEditRow.value = false
}


const onClickAddStep = () => {
  if (isEditRow.value) {
    console.log('targetRepeatRows.value:', toRaw(targetRepeatRows.value))
    targetRepeatRows.value.map((item) => {
      rowItems.value.rows.find(c => c.key == item.key).value = item.value
      return item
    })
  } else {
    let insertIndex = 0
    let isPush = false
    for (let i = 0; i < rowItems.value.rows.length; i++) {
      if (rowItems.value.rows[i].is_repeat) {
        if ((i + 1) >= rowItems.value.rows.length) {
          isPush = true
          insertIndex = i + 1;
          break
        }
        if (!rowItems.value.rows[i + 1].is_repeat) {
          insertIndex = i + 1;
          break
        }
      }
    }
    if (isPush) {
      for (let item of copyObject(targetRepeatRows.value)) {
        rowItems.value.rows.push(item)
      }
    } else {
      rowItems.value.rows.splice(insertIndex, 0, ...copyObject(targetRepeatRows.value))
    }

    targetStartStep.value++
    rowItems.value.step = targetStartStep.value
    resetRowKey()

  }

  addRowDialogVisibleRef.value = false
}


const confirmDeleteRow = (index: number) => {
  rowItems.value.rows.splice(index * rowItems.value.column, rowItems.value.column)
  targetStartStep.value = targetStartStep.value - 1
}

const onEditRow = (index: number) => {
  let items = []
  for (let item of rowGroupItems.value[index]) {
    items.push(item)
  }
  console.log('rowGroupItems[index]:', toRaw(rowGroupItems.value[index]))
  targetRepeatRows.value = copyObject(items)
  targetRepeatRows.value.map((item) => {
    if (item.type == 'text' && item.default_value) {
      console.log('item:', toRaw(item))
      item.value = item.default_value.replace('{{step}}', item.step ? item.step : 1)
    }
    return item
  })
  addRowDialogVisibleRef.value = true
  isEditRow.value = true
}

const initializeData = () => {
  console.log('props.value:', toRaw(props.item.data))

  if (props.value?.rows && props.value.rows.length != 0) {
    rowItems.value = props.value
    targetStartStep.value = props.value.step
  } else {
    rowItems.value = { ...props?.item?.data }
  }
  console.log('rowItems.value:', toRaw(rowItems.value))
}

const resetRowKey = () => {
  rowItems.value.rows.map((item, index) => {
    item.key = index.toString()
    return item
  })

}

setTimeout(() => {
  initializeData()
}, 1000)
defineExpose({
  props,
})
</script>

<style scoped>
.r-group-row {}

.r-group-col {
  /* padding: 10px; */
}

.tabled .r-group-col {
  border: 1px solid #999;
}

.tabled .r-table-header .r-table-label {
  padding: 10px;
}

.tabled .r-table-label {
  height: 100%;
  background-color: #eee;
  display: flex;
  justify-content: flex-start;
  padding-left: 10px;
  align-items: center;
}
</style>