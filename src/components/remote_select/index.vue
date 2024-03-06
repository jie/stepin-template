<template>
    <div class="flex">
        <div class="flex-1" v-if="props?.value">
            <Spin v-if="displayLoadingRef" /><a-button type="text">{{ displayValue }}</a-button>
        </div>
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
import { ref, computed, watch } from 'vue';
import { ReportCompanyStore } from '@/store/company'
import { ReportCompanyContactStore } from '@/store/company_contact'
import { ReportFactoryStore } from '@/store/factory'
import { ReportFactoryContactStore } from '@/store/factory_contact'
import { ReportUserStore } from '@/store/user'
import { ReportTemplateStore } from '@/store/reportTemplate'
import Spin from "@/components/spin/index.vue";
const userStore = ReportUserStore()
const companyStore = ReportCompanyStore()
const factoryStore = ReportFactoryStore()
const companyContactStore = ReportCompanyContactStore()
const factoryContactStore = ReportFactoryContactStore()
const reportTemplateStore = ReportTemplateStore()
const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const props = defineProps(['type', 'value', 'key', 'searchKey', 'searchLabel', 'isMultiple', 'columns', 'rows'])
const emit = defineEmits(['update:value'])
const searchValueRef = ref<string>('')
const tableColumns = ref([])
const searchResult = ref<any[]>([])
const selectedRowKeys = ref([])
const modelVisible = ref<boolean>(false)
const displayLoadingRef = ref<boolean>(false)


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

const onSelectChange = (keys: any[]) => {
    console.log('selectedRowKeys changed: ', keys);
    selectedRowKeys.value = keys;
};
const handleOk = () => {
    confirmLoading.value = true;
    setTimeout(() => {
        modelVisible.value = false;
        confirmLoading.value = false;
        if (props.isMultiple) {
            emit('update:value', selectedRowKeys.value)
        } else {
            emit('update:value', selectedRowKeys.value[0])
        }
    }, 1000);
};
const showSearchDialog = () => {
    console.log('1')
    showModal()
}

const onSearch = async () => {
    // if (props.rows) {
    //     return
    // }
    // db.paginateReportTemplate(1, 10, { key: props.searchKey, value: searchValueRef.value }).then((res) => {
    //     searchResult.value = res.data
    // })
    await queryEntities()
}

const queryEntities = async () => {
    switch (props.type) {
        case 'worker':
            break
        case 'user':
            break
        case 'company':
            companyStore.pagination.page = 1
            companyStore.pagination.pagesize = 10
            companyStore.queryArgs.keyword = searchValueRef.value
            await companyStore.apiQuery()
            searchResult.value = companyStore.entities
            break
        case 'factory':
            factoryStore.pagination.page = 1
            factoryStore.pagination.pagesize = 10
            factoryStore.queryArgs.keyword = searchValueRef.value
            await factoryStore.apiQuery()
            searchResult.value = factoryStore.entities
            break
        case 'company_contact':
            break
        case 'factory_contact':
            break
        case 'report_template':
            reportTemplateStore.pagination.page = 1
            reportTemplateStore.pagination.pagesize = 10
            reportTemplateStore.queryArgs.keyword = searchValueRef.value
            await reportTemplateStore.apiQuery()
            searchResult.value = reportTemplateStore.entities
            break
        default:
            break
    }
}

const getEntity = async (ids: string[]) => {
    displayLoadingRef.value = true
    switch (props.type) {
        case 'template':
            break
        case 'worker':
            break
        case 'user':
            break
        case 'company':
            console.log('ids:', ids)
            if (ids) {
                await companyStore.apiQueryByIds(ids)
                searchResult.value = companyStore.entities
                selectedRowKeys.value = ids
                console.log('selectedRowKeys.value:', selectedRowKeys.value)
            } else {
                searchResult.value = []
            }

            break
        case 'factory':
            break
        case 'company_contact':
            break
        case 'factory_contact':
            break
        case 'report_template':
            if (ids) {
                await reportTemplateStore.apiQueryByIds(ids)
                searchResult.value = reportTemplateStore.entities
                selectedRowKeys.value = ids
                console.log('selectedRowKeys.value:', selectedRowKeys.value)
            } else {
                searchResult.value = []
            }

            break
        default:
            break
    }
    setTimeout(() => {
        displayLoadingRef.value = false
    }, 500)
}

initializeData()


defineExpose({
    getEntity
})
</script>