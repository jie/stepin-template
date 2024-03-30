<template>
    <div>
        <a-form :model="reportSetting" name="basic" autocomplete="off">
            <a-form-item :label="$t('base.Title')" name="title">
                <a-input v-model:value="reportTemplateStore.reportTemplate.title" />
            </a-form-item>
            <a-form-item :label="$t('base.Summary')" name="summary">
                <a-textarea v-model:value="reportTemplateStore.reportTemplate.summary" />
            </a-form-item>
            <!-- <a-form-item label="Summary" name="summary">
                <a-range-picker :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm"
                    :placeholder="['Start Time', 'End Time']" @change="onRangeChange" @ok="onRangeOk" />
            </a-form-item> -->
            <a-form-item :label="$t('base.AllowAlbumImage')" name="allowSelectImageFromAlbum">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.allowSelectImageFromAlbum" />
            </a-form-item>


            <a-form-item :label="$t('base.Applicant')" name="Applicant">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.Applicant" />
            </a-form-item>
            <a-form-item :label="$t('base.Supplier')" name="Supplier">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.Supplier" />
            </a-form-item>
            <a-form-item :label="$t('base.Factory')" name="Factory">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.Factory" />
            </a-form-item>
            <a-form-item :label="$t('base.ItemNumber')" name="ItemNumber">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.ItemNumber" />
            </a-form-item>
            <a-form-item :label="$t('base.ProductDescription')" name="ProductDescription">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.ProductDescription" />
            </a-form-item>
            <a-form-item :label="$t('base.AddressOfInspection')" name="AddressOfInspection">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.AddressOfInspection" />
            </a-form-item>
            <a-form-item :label="$t('base.DateOfInspection')" name="DateOfInspection">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.DateOfInspection" />
            </a-form-item>
            <a-form-item :label="$t('base.ArrivalTime')" name="ArrivalTime">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.ArrivalTime" />
            </a-form-item>
            <a-form-item :label="$t('base.DepartureTime')" name="DepartureTime">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.DepartureTime" />
            </a-form-item>
            <a-form-item :label="$t('base.Inspector')" name="Inspector">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.Inspector" />
            </a-form-item>
            <a-form-item :label="$t('base.ReportNumber')" name="ReportNumber">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.ReportNumber" />
            </a-form-item>
            <a-form-item :label="$t('base.InspectStandard')" name="InspectStandard">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.InspectStandard" />
            </a-form-item>
            <a-form-item :label="$t('base.SampleSize')" name="SampleSize">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.SampleSize" />
            </a-form-item>
            <a-form-item :label="$t('base.AQL_CR')" name="AQL_CR">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.AQL_CR" />
            </a-form-item>
            <a-form-item :label="$t('base.AQL_MAJ')" name="AQL_MAJ">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.AQL_MAJ" />
            </a-form-item>
            <a-form-item :label="$t('base.AQL_MIN')" name="AQL_MIN">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.AQL_MIN" />
            </a-form-item>
            <a-form-item :label="$t('base.GeneralInspectionLevel')" name="GeneralInspectionLevel">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.GeneralInspectionLevel" />
            </a-form-item>
            <a-form-item :label="$t('base.InspectionType')" name="InspectionType">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.InspectionType" />
            </a-form-item>
            <a-form-item :label="$t('base.ReInspectionType')" name="ReInspectionType">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.ReInspectionType" />
            </a-form-item>
            <!-- <a-form-item :label="$t('base.GeneralInspectionLevel')" name="GeneralInspectionLevel">
                <a-select v-model:checked="reportTemplateStore.reportTemplate.settings.GeneralInspectionLevel" mode="multiple">
                    <a-select-option value="I">I</a-select-option>
                    <a-select-option value="II">II</a-select-option>
                    <a-select-option value="III">III</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="$t('base.InspectionType')" name="InspectionType">
                <a-select v-model:checked="reportTemplateStore.reportTemplate.settings.InspectionType" mode="multiple">
                    <a-select-option value="PPI">PPI</a-select-option>
                    <a-select-option value="DPI">DPI</a-select-option>
                    <a-select-option value="PSI">PSI</a-select-option>
                    <a-select-option value="Re-PSI">Re-PSI</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="$t('base.ReInspectionType')" name="ReInspectionType">
                <a-select v-model:checked="reportTemplateStore.reportTemplate.settings.ReInspectionType" mode="multiple">
                    <a-select-option value="1ST">1ST</a-select-option>
                    <a-select-option value="2ND">2ND</a-select-option>
                    <a-select-option value="3RD">3RD</a-select-option>
                </a-select>
            </a-form-item> -->
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
        allowSelectImageFromAlbum: reportTemplateStore.reportTemplate?.settings?.allowSelectImageFromAlbum,
        ReportNumber: reportTemplateStore.reportTemplate?.settings?.ReportNumber,
        Applicant: reportTemplateStore.reportTemplate?.settings?.Applicant,
        Supplier: reportTemplateStore.reportTemplate?.settings?.Supplier,
        Factory: reportTemplateStore.reportTemplate?.settings?.Factory,
        ItemNumber: reportTemplateStore.reportTemplate?.settings?.ItemNumber,
        ProductDescription: reportTemplateStore.reportTemplate?.settings?.ProductDescription,
        AddressOfInspection: reportTemplateStore.reportTemplate?.settings?.AddressOfInspection,
        DateOfInspection: reportTemplateStore.reportTemplate?.settings?.DateOfInspection,
        ArrivalTime: reportTemplateStore.reportTemplate?.settings?.ArrivalTime,
        DepartureTime: reportTemplateStore.reportTemplate?.settings?.DepartureTime,
        Inspector: reportTemplateStore.reportTemplate?.settings?.Inspector,
        InspectStandard: reportTemplateStore.reportTemplate?.settings?.InspectStandard,
        SampleSize: reportTemplateStore.reportTemplate?.settings?.SampleSize,
        AQL_CR: reportTemplateStore.reportTemplate?.settings?.AQL_CR,
        AQL_MAJ: reportTemplateStore.reportTemplate?.settings?.AQL_MAJ,
        AQL_MIN: reportTemplateStore.reportTemplate?.settings?.AQL_MIN,
        GeneralInspectionLevel: reportTemplateStore.reportTemplate?.settings?.GeneralInspectionLevel,
        InspectionType: reportTemplateStore.reportTemplate?.settings?.InspectionType,
        ReInspectionType: reportTemplateStore.reportTemplate?.settings?.ReInspectionType,
    }
}



defineExpose({
    exportData
})
</script>