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
            <a-form-item :label="$t('base.AutoSave')" name="AutoSave">
                <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.AutoSave" />
            </a-form-item>

            <div class="flex">
                <a-form-item  :label="$t('base.ReportResultLabel')" name="ReportResultLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.ReportResultLabel" />
                </a-form-item>
            </div>

            <div class="flex">
                <a-form-item :label="$t('base.Applicant')" name="Applicant">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.Applicant" />
                </a-form-item>
                <a-form-item name="ApplicantLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.ApplicantLabel" />
                </a-form-item>
            </div>

            <div class="flex">
                <a-form-item :label="$t('base.Supplier')" name="Supplier">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.Supplier" />
                </a-form-item>
                <a-form-item name="SupplierLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.SupplierLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.Factory')" name="Factory">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.Factory" />
                </a-form-item>
                <a-form-item name="FactoryLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.FactoryLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.OrderNumber')" name="OrderNumber">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.OrderNumber" />
                </a-form-item>
                <a-form-item name="OrderNumberLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.OrderNumberLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.ItemNumber')" name="ItemNumber">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.ItemNumber" />
                </a-form-item>
                <a-form-item name="ItemNumberLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.ItemNumberLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.ProductDescription')" name="ProductDescription">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.ProductDescription" />
                </a-form-item>
                <a-form-item name="ProductDescriptionLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.ProductDescriptionLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.AddressOfInspection')" name="AddressOfInspection">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.AddressOfInspection" />
                </a-form-item>
                <a-form-item name="AddressOfInspectionLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.AddressOfInspectionLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.DateOfInspection')" name="DateOfInspection">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.DateOfInspection" />
                </a-form-item>
                <a-form-item name="DateOfInspectionLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.DateOfInspectionLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.ArrivalTime')" name="ArrivalTime">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.ArrivalTime" />
                </a-form-item>
                <a-form-item name="ArrivalTimeLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.ArrivalTimeLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.DepartureTime')" name="DepartureTime">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.DepartureTime" />
                </a-form-item>
                <a-form-item name="DepartureTimeLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.DepartureTimeLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.Inspector')" name="Inspector">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.Inspector" />
                </a-form-item>
                <a-form-item name="InspectorLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.InspectorLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.ReportNumber')" name="ReportNumber">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.ReportNumber" />
                </a-form-item>
                <a-form-item name="ReportNumberLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.ReportNumberLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.OrderQuantity')" name="OrderQuantity">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.OrderQuantity" />
                </a-form-item>
                <a-form-item name="OrderQuantityLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.OrderQuantityLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.SampleSizeTotal')" name="SampleSizeTotal">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.SampleSizeTotal" />
                </a-form-item>
                <a-form-item name="SampleSizeTotalLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.SampleSizeTotalLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.InspectStandard')" name="InspectStandard">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.InspectStandard" />
                </a-form-item>
                <a-form-item name="InspectStandardLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.InspectStandardLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.SampleSize')" name="SampleSize">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.SampleSize" />
                </a-form-item>
                <a-form-item name="SampleSizeLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.SampleSizeLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.AQL_CR')" name="AQL_CR">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.AQL_CR" />
                </a-form-item>
                <a-form-item name="AQL_CRLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.AQL_CRLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.AQL_MAJ')" name="AQL_MAJ">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.AQL_MAJ" />
                </a-form-item>
                <a-form-item name="AQL_MAJLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.AQL_MAJLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.AQL_MIN')" name="AQL_MIN">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.AQL_MIN" />
                </a-form-item>
                <a-form-item name="AQL_MINLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.AQL_MINLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.GeneralInspectionLevel')" name="GeneralInspectionLevel">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.GeneralInspectionLevel" />
                </a-form-item>
                <a-form-item name="GeneralInspectionLevelLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.GeneralInspectionLevelLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.SpecialInspectionLevel')" name="SpecialInspectionLevel">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.SpecialInspectionLevel" />
                </a-form-item>
                <a-form-item name="SpecialInspectionLevelLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.SpecialInspectionLevelLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.InspectionType')" name="InspectionType">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.InspectionType" />
                </a-form-item>
                <a-form-item name="InspectionTypeLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.InspectionTypeLabel" />
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item :label="$t('base.ReInspectionType')" name="ReInspectionType">
                    <a-switch v-model:checked="reportTemplateStore.reportTemplate.settings.ReInspectionType" />
                </a-form-item>
                <a-form-item name="ReInspectionTypeLabel" style="margin-left: 10px;">
                    <a-input v-model:value="reportTemplateStore.reportTemplate.settings.ReInspectionTypeLabel" />
                </a-form-item>
            </div>
        </a-form>
    </div>
</template>


<script lang="ts" setup>
import { ref, defineExpose } from "vue";
import { ReportTemplateStore } from "@/store/reportTemplate"
import { i18n } from '@/lang/i18n';
const reportTemplateStore = ReportTemplateStore()

const exportData = () => {
    return {
        title: reportTemplateStore.reportTemplate.title,
        summary: reportTemplateStore.reportTemplate.summary,
        allowSelectImageFromAlbum: reportTemplateStore.reportTemplate?.settings?.allowSelectImageFromAlbum,
        AutoSave: reportTemplateStore.reportTemplate?.settings?.AutoSave,
        ReportNumber: reportTemplateStore.reportTemplate?.settings?.ReportNumber,
        OrderQuantity: reportTemplateStore.reportTemplate?.settings?.OrderQuantity,
        SampleSizeTotal: reportTemplateStore.reportTemplate?.settings?.SampleSizeTotal,
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
        SpecialInspectionLevel: reportTemplateStore.reportTemplate?.settings?.SpecialInspectionLevel,
        InspectionType: reportTemplateStore.reportTemplate?.settings?.InspectionType,
        ReInspectionType: reportTemplateStore.reportTemplate?.settings?.ReInspectionType,
        OrderNumber: reportTemplateStore.reportTemplate?.settings?.OrderNumber,
        // labels：
        ApplicantLabel:reportTemplateStore.reportTemplate?.settings?.ApplicantLabel ||  i18n.global.t('base.Applicant'),
        SupplierLabel:reportTemplateStore.reportTemplate?.settings?.SupplierLabel ||  i18n.global.t('base.Supplier'),
        FactoryLabel:reportTemplateStore.reportTemplate?.settings?.FactoryLabel ||  i18n.global.t('base.Factory'),
        ItemNumberLabel:reportTemplateStore.reportTemplate?.settings?.ItemNumberLabel ||  i18n.global.t('base.ItemNumber'),
        ProductDescriptionLabel:reportTemplateStore.reportTemplate?.settings?.ProductDescriptionLabel ||  i18n.global.t('base.ProductDescription'),
        AddressOfInspectionLabel:reportTemplateStore.reportTemplate?.settings?.AddressOfInspectionLabel ||  i18n.global.t('base.AddressOfInspection'),
        DateOfInspectionLabel:reportTemplateStore.reportTemplate?.settings?.DateOfInspectionLabel ||  i18n.global.t('base.DateOfInspection'),
        ArrivalTimeLabel:reportTemplateStore.reportTemplate?.settings?.ArrivalTimeLabel ||  i18n.global.t('base.ArrivalTime'),
        DepartureTimeLabel:reportTemplateStore.reportTemplate?.settings?.DepartureTimeLabel ||  i18n.global.t('base.DepartureTime'),
        InspectorLabel:reportTemplateStore.reportTemplate?.settings?.InspectorLabel ||  i18n.global.t('base.Inspector'),
        ReportNumberLabel:reportTemplateStore.reportTemplate?.settings?.ReportNumberLabel ||  i18n.global.t('base.ReportNumber'),
        OrderQuantityLabel:reportTemplateStore.reportTemplate?.settings?.OrderQuantityLabel ||  i18n.global.t('base.OrderQuantity'),
        SampleSizeTotalLabel:reportTemplateStore.reportTemplate?.settings?.SampleSizeTotalLabel ||  i18n.global.t('base.SampleSizeTotal'),
        InspectStandardLabel:reportTemplateStore.reportTemplate?.settings?.InspectStandardLabel ||  i18n.global.t('base.InspectStandard'),
        SampleSizeLabel:reportTemplateStore.reportTemplate?.settings?.SampleSizeLabel ||  i18n.global.t('base.SampleSize'),
        AQL_CRLabel:reportTemplateStore.reportTemplate?.settings?.AQL_CRLabel ||  i18n.global.t('base.AQL_CR'),
        AQL_MAJLabel:reportTemplateStore.reportTemplate?.settings?.AQL_MAJLabel ||  i18n.global.t('base.AQL_MAJ'),
        AQL_MINLabel:reportTemplateStore.reportTemplate?.settings?.AQL_MINLabel ||  i18n.global.t('base.AQL_MIN'),
        GeneralInspectionLevelLabel:reportTemplateStore.reportTemplate?.settings?.GeneralInspectionLevelLabel ||  i18n.global.t('base.GeneralInspectionLevel'),
        SpecialInspectionLevelLabel:reportTemplateStore.reportTemplate?.settings?.SpecialInspectionLevelLabel ||  i18n.global.t('base.SpecialInspectionLevel'),
        InspectionTypeLabel:reportTemplateStore.reportTemplate?.settings?.InspectionTypeLabel ||  i18n.global.t('base.InspectionType'),
        ReInspectionTypeLabel:reportTemplateStore.reportTemplate?.settings?.ReInspectionTypeLabel ||  i18n.global.t('base.ReInspectionType'),
        OrderNumberLabel:reportTemplateStore.reportTemplate?.settings?.OrderNumberLabel ||  i18n.global.t('base.OrderNumber'),
        ReportResultLabel:reportTemplateStore.reportTemplate?.settings?.ReportResultLabel ||  i18n.global.t('base.ReportResultLabel'),

    }
}



defineExpose({
    exportData
})
</script>