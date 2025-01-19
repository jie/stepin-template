<template>
    <div>
        <BaseSlot :item="props?.item">
            <a-form-item :label="props?.item?.data?.label"
                :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}`, trigger: 'change' }]">
                <a-table :dataSource="dataSource" :columns="columns" :pagination="false">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'conformed'">
                            <span v-if="record.conformed">
                                <CheckSquareOutlined style="font-size: 32px" />
                            </span>
                            <span v-else>
                                <CloseSquareOutlined style="font-size: 32px" />
                            </span>
                            <span>{{ record.conformed }}</span>
                        </template>
                        <template v-else-if="column.key === 'not_conformed'">
                            <span v-if="record.not_conformed">
                                <CheckSquareOutlined style="font-size: 32px" />
                            </span>
                            <span v-else>
                                <CloseSquareOutlined style="font-size: 32px" />
                            </span>
                            <span>{{ record.not_conformed }}</span>
                        </template>
                        <template v-else-if="column.key === 'pending'">
                            <span v-if="record.pending">
                                <CheckSquareOutlined style="font-size: 32px" />
                            </span>
                            <span v-else>
                                <CloseSquareOutlined style="font-size: 32px" />
                            </span>
                        </template>
                        <template v-else-if="column.key === 'not_applicable'">
                            <span v-if="record.not_applicable">
                                <CheckSquareOutlined style="font-size: 32px" />
                            </span>
                            <span v-else>
                                <CloseSquareOutlined style="font-size: 32px" />
                            </span>
                        </template>
                    </template>
                </a-table>

            </a-form-item>
            <div v-if="props?.item?.hasRemark" style="margin-top:10px;">
                <a-textarea v-model:value="props.value.remark" @change="onChange"
                    :placeholder="$t('base.PleaseEnterRemark')" />
            </div>
        </BaseSlot>
    </div>
</template>
<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineProps, ref, PropType, reactive, toRaw } from 'vue'
import Icon, { CheckSquareOutlined, CloseCircleFilled } from '@ant-design/icons-vue';
import { MessageOutlined } from '@ant-design/icons-vue';
import { MessageOutlinedIconType } from "@ant-design/icons-vue/lib/icons/MessageOutlined";
import { watch } from 'vue';
const props = defineProps({
    item: {
        type: Object,
    },
    value: {
        type: Array,
        default: []
    }
})

watch(() => props.item, (value) => {
    refreshValue(value)
}, { deep: true })

const columns = ref([])
const dataSource = ref([])

const emits = defineEmits(["update:value"])

const itemData = ref({
    parent_com_key: '',
    parent_key: '',
    languageType: 'single',
    conclusions: []
})

const onChange = (e) => {
    console.log('onChange:', e)
    emits('update:value', exportValue())
}


const exportData = () => {
    let data = {
        ...props.item,
        data: {
            ...itemData.value
        }

    }
    console.log('exportData-data:', toRaw(data))
    return data
}


const exportValue = () => {
    console.log('exportValue-data:', toRaw(itemData.value))
    return { ...itemData.value }
}


const refreshValue = (data: any) => {
    console.log('data:', toRaw(data))
    itemData.value = data
    let dataSourceRecords = []
    let columnRecords = []
    columnRecords.push({
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    })
    if (data?.data?.options) {
        for (let option of data?.data?.options) {

            columnRecords.push({
                title: option.label,
                dataIndex: option.value,
                key: option.value,
            })
        }

        columnRecords.push({
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark',
        })
        console.log('columnRecords:', toRaw(columnRecords))
        for (let item of data?.data?.conclusions) {
            dataSourceRecords.push({
                key: item.key,
                title: item.title,
                conformed: false,
                not_conformed: false,
                pending: false,
                not_applicable: false,
                remark: item.remark
            })
        }
    }

    columns.value = columnRecords
    dataSource.value = dataSourceRecords
}


defineExpose({
    props,
    itemData,
    exportValue,
    exportData,
    refreshValue
})

</script>