<template>
    <div class="flex">
        <div class="flex-1" v-if="props?.value"><a-button type="text">{{ displayValue }}</a-button></div>
        <a-button @click="showSearchDialog">Choose</a-button>
        <a-modal v-model:visible="modelVisible" title="Title" :confirm-loading="confirmLoading" @ok="handleOk">
            <a-form ref="formRef">
                <a-form-item :label="props.searchLabel">
                    <a-input-search v-model:value="searchValueRef" placeholder="input search text" enter-button="Search"
                        @search="onSearch" />
                </a-form-item>
                <a-form-item v-if="searchResult && searchResult.length != 0">
                    <a-table size="small" bordered
                        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: props.isMultiple ? 'checkbox' : 'radio' }"
                        :columns="tableColumns" :data-source="searchResult" rowKey="id" />
                </a-form-item>
                <a-empty v-else />
            </a-form>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { db } from '@/hook/dexie_hook'
const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const props = defineProps(['value', 'key', 'searchKey', 'searchLabel', 'isMultiple', 'columns', 'rows'])
const emit = defineEmits(['update:value'])
const searchValueRef = ref<string>('')
const tableColumns = ref([])
const showModal = () => {
    modelVisible.value = true;
};
const displayValue = computed(() => {
    if (props.isMultiple) {
        let items = searchResult.value.filter((item) => props.value.includes(item.id))
        if (items) {
            return items.map((item) => item.name).join(',')
        } else {
            return ''
        }
    } else {
        let item = searchResult.value.find((item) => item.id == props.value)
        if (item) {
            return item.name
        } else {
            return ''
        }
    }
})
const initializeData = () => {
    if (props.rows) {
        searchResult.value = props.rows
    }
    if (props.columns) {
        tableColumns.value = props.columns
    } else {
        tableColumns.value = [{ title: 'ID', dataIndex: 'id', width: 100 }, { title: 'Name', dataIndex: 'name' }]
    }
}


const searchResult = ref<any[]>([])
const selectedRowKeys = ref([])
const modelVisible = ref<boolean>(false)
const onSelectChange = (keys) => {
    console.log('selectedRowKeys changed: ', keys);
    selectedRowKeys.value = keys;
};
const handleOk = () => {
    confirmLoading.value = true;
    setTimeout(() => {
        modelVisible.value = false;
        confirmLoading.value = false;
        emit('update:value', selectedRowKeys.value)
    }, 1000);
};
const showSearchDialog = () => {
    console.log('1')
    showModal()
}

const onSearch = () => {
    if (props.rows) {
        return
    }
    db.paginateReportTemplate(1, 10, { key: props.searchKey, value: searchValueRef.value }).then((res) => {
        searchResult.value = res.data
    })
}
initializeData()

</script>