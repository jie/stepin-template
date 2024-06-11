<template>
    <div class="flex">
        <div class="flex-1" v-if="props?.value">
            <Spin v-if="displayLoadingRef" /><a-button type="text">{{ displayValue }}</a-button>
        </div>
        <a-button @click="showSearchDialog">Choose</a-button>
        <a-modal width="100%" wrap-class-name="full-modal" v-model:visible="modelVisible" title="Title"
            :confirm-loading="confirmLoading" @ok="handleOk">
            <a-form ref="formRef">
                <a-form-item :label="props.searchLabel">
                    <a-input-search v-model:value="searchValueRef" placeholder="input search text" enter-button="Search"
                        @search="onSearch" />
                </a-form-item>
                <a-form-item v-if="searchResult && searchResult.length != 0">
                    <a-table size="small" bordered style="width: 100%"
                        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: props.isMultiple ? 'checkbox' : 'radio' }"
                        :columns="tableColumns" :data-source="searchResult" rowKey="id">
                        <template #bodyCell="{ column, record }">
                            <template v-if="props.type == 'order' && column.dataIndex === 'address'">
                                <span>
                                    {{ record?.address?.city?.name || record?.address?.country?.name }}
                                </span>
                            </template>
                        </template>
                    </a-table>
                </a-form-item>
                <a-empty v-else />
            </a-form>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { ReimRecordStore } from '@/store/record'
import Spin from "@/components/spin/index.vue";
const recordStore = ReimRecordStore()
const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const props = defineProps(['type', 'value', 'key', 'searchKey', 'searchLabel', 'isMultiple', 'columns', 'rows', 'display_key'])
const emit = defineEmits(['update:value', 'updateSelected'])
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
            return item[props.display_key] || item.name
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
        if (props.type == 'order') {
            tableColumns.value = [
                { title: 'Factory', dataIndex: 'factory_name' },
                { title: 'Inspect Date', dataIndex: 'inspect_date' },
                { title: 'Location', dataIndex: 'address' },
            ]
        }
    }

    queryEntities()
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
        let items = searchResult.value.filter((item) => selectedRowKeys.value.includes(item.id))
        if (props.isMultiple) {
            emit('update:value', selectedRowKeys.value)
            emit('updateSelected', items)
        } else {
            emit('update:value', selectedRowKeys.value[0])
            emit('updateSelected', items)
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
        case 'order':
            recordStore.orderPagination.page = 1
            recordStore.orderPagination.pagesize = 10
            recordStore.queryArgs.keyword = searchValueRef.value
            await recordStore.apiOrdersQuery()
            searchResult.value = recordStore.orderEntities
            break
        default:
            break
    }
}

const getEntity = async (ids: string[]) => {
    displayLoadingRef.value = true
    switch (props.type) {
        case 'order':
            if (ids) {
                try {
                    await recordStore.apiQueryByIds(ids)
                    searchResult.value = recordStore.orderEntities
                    selectedRowKeys.value = ids
                } catch (error) {
                    console.log('error:', error)
                } finally {
                    displayLoadingRef.value = false
                }

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

<style lang="less">

</style>