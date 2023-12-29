<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { EditFilled } from '@ant-design/icons-vue';
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    { title: 'NAME', dataIndex: 'name', width: 400 },
    { title: 'STATUS', dataIndex: 'status' },
    { title: 'REMARK', dataIndex: 'remark' },
    { title: 'CREATED', dataIndex: 'create_at' },
    { title: 'OPERATION', dataIndex: 'edit', width: 200 },
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
    record.name = undefined;
    record.remark = undefined;
    record.create_at = dayjs();
    record.children = [];
    record.status = 0;
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
                categories.value.push({ ...res });
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

const editRecord = ref<Category>();

/**
 * 编辑
 * @param record
 */
function edit(record: Category) {
    editRecord.value = record;
    copyObject(form, record);
    showModal.value = true;
}

type Status = 0 | 1;

const StatusDict = {
    0: 'disable',
    1: 'enable',
};

type Category = {
    id: string;
    name: string;
    parent_id?: string;
    remark: string;
    status: number,
    create_at: Dayjs,
    children: Category[];
};

const records = ref<Category[]>([
    {
        name: '分类1',
        id: '1',
        remark: '备注1',
        status: 1,
        create_at: dayjs('2023-12-29'),
        children: [
            {
                name: '分类1-1',
                id: '1-1',
                remark: '备注1-1',
                status: 1,
                create_at: dayjs('2023-12-29'),
                children: [],
            },
            {
                name: '分类1-2',
                id: '1-2',
                remark: '备注1-2',
                children: [],
                status: 1,
                create_at: dayjs('2023-12-29'),
            },
        ],
    },
    {
        name: '分类2',
        id: '2',
        remark: '备注2',
        status: 1,
        create_at: dayjs('2023-12-29'),
        children: [
            {
                name: '分类2-1',
                id: '2-1',
                remark: '备注2-1',
                children: [
                    {
                        name: '分类2-1-1',
                        id: '2-1-1',
                        remark: '备注2-1-1',
                        children: [],
                        status: 1,
                        create_at: dayjs('2023-12-29'),
                    },
                    {
                        name: '分类2-1-2',
                        id: '2-1-2',
                        remark: '备注2-1-2',
                        children: [],
                        status: 1,
                        create_at: dayjs('2023-12-29'),
                    }],
                status: 1,
                create_at: dayjs('2023-12-29'),
            },
            {
                name: '分类2-2',
                id: '2-2',
                remark: '备注2-2',
                children: [],
                status: 1,
                create_at: dayjs('2023-12-29'),
            },
        ],
    },
    {
        name: '分类3',
        id: '3',
        remark: '备注3',
        status: 1,
        create_at: dayjs('2023-12-29'),
        children: [
            {
                name: '分类3-1',
                id: '3-1',
                remark: '备注3-1',
                children: [],
                status: 1,
                create_at: dayjs('2023-12-29'),
            },
            {
                name: '分类3-2',
                id: '3-2',
                remark: '备注3-2',
                children: [],
                status: 1,
                create_at: dayjs('2023-12-29'),
            },
        ],
    },
    {
        name: '分类4',
        id: '4',
        remark: '备注4',
        status: 1,
        create_at: dayjs('2023-12-29'),
        children: [
            {
                name: '分类4-1',
                id: '4-1',
                remark: '备注4-1',
                children: [],
                status: 1,
                create_at: dayjs('2023-12-29'),
            },
            {
                name: '分类4-2',
                id: '4-2',
                remark: '备注4-2',
                children: [],
                status: 1,
                create_at: dayjs('2023-12-29'),
            },
        ],
    },
])

</script>
<template>
    <a-modal :title="form._isNew ? '新增' : '编辑'" v-model:visible="showModal" @ok="submit" @cancel="cancel">
        <a-form ref="formModel" :model="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }">
            <a-form-item label="名称" required name="name">
                <a-input v-model:value="form.name" />
            </a-form-item>
            <a-form-item label="父分类" name="parent_id">
                <a-select v-model:value="form.parent_id">
                    <a-select-option v-for="item in records" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="备注" required name="remark">
                <a-textarea v-model:value="form.remark" />
            </a-form-item>
            <a-form-item required label="状态" name="status">
                <a-select style="width: 90px" v-model:value="form.status" :options="[ { label: 'disable', value: 0 }, { label: 'enable', value: 1 }]" />
            </a-form-item>
            <a-form-item label="日期" name="time">
                <a-date-picker v-model:value="form.create_at" />
            </a-form-item>
        </a-form>
    </a-modal>

    <!-- 成员表格 -->
    <a-table v-bind="$attrs" :columns="columns" :dataSource="records" :pagination="false">
        <template #title>
            <div class="flex justify-between pr-4">
                <h4>分类</h4>
                <a-button type="primary" @click="addNew" :loading="formLoading">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    新增
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
                        <span class="text-subtext">{{ StatusDict[text as Status] }}</span>
                    </template>
                </a-badge>
            </template>
            <template v-else-if="column.dataIndex === 'time'">
                {{ text?.format('YYYY-MM-DD') }}
            </template>
            <template v-else-if="column.dataIndex === 'edit'">
                <a-dropdown>
                    <a class="ant-dropdown-link" @click.prevent>
                        <SettingOutlined />
                    </a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="0">
                                <a @click="edit(record)" rel="noopener noreferrer">
                                    <EditFilled />
                                    编辑
                                </a>
                            </a-menu-item>
                            <a-menu-item key="1">
                                <a @click="edit(record)" rel="noopener noreferrer">
                                    <DeleteFilled />
                                    删除
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
