<template>
    <div>
        <a-form :model="ReportSettings" name="basic" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="Has Add Button" name="hasAddRowButtonForUser">
                <a-switch v-model:checked="ReportSettings.hasAddRowButtonForUser" />
            </a-form-item>
            <a-form-item label="Title" name="title">
                <a-input v-model:value="ReportSettings.title" />
            </a-form-item>
            <a-form-item label="Summary" name="summary">
                <a-textarea v-model:value="ReportSettings.summary" />
            </a-form-item>
            <a-form-item label="Summary" name="summary">
                <a-range-picker :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm"
                    :placeholder="['Start Time', 'End Time']" @change="onRangeChange" @ok="onRangeOk" />
            </a-form-item>
        </a-form>
    </div>
</template>


<script lang="ts" setup>
import { ref } from "vue";
const ReportSettings = ref<any>({
    hasAddRowButtonForUser: true,
    title: "",
    summary: "",
    fillStartAt: "",
    fillEndAt: ""
})

const onChange = (value: Dayjs, dateString: string) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
};

const onOk = (value: Dayjs) => {
    console.log('onOk: ', value);
};

const onRangeChange = (value: [Dayjs, Dayjs], dateString: [string, string]) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
};

const onRangeOk = (value: [Dayjs, Dayjs]) => {
    console.log('onOk: ', value);
};



const onFinish = () => {

}

const onFinishFailed = () => {

}


</script>