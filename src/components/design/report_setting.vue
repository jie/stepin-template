<template>
    <div>
        <a-form :model="reportSetting" name="basic" autocomplete="off" layout="vertical">
            <a-form-item label="Title" name="title">
                <a-input v-model:value="reportTemplateStore.reportTemplate.title" />
            </a-form-item>
            <a-form-item label="Summary" name="summary">
                <a-textarea v-model:value="reportTemplateStore.reportTemplate.summary" />
            </a-form-item>
            <!-- <a-form-item label="Summary" name="summary">
                <a-range-picker :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm"
                    :placeholder="['Start Time', 'End Time']" @change="onRangeChange" @ok="onRangeOk" />
            </a-form-item> -->
            <a-form-item label="Allow Album Image" name="allowSelectImageFromAlbum">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.allowSelectImageFromAlbum" />
            </a-form-item>
        </a-form>
    </div>
</template>


<script lang="ts" setup>
import { ref, defineExpose } from "vue";
import { ReportTemplateStore } from "@/store/reportTemplate"
const reportTemplateStore = ReportTemplateStore()

const exportData = () => {
    return {
        title: reportTemplateStore.reportTemplate.title,
        summary: reportTemplateStore.reportTemplate.summary,
        allowSelectImageFromAlbum: reportTemplateStore.reportTemplate?.settings?.allowSelectImageFromAlbum
    }
}



defineExpose({
    exportData
})
</script>