<template>
  <div class="report relative" v-if="store.report?.schema">
    <a-modal :getContainer="() => document.body" v-model:visible="isShowEditModeDialog"
      :title="currentEditComponentRef?.title" width="100%" wrap-class-name="full-modal"
      :cancelButtonProps="{ hidden: true, }">
      <div ref="editModeRef">
        <a-form ref="editModeFormRef" layout="vertical" v-if="currentEditComponentRef">
          <div v-for="(item, index) in schemaRef" :key="item.key">
            <div class="component"
              v-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'text'">
              <reportText :item="currentEditComponentRef" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'input'">
              <reportInput :item="currentEditComponentRef"
                v-model:value="store.formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'input_group'">
              <reportInputGroup :item="currentEditComponentRef"
                v-model:value="store.formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'radio'">
              <reportRadio :item="currentEditComponentRef"
                v-model:value="store.formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'checkbox'">
              <reportCheckbox :item="currentEditComponentRef"
                v-model:value="store.formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'image'">
              <reportImage :item="currentEditComponentRef" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'image_upload'">
              <reportImageUpload :item="currentEditComponentRef"
                v-model:value="store.formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'table'">
              <reportTable :item="currentEditComponentRef"
                v-model:value="store.formState[currentEditComponentRef.key]" />
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'container'">
              <reportContainer :item="currentEditComponentRef"></reportContainer>
            </div>
            <div class="component" v-show="false"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'conclusion'">
              <reportConclusion :item="currentEditComponentRef"
                v-model:value="store.formState[currentEditComponentRef.key]"></reportConclusion>
            </div>
            <div class="component"
              v-else-if="currentEditComponentRef.key == item.key && currentEditComponentRef.type == 'collector'">
              <reportCollector :item="currentEditComponentRef"
                v-model:value="store.formState[currentEditComponentRef.key]" v-on:updateCollector="onUpdateCollector"
                v-on:updateConclusionInspectResult="onUpdateConclusionInspectResult"
                v-on:validateImagesField="onValidateImagesField" v-on:clearFieldError="onClearFieldError">
              </reportCollector>
            </div>
          </div>
        </a-form>
      </div>
      <template #footer>
        <a-button @click="onClickCancelEditMode">{{ $t('base.Cancel') }}</a-button>
        <a-button type="success" @click="goPrevItem" :disabled="currentEditComponentIndexRef == 0">{{
          $t('base.PrevItem') }}</a-button>
        <a-button type="success" @click="goNextItem"
          :disabled="currentEditComponentIndexRef == (schemaRef.length - 1)">{{
            $t('base.NextItem') }}</a-button>
        <a-button type="primary" @click="onClickConfirmSaveSingle"
          :disabled="store.report?.review_status == '1' || store.report?.review_status == '2'">{{ $t('base.Save')
          }}

          <template #icon>
            <SaveOutlined />
          </template>

        </a-button>
      </template>
    </a-modal>

    <a-modal :getContainer="() => document.body" v-model:visible="isShowSubmitDialog" :okText="$t('base.Login')"
      :title="$t('base.LoginToFillForm')" :maskClosable="false" :closable="false" @ok="handleLoginOk"
      :cancelButtonProps="{ hidden: true, }">
      <a-form :model="loginFormData" layout="vertical">
        <a-form-item :label="$t('base.Email')" name="email" required>
          <a-input v-model:value="loginFormData.email"></a-input>
        </a-form-item>
        <a-form-item :label="$t('base.Password')" name="password" required>
          <a-input type="password" v-model:value="loginFormData.password"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal :getContainer="() => document.body" v-model:visible="loadLocalDataDialogRef"
      :title="$t('base.FindLatestLocalData')" @ok="handleConfirmUseLocalData">
      <div>
        <div><span>{{ $t('base.LocalDataUpdateAt') }}:</span><span>{{ localDataRecord.update_at }}</span></div>
        <div><span>{{ $t('base.RemoteDataUpdateAt') }}:</span><span>{{ store.report.update_at }}</span></div>
        <div>
          <a-popconfirm :getPopupContainer="triggerNode => { return triggerNode.parentNode || document.body; }"
            v-if="localDataRecord" @confirm="onDeleteLocalData" :title="$t('base.ConfirmDelete')"
            :ok-text="$t('base.Yes')" :cancel-text="$t('base.No')">
            <a-button danger>{{ $t('base.DeleteLocalData') }}</a-button>
          </a-popconfirm>
        </div>

      </div>
    </a-modal>

    <!-- <a-drawer v-model:visible="isShowCatalogRef" class="custom-class" style="color: red" title="Basic Drawer"
      placement="right">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer> -->
    <div v-show="!isShowSubmitDialog" class="report-items-wrapper">

      <div v-if="loadingRef"
        style="display:flex; justify-content: center; align-items: center; width: 100%; height: 100%; z-index: 1000;position: absolute;left:0;top:0;right:0;bottom:0;background-color: rgba(255, 255, 255, 0.8);">
        <Spin font-size="60px" />
      </div>
      <div class="flex">
        <img style="width:100%;" src="https://qcplatformassets.yilaw-ec.com/logo/ecqa_email_banner_hd.jpg"
          data-v-c2fb76a6="">
      </div>
      <div class="flex" style="padding: 10px;" v-if="store.report?.title">
        <div style="flex: 1">
          <div class="title">
            <div>{{ store.report?.title }}</div>
          </div>
          <div class="summary" v-if="store.report?.summary">
            <div>{{ store.report?.summary }}</div>
          </div>
        </div>
      </div>
      <div style="padding-left: 20px; padding-right: 20px" v-if="store.report?.review_status == '-1'">
        <a-alert :message="$t('base.report_fail_need_refill')" type="error" show-icon />
      </div>
      <div style="padding-left: 20px; padding-right: 20px" v-if="store.report?.review_status == '1'">
        <a-alert :message="$t('base.report_waiting_review')" type="info" show-icon />
      </div>
      <div style="padding-left: 20px; padding-right: 20px" v-if="store.report?.review_status == '2'">
        <a-alert :message="$t('base.report_pass_review')" type="success" show-icon />
      </div>
      <a-form layout="vertical" ref="formRef" :model="store.formState" v-if="store.formState && store.report"
        @finish="onFinishSubmit" @submit.prevent @finishFailed="onFinishFailed">
        <div v-if="store.report">
          <div class="component meta">
            <a-form-item name="ReportResult"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.ReportResult') }), validator: validateRequired }]"
              :label="$t('base.ReportResult')">
              <a-radio-group v-model:value="store.formState['ReportResult']" :options="reportResultOptions">
                <template #label="{ value }">
                  <span style="color: red">{{ value }}</span>
                </template>
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="component meta"
            v-if="store.formState['ReportResult'] == '0' || store.formState['ReportResult'] == '1'">
            <a-form-item name="ReportResultRemark"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.ReportResultRemark') }), validator: validateRequired }]"
              :label="$t('base.ReportResultRemark')">
              <a-textarea v-model:value="store.formState['ReportResultRemark']"></a-textarea>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ReportNumber">
            <a-form-item name="ReportNumber"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.ReportNumber') }), validator: validateRequired }]"
              :label="$t('base.ReportNumber')">
              <a-input v-model:value="store.formState['ReportNumber']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Applicant">
            <a-form-item name="Applicant"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.Applicant') }), validator: validateRequired }]"
              :label="$t('base.Applicant')">
              <a-input v-model:value="store.formState['Applicant']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Supplier">
            <a-form-item name="Supplier"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.Supplier') }), validator: validateRequired }]"
              :label="$t('base.Supplier')">
              <a-input v-model:value="store.formState['Supplier']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Factory">
            <a-form-item name="Factory"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.Factory') }), validator: validateRequired }]"
              :label="$t('base.Factory')">
              <a-input v-model:value="store.formState['Factory']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ProductDescription">
            <a-form-item name="ProductDescription"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.ProductDescription') }), validator: validateRequired }]"
              :label="$t('base.ProductDescription')">
              <a-textarea v-model:value="store.formState['ProductDescription']" allowClear></a-textarea>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.AddressOfInspection">
            <a-form-item name="AddressOfInspection"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.AddressOfInspection') }), validator: validateRequired }]"
              :label="$t('base.AddressOfInspection')">
              <a-input v-model:value="store.formState['AddressOfInspection']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.DateOfInspection">
            <a-form-item name="DateOfInspection"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.DateOfInspection') }), validator: validateRequired }]"
              :label="$t('base.DateOfInspection')">
              <a-date-picker style="width: 100%" v-model:value="store.formState['DateOfInspection']"
                :getPopupContainer="triggerNode => triggerNode.parentNode" />
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ArrivalTime">
            <a-form-item name="ArrivalTime"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.ArrivalTime') }), validator: validateRequired }]"
              :label="$t('base.ArrivalTime')">
              <a-date-picker style="width: 100%" :show-time="{ format: 'HH:mm' }"
                v-model:value="store.formState['ArrivalTime']"
                :getPopupContainer="triggerNode => triggerNode.parentNode" />
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.DepartureTime">
            <a-form-item name="DepartureTime"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.DepartureTime') }), validator: validateRequired }]"
              :label="$t('base.DepartureTime')">
              <a-date-picker style="width: 100%" :show-time="{ format: 'HH:mm' }"
                v-model:value="store.formState['DepartureTime']"
                :getPopupContainer="triggerNode => triggerNode.parentNode" />
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.Inspector">
            <a-form-item name="Inspector"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.Inspector') }), validator: validateRequired }]"
              :label="$t('base.Inspector')">
              <a-input v-model:value="store.formState['Inspector']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.InspectionStandard">
            <a-form-item name="InspectionStandard"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.InspectionStandard') }), validator: validateRequired }]"
              :label="$t('base.InspectionStandard')">
              <a-input v-model:value="store.formState['InspectionStandard']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ItemNumber">
            <a-form-item name="ItemNumber"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.ItemNumber') }), validator: validateRequired }]"
              :label="$t('base.ItemNumber')">
              <a-select v-model:value="store.formState['ItemNumber']" mode="tags" style="width: 100%"></a-select>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.GeneralInspectionLevel">
            <a-form-item name="GeneralInspectionLevel"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.GeneralInspectionLevel') }), validator: validateRequired }]"
              :label="$t('base.GeneralInspectionLevel')">
              <a-radio-group v-model:value="store.formState['GeneralInspectionLevel']" allowClear>
                <a-radio value="I">I</a-radio>
                <a-radio value="II">II</a-radio>
                <a-radio value="III">III</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.SpecialInspectionLevel">
            <a-form-item name="SpecialInspectionLevel"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.SpecialInspectionLevel') }), validator: validateRequired }]"
              :label="$t('base.SpecialInspectionLevel')">
              <a-radio-group v-model:value="store.formState['SpecialInspectionLevel']" allowClear>
                <a-radio value="S-1">S-1</a-radio>
                <a-radio value="S-2">S-2</a-radio>
                <a-radio value="S-3">S-3</a-radio>
                <a-radio value="S-4">S-4</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.OrderQuantity">
            <a-form-item name="OrderQuantity"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.OrderQuantity') }), validator: validateRequired }]"
              :label="$t('base.OrderQuantity')">
              <a-input v-model:value="store.formState['OrderQuantity']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ReportNumber">
            <a-row style="width: 100%" :gutter="[16, 16]">
              <a-col :span="8">
                <a-form-item name="AQL_CR"
                  :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.AQL_CR') }), validator: validateRequired }]"
                  :label="$t('base.AQL_CR')">
                  <a-select v-model:value="store.formState['AQL_CR']" :options="aclList" allowClear
                    :getPopupContainer="() => document.body"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="AQL_MAJ"
                  :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.AQL_MAJ') }), validator: validateRequired }]"
                  :label="$t('base.AQL_MAJ')">
                  <a-select v-model:value="store.formState['AQL_MAJ']" :options="aclList" allowClear
                    :getPopupContainer="() => document.body"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="AQL_MIN"
                  :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.AQL_MIN') }), validator: validateRequired }]"
                  :label="$t('base.AQL_MIN')">
                  <a-select v-model:value="store.formState['AQL_MIN']" :options="aclList" allowClear
                    :getPopupContainer="() => document.body"></a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.SampleSizeTotal">
            <a-form-item name="SampleSizeTotal"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.SampleSizeTotal') }), validator: validateRequired }]"
              :label="$t('base.SampleSizeTotal')">
              <a-input v-model:value="store.formState['SampleSizeTotal']" allowClear></a-input>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.InspectionType">
            <a-form-item name="InspectionType"
              :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', { 'label': $t('base.InspectionType') }), validator: validateRequired }]"
              :label="$t('base.InspectionType')">
              <a-select v-model:value="store.formState['InspectionType']" allowClear
                :getPopupContainer="() => document.body">
                <a-select-option value="PPI">PPI</a-select-option>
                <a-select-option value="DPI">DPI</a-select-option>
                <a-select-option value="PSI">PSI</a-select-option>
                <a-select-option value="Re-PSI">Re-PSI</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="component meta" v-if="store.report?.template?.settings?.ReInspectionType">
            <!-- <a-form-item name="ReInspectionType" :rules="[{ required: true, trigger: 'change', message: $t('base.pleaseSetFieldValue', {'label': $t('base.ReInspectionType')}), validator: validateRequired }]" :label="$t('base.ReInspectionType')"> -->
            <a-form-item name="ReInspectionType" :label="$t('base.ReInspectionType')">
              <a-select v-model:value="store.formState['ReInspectionType']" allowClear
                :getPopupContainer="() => document.body">
                <a-select-option value="1ST">1ST</a-select-option>
                <a-select-option value="2ST">2ST</a-select-option>
                <a-select-option value="3ST">3ST</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </div>
        <!-- <div v-for="(item, index) in schemaRef" :key="item.key" class="component-wrapper" -->
        <div v-for="(item, index) in schemaRef" :key="item.key" class="component-wrapper"
          v-show="item.type != 'conclusion'"
          :class="{ 'notpass': store.report?.review_comments[item.key]?.status == false, 'pass': store.report?.review_comments[item.key]?.status == true }">
          <div class="component" :id="`com-${item.key}`" v-if="item.type == 'text'">
            <reportText :item="item" ref="itemRefs" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'input'">
            <reportInput :item="item" ref="itemRefs" v-model:value="store.formState[item.key]" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'input_group'">
            <reportInputGroup :item="item" ref="itemRefs" v-model:value="store.formState[item.key]" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'radio'">
            <reportRadio :item="item" v-model:value="store.formState[item.key]" ref="itemRefs" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'checkbox'">
            <reportCheckbox :item="item" v-model:value="store.formState[item.key]" ref="itemRefs" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'image'">
            <reportImage :item="item" ref="itemRefs" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'image_upload'">
            <reportImageUpload :item="item" v-model:value="store.formState[item.key]" ref="itemRefs" />
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'table'">
            <reportTable :item="item" v-model:value="store.formState[item.key]" ref="itemRefs"></reportTable>
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'container'">
            <reportContainer :item="item" ref="itemRefs"></reportContainer>
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'conclusion'">
            <reportConclusion :item="item" ref="itemRefs" v-model:value="store.formState[item.key]"></reportConclusion>
          </div>
          <div class="component" :id="`com-${item.key}`" v-else-if="item.type == 'collector'">
            <reportCollector :item="item" ref="itemRefs" v-model:value="store.formState[item.key]"
              v-on:updateCollector="onUpdateCollector"
              v-on:updateConclusionInspectResult="onUpdateConclusionInspectResult"
              v-on:validateImagesField="onValidateImagesField" v-on:clearFieldError="onClearFieldError">
            </reportCollector>
          </div>
          <div class="component" :id="`com-${item.key}`" v-else>unsupported components: {{ item }}</div>
          <div v-if="store.report?.review_comments[item.key]?.comment">{{ $t('base.Comment') }}: {{
            store.report?.review_comments[item.key].comment }}</div>
          <div class="edit-mode" @click="onClickShowEditMode(item, index)">{{ $t('base.Edit') }}</div>
        </div>

        <a-affix :offset-bottom="20" @change="affixedChange">
          <div class="controls border-t"
            :class="{ 'affixed-style': isAffixedRef, 'unaffixed-style': !isAffixedRef, 'toggleSubmitControls': isToggleSubmitControlsRef }"
            style="">
            <div class="controls-wrapper" v-if="['-1', '0'].includes(store.report.review_status)">
              <a-button type="primary" class="submit-btn" @click="onClickSubmit"
                :disabled="store.report.review_status == '1' || store.report.review_status == '2'">{{
                  $t('base.Submit')
                }}</a-button>
              <a-button plain class="save-btn" @click="onClickSave"
                :disabled="store.report.review_status == '1' || store.report.review_status == '2'">{{ $t('base.Save')
                }}</a-button>
              <a-button plain style="margin-left: 10px;" @click="showLocalDataDialog" v-if="localDataRecord">{{
                $t('base.ViewLocalData')
                }}</a-button>
            </div>
            <div v-else>{{ $t('base.report_not_in_fill_status') }}: {{ store.report.review_status }}</div>
          </div>
          <a-button class="controls-switch" type="primary" shape="circle" size="large"
            @click="openSubmitControls" v-if="isAffixedRef">
            <template #icon>
              <VerticalLeftOutlined v-if="isToggleSubmitControlsRef == true"/>
              <VerticalRightOutlined v-else />
            </template>
          </a-button>
        </a-affix>

      </a-form>
    </div>
    <div class="catalog" v-if="isShowCatalogRef">
      <a-button type="primary" class="hide-catalog" shape="circle" size="large" @click="isShowCatalogRef = false">
        <template #icon>
          <VerticalRightOutlined />
        </template>
      </a-button>

      <div v-for="item in schemaRef.filter(c => c.type != 'conclusion')" class="item">
        <div @click="goAnchor(item.key)">{{ item.title }}</div>
      </div>
    </div>

    <a-affix :offset-top="60">
      <a-button class="catalog-show" v-if="!isShowCatalogRef" type="primary" shape="circle" size="large"
        @click="isShowCatalogRef = true">
        <template #icon>
          <VerticalLeftOutlined />
        </template>
      </a-button>
    </a-affix>

    <!-- <div v-if="isShowCatalogRef" class="catalog">
      <a-button type="primary" class="hide-catalog" shape="circle" size="large" @click="isShowCatalogRef = false">
        <template #icon>
          <VerticalRightOutlined />
        </template>
      </a-button>

      <div v-for="item in schemaRef" class="item">
        <div @click="goAnchor(item.key)">{{ item.title }}</div>
      </div>
    </div> -->

  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, toRaw, reactive, watchEffect, readonly, createVNode } from 'vue';
import reportTable from "./reportTable/index.vue"
import reportText from "./reportText/index.vue"
import reportInput from "./reportInput/index.vue"
import reportInputGroup from "./reportInputGroup/index.vue"
import reportRadio from "./reportRadio/index.vue"
import reportCheckbox from "./reportCheckbox/index.vue"
import reportImage from "./reportImage/index.vue"
import reportImageUpload from "./reportImageUpload/index.vue"
import reportConclusion from "./reportConclusion/index.vue"
import reportCollector from "./reportCollector/index.vue"
import reportContainer from "./container.vue"
import { reportDatabase } from "@/hook/dexie_hook"
import { useRoute } from "vue-router"
import { CheckCircleFilled, CheckOutlined, VerticalRightOutlined } from '@ant-design/icons-vue';
import { openNotification, successNotification } from '@/utils/notification';
// import { copyObject } from "@/utils/objectUtils"
import { i18n } from '@/lang/i18n';
import Spin from "@/components/spin/index.vue"
import { ReportFillStore } from '@/store/report_fill';
import { approveStatusDisplayMsg, customerApproveStatusMsg } from "@/utils/constant"
import { useAccountStore } from '@/store';
import { Modal } from 'ant-design-vue';
import { determineStatus } from "@/utils/helpers"
import { message, Form } from 'ant-design-vue';
import { aclList, batchSizeData, qualityLimitation, getDefectiveLimitation, getAqlOptions, getSampleSizeAndAqlLimitation } from '@/utils/sampling';
import dayjs from 'dayjs';
const useForm = Form.useForm;
const route = useRoute()
const document = window.document
const store = ReportFillStore()
const isToggleSubmitControlsRef = ref(true)
const isAffixedRef = ref(false)
const loadingRef = ref(false)
const formRef = ref()
const editModeFormRef = ref()
const reportDataRef = ref()
const itemRefs = ref([])
const schemaRef = ref([])
const loadLocalDataDialogRef = ref(false)
const localDataRecord = ref(null)
const startedRef = ref(false)
const currentEditComponentRef = ref(null)
const currentEditComponentIndexRef = ref(-1)
const isShowCatalogRef = ref(false)
const documentRef = document
const affixedChange = (affixed: boolean) => {
  isAffixedRef.value = affixed
};
const isShowEditModeDialog = ref(false)

const reportResultOptions = [
  { label: i18n.global.t(`base.ResultPassed`), value: '3' },
  { label: i18n.global.t(`base.ResultPending`), value: '1' },
  { label: i18n.global.t(`base.ResultFailed`), value: '0' },
];

const accountStore = useAccountStore()
const initialization = async () => {
  console.log('initialization:', toRaw(store.report.template?.items))
  // if (store.report?.values && Object.keys(store.report?.values).length != 0) {
  //   schemaRef.value = store.report.schema
  // } else {
  //   schemaRef.value = store.report.template?.items
  // }
  schemaRef.value = store.report.template?.items

  // if(store.report.template?.items && store.report.template?.items.length > 0) {
  //   for(let item of store.report.template.items) {
  //     console.log('initialization-item:', item)
  //     if(item.type == 'collector') {
  //       store.formState[item.key] = null
  //       if(store.report.values && store.report.values[item.key]) {
  //         store.formState[item.key] = store.report.values[item.key]
  //       }
  //     }
  //   }
  // }


  // loadLocalData()
  // loadRemoteData()
  // let localData = await loadLocalData()
  // console.log('localData:', localData)
  // if (localData && localData.values && localData.values.length != 0) {
  //   if (dayjs(localData.update_at) > dayjs(store.report.update_at)) {
  //     localDataRecord.value = localData
  //   }
  // }
}

const showLocalDataDialog = () => {
  loadLocalDataDialogRef.value = true
}

const openSubmitControls = () => {
  isToggleSubmitControlsRef.value = !isToggleSubmitControlsRef.value
}

const onOpenForm = async () => {
  if (route.query.fill_token) {
    console.log('store.formState:', toRaw(store.formState))
    let result;
    try {
      result = await accountStore.apiFillFormLogin("", "", route?.query?.fill_token)
      console.log('onOpenForm=result:', result)
    } catch (e) {
      openNotification({
        type: "error",
        message: i18n.global.t(`base.LoginFail`),
        description: i18n.global.t(`base.LoginFailByFillToken`)
      })
    }
  }
  let fillSession = getFillSession()
  if (!fillSession) {
    isShowSubmitDialog.value = true
    return
  }
  if (((dayjs() - dayjs(fillSession.user_data.create_at)) / 3600000) > 48) {
    localStorage.removeItem("fill_session")
    isShowSubmitDialog.value = true
    return
  }
  initialization()
}

const onLocalSave = async () => {
  let record
  try {
    record = await reportDatabase.getRecord(store.report.id)
  } catch (e) {
    console.error(e)
  }
  console.log('store.formState:', toRaw(store.formState))
  if (!record) {
    await reportDatabase.createRecord({ id: store.report.id, values: JSON.stringify(store.formState) })
  } else {
    await reportDatabase.updateRecord({ id: store.report.id, values: JSON.stringify(store.formState) })
  }
  // successNotification("Saved")
}

const loadLocalData = async () => {
  let localRecord
  try {
    localRecord = await reportDatabase.getRecord(store.report.id)
  } catch (e) {
    console.warn(e)
  }
  if (!localRecord) {
    return
  }
  let values = JSON.parse(localRecord.values)
  return {
    id: localRecord.id,
    create_at: localRecord.create_at,
    update_at: localRecord.update_at,
    values: values
  }
}

const loadRemoteData = async () => {

}

const editableComponents = [
  "input",
  "input_group",
  "radio",
  "checkbox",
  "image_upload",
  "table",
]

const refresh = (data: any) => {
  loadingRef.value = true
  reportDataRef.value = data
  // store.report.values = data.values
  setTimeout(() => {
    store.report.schema.map((item: any) => {
      // if (item.refreshValue && item.props.item.data) {
      //   item.refreshValue(item.props.item.data)
      // }
      if (editableComponents.includes(item.type)) {
        if (item.type == 'input') {
          item.data = { value: '' }
        } else if (item.type == 'radio') {
          if (!item.data.value) {
            item.data.value = ""
          }
        } else if (item.type == 'checkbox') {
          if (!item.data.value) {
            item.data.value = []
          }
        }

        console.log('item.key:', item.key, ', data:', toRaw(item.data))
      }
    })
    loadingRef.value = false
    startedRef.value = true
    loadRemoteData()
  }, 2000)

}


const isShowSubmitDialog = ref(false)
const loginFormData = reactive({
  email: "",
  password: ""
})

const onSubmitReport = async () => {
  console.log('onSubmitReport:', toRaw(store.formState))
  let fillSession = getFillSession()
  if (!fillSession) {
    isShowSubmitDialog.value = true
    return
  }
  try {
    await store.apiSubmit(fillSession.email, fillSession.password, store.formState, route?.query?.fill_token)
  } catch (e) {
    console.log(e)
    openNotification({
      type: "error",
      message: "Submit Report Fail",
      description: e?.data?.message
    })
    return
  } finally {
    onLocalSave()
  }

  openNotification({
    type: "success",
    message: "OK",
    description: i18n.global.t('base.ReportSubmitted')
  })
}

const onFinishSubmit = async () => {
  console.log('onFinishSubmit-onFill:', toRaw(store.formState))
  let fillSession = getFillSession()
  if (!fillSession) {
    isShowSubmitDialog.value = true
    return
  }
  try {
    await store.apiFill(fillSession.email, fillSession.password, store.formState, route?.query?.fill_token)
  } catch (e) {
    console.log(e)
    openNotification({
      type: "error",
      message: "Save Report Fail",
      description: e?.data?.message
    })
    return
  } finally {
    onLocalSave()
  }

  openNotification({
    type: "success",
    message: 'OK',
    description: i18n.global.t('base.SuccessSaved')
  })
}
const onFinishFailed = (e) => {
  console.log('onFinishFailed:', e, e.errorFields)
  if (e.errorFields) {
    e.errorFields.map((item) => {
      if (item.errors) {
        openNotification({
          type: "error",
          message: "Validate Fail",
          description: item.errors
        })

      }
    })
    console.log('errorFields:', toRaw(e.errorFields[0]))
  }
}

const validateRequired = (rule, value, callback) => {
  // console.log('validateRequired-rule:', rule, ', value:', value)
  let result = true
  if (rule.required && (store.formState[rule.field] == null || store.formState[rule.field] == "" || store.formState[rule.field] == undefined)) {
    result = false
  }
  return new Promise((resolve, reject) => {
    if (result) {
      resolve(true)
    } else {
      reject('Please enter ' + rule.field)
    }
  });
}

const onClearFieldError = (fieldName) => {
  formRef.value.clearValidate([fieldName]);
  if (isShowEditModeDialog.value == true) {
    editModeFormRef.value.clearValidate([fieldName]);
  }
};

const onValidateImagesField = (fieldName) => {
  formRef.value.validateFields([fieldName]);
  if (isShowEditModeDialog.value == true) {
    editModeFormRef.value.validateFields([fieldName]);
  }
};

const handleLoginOk = async () => {
  console.log('store.formState:', toRaw(store.formState))
  let result;
  try {
    result = await accountStore.apiFillFormLogin(loginFormData.email, loginFormData.password)
    console.log('result:', result)
  } catch (e) {
    console.log('e:', toRaw(e))
    if (e?.data?.status == false) {
      openNotification({
        type: "error",
        message: "Error",
        description: e.data.message
      })
    } else {
      openNotification({
        type: "error",
        message: "Error",
        description: e.message
      })
    }

  }
  if (result) {
    successNotification(i18n.global.t('base.LoginSuccess'))
    isShowSubmitDialog.value = false
    initialization()
  }
}

const handleConfirmUseLocalData = async () => {
  for (let key of Object.keys(localDataRecord.value.values)) {
    store.formState[key] = localDataRecord.value.values[key]
  }
  loadLocalDataDialogRef.value = false
}

const onDeleteLocalData = () => {
  try {
    reportDatabase.deleteRecord(store.report.id)
    successNotification("local_data_deleted")
    localDataRecord.value = null
  } catch (e) {
    console.error(e)
    openNotification({
      type: "error",
      message: "Fail delete local data",
      description: e.message
    })
  }
}

const getFillSession = () => {
  let fillSession = localStorage.getItem("fill_session")
  if (fillSession) {
    return JSON.parse(fillSession)
  } else {
    return null
  }
}

const onClickShowEditMode = (item: any, index: number) => {
  isShowEditModeDialog.value = true
  console.log('onClickShowEditMode-item:', toRaw(item), toRaw(store.formState[item.key]))
  // item to editModeRef
  currentEditComponentRef.value = item
  currentEditComponentIndexRef.value = index
}

const goNextItem = () => {
  let index = schemaRef.value.findIndex((item) => item.key == currentEditComponentRef.value.key)
  if (index < schemaRef.value.length - 1) {
    currentEditComponentRef.value = schemaRef.value[index + 1]
    currentEditComponentIndexRef.value = index + 1
  }
}

const goPrevItem = () => {
  let index = schemaRef.value.findIndex((item) => item.key == currentEditComponentRef.value.key)
  if (index > 0) {
    currentEditComponentRef.value = schemaRef.value[index - 1]
    currentEditComponentIndexRef.value = index - 1
  }
}

const onClickConfirmSaveSingle = async () => {
  loadingRef.value = true
  let fillSession = getFillSession()
  if (!fillSession) {
    message.error(i18n.global.t('base.PleaseLoginFirst'))
    return
  }
  try {
    let values = { [currentEditComponentRef.value.key]: store.formState[currentEditComponentRef.value.key] }
    await store.apiFillSingle({
      id: store.report.id,
      values: { [currentEditComponentRef.value.key]: store.formState[currentEditComponentRef.value.key] },
      email: fillSession.email,
      password: fillSession.password
    })

    Modal.confirm({
      content: i18n.global.t('base.SuccessSaved'),
      getContainer: () => document.body,
      async onOk() {
        currentEditComponentRef.value = schemaRef.value[currentEditComponentIndexRef.value + 1]
        currentEditComponentIndexRef.value = currentEditComponentIndexRef.value + 1
      },
      icon: createVNode(CheckCircleFilled),
      cancelText: i18n.global.t('base.Cancel'),
      okText: i18n.global.t('base.NextItem'),
      onCancel() {
        Modal.destroyAll();
      },
    });

  } catch (e) {
    console.error(e)
    openNotification({
      type: "error",
      message: i18n.global.t('base.LoginFailByFillToken'),
      description: i18n.global.t('base.LoginFailByFillToken')
    })
    return
  } finally {
    onLocalSave()
    loadingRef.value = false
  }


  if (currentEditComponentIndexRef.value < schemaRef.value.length - 1) {


  } else {
    isShowEditModeDialog.value = false
    currentEditComponentRef.value = null
    currentEditComponentIndexRef.value = null

    Modal.confirm({
      content: i18n.global.t('base.YouHaveCompleteAllItemsNeedSubmit'),
      getContainer: () => document.body,
      async onOk() {
        store.isValidateForm = true
        await onSubmitReport()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      },
      cancelText: i18n.global.t('base.Cancel'),
      okText: i18n.global.t('base.Submit'),
      onCancel() {
        Modal.destroyAll();
      },
    });
  }
}


const focusOnField = (fieldName) => {
  formRef.value.scrollToField(fieldName, { behavior: 'smooth' });
};


const onClickSubmit = () => {
  Modal.confirm({
    content: i18n.global.t('base.ConfirmSubmitReport'),
    getContainer: () => document.body,
    async onOk() {
      store.isValidateForm = true
      formRef.value.validate().then(async () => {
        await onSubmitReport()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }).catch((error) => {
        console.log('Validation failed:', toRaw(error));
        if (error?.errorFields?.length > 0 && error.errorFields[0]?.name?.length > 0) {
          console.log('formFieldName-error.errorFields[0].name[0]:', error.errorFields[0].name[0])
          // let formFieldNameArr = error.errorFields[0].name[0].split('-')
          // let formFieldName = formFieldNameArr[formFieldNameArr.length - 1]
          // console.log('formFieldName:', formFieldName, formFieldNameArr)
          goCollectorAnchor(error.errorFields[0].name[0])
        }
      });
    },
    cancelText: i18n.global.t('base.Cancel'),
    okText: i18n.global.t('base.Submit'),
    onCancel() {
      Modal.destroyAll();
    },
  });
}

const onClickSave = async () => {
  // await onSubmitReport()
  await onFinishSubmit()
}



const onClickCancelEditMode = () => {
  isShowEditModeDialog.value = false
  currentEditComponentRef.value = null
  currentEditComponentIndexRef.value = null
}

const onUpdateCollector = (collector: any) => {
  let conclusionCom = store.report.template?.items.find(c => c.key == collector?.data?.conclusion_key)
  let conclusionItem
  if (conclusionCom?.data?.conclusions) {
    conclusionItem = conclusionCom?.data?.conclusions.find(c => c.key == collector?.data?.conclusion_item_key)
  }
  let collectorValue = store.formState[collector.key]
  if (collectorValue && collectorValue?.data?.dataRecords && collectorValue?.data?.dataRecords.length > 0) {
    let statuses = []
    for (let record of collectorValue?.data?.dataRecords) {
      for (let field of record) {
        if (field.value == 'status') {
          statuses.push({ status: field.data })
        }
      }
    }

    let conclusionComItem = store.formState[conclusionCom.key]?.data?.conclusions?.find(c => c.key == conclusionItem.key)
    if (!conclusionComItem) {
      store.formState[conclusionCom.key] = { "data": { "conclusions": store.report.template?.items.find(c => c.key == conclusionCom.key).data.conclusions } }
      conclusionComItem = store.formState[conclusionCom.key]?.data?.conclusions?.find(c => c.key == conclusionItem.key)
    }
    if (determineStatus(statuses)) {
      conclusionComItem.status = determineStatus(statuses)
    }
  }
  if (conclusionCom?.data?.parent_com_key) {
    let parentCom = store.report.template?.items.find(c => c.key == conclusionCom?.data?.parent_com_key)
    if (parentCom) {
      let parentItem = parentCom?.data?.conclusions.find(c => c.key == conclusionCom?.data?.parent_key)
      if (parentItem && store.formState[conclusionCom.key]?.data?.conclusions && store.formState[conclusionCom.key]?.data?.conclusions?.length != 0) {
        let parentStatuses = []
        for (let item of store.formState[conclusionCom.key]?.data?.conclusions) {
          parentStatuses.push({ status: item.status })
        }
        if (!store.formState[parentCom.key]) {
          store.formState[parentCom.key] = { "data": { "conclusions": store.report.template?.items.find(c => c.key == parentCom.key).data.conclusions } }
        }
        let ParentConclusionItem = store.formState[parentCom.key].data.conclusions.find(c => c.key == conclusionCom?.data?.parent_key)
        if (determineStatus(parentStatuses)) {
          ParentConclusionItem.status = determineStatus(parentStatuses)
        }
      }
    }
  }
}


const onUpdateConclusionInspectResult = (collector: any, status: string, remark: string) => {
  let conclusionCom = store.report.template?.items.find(c => c.key == collector?.data?.conclusion_key)
  let conclusionItem
  if (conclusionCom?.data?.conclusions) {
    conclusionItem = conclusionCom?.data?.conclusions.find(c => c.key == collector?.data?.conclusion_item_key)
  }
  let conclusionComItem = store.formState[conclusionCom.key]?.data?.conclusions?.find(c => c.key == conclusionItem.key)
  if (!conclusionComItem) {
    store.formState[conclusionCom.key] = { "data": { "conclusions": store.report.template?.items.find(c => c.key == conclusionCom.key).data.conclusions } }
    conclusionComItem = store.formState[conclusionCom.key]?.data?.conclusions?.find(c => c.key == conclusionItem.key)
  }
  conclusionComItem.status = status
  conclusionComItem.remark = remark
  if (conclusionCom?.data?.parent_com_key) {
    let parentCom = store.report.template?.items.find(c => c.key == conclusionCom?.data?.parent_com_key)
    if (parentCom) {
      let parentItem = parentCom?.data?.conclusions.find(c => c.key == conclusionCom?.data?.parent_key)
      if (parentItem && store.formState[conclusionCom.key]?.data?.conclusions && store.formState[conclusionCom.key]?.data?.conclusions?.length != 0) {
        let parentStatuses = []
        for (let item of store.formState[conclusionCom.key]?.data?.conclusions) {
          parentStatuses.push({ status: item.status })
        }
        if (!store.formState[parentCom.key]) {
          store.formState[parentCom.key] = { "data": { "conclusions": store.report.template?.items.find(c => c.key == parentCom.key).data.conclusions } }
        }
        let ParentConclusionItem = store.formState[parentCom.key].data.conclusions.find(c => c.key == conclusionCom?.data?.parent_key)
        if (determineStatus(parentStatuses)) {
          ParentConclusionItem.status = determineStatus(parentStatuses)
        }

      }
    }
  }
}


const goAnchor = (key: string) => {
  let anchor = document.getElementById(`com-${key}`)
  if (anchor) {
    anchor.scrollIntoView({
      behavior: "smooth"
    })
  }
}

const goCollectorAnchor = (key: string) => {
  let anchor = document.getElementById(`${key}`)
  if (anchor) {
    anchor.scrollIntoView({
      behavior: "smooth"
    })
  }
}


watchEffect(() => {
  if (isShowEditModeDialog.value) {
    // add overflow hidden to <html> element to prevent scrolling
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = 'auto'
    currentEditComponentRef.value = null
    currentEditComponentIndexRef.value = -1
  }
})


const updateAqlValues = () => {
  let result = getSampleSizeAndAqlLimitation(store.report.values.OrderQuantity, store.report.values.GeneralInspectionLevel || store.report.values.SpecialInspectionLevel, store.report.values.AQL_CR, store.report.values.AQL_MAJ, store.report.values.AQL_MIN)
  store.defectsAllowedMap = {
  }
  console.log('updateAqlValues-result:', toRaw(result))
  if (result.aqlMapping['aql_cr']) {
    store.defectsAllowedMap.AQL_CR = result.aqlMapping['aql_cr']['aql']
  }
  if (result.aqlMapping['aql_maj']) {
    store.defectsAllowedMap.AQL_MAJ = result.aqlMapping['aql_maj']['aql']
  }
  if (result.aqlMapping['aql_min']) {
    store.defectsAllowedMap.AQL_MIN = result.aqlMapping['aql_min']['aql']
  }
  if (result.sampleSizeTotal) {
    store.formState['SampleSizeTotal'] = result.sampleSizeTotal
  }
}

watchEffect(() => {
  if (store.report.values.OrderQuantity && store.report.values.OrderQuantity >= 2 && (store.report.values.GeneralInspectionLevel || store.report.values.SpecialInspectionLevel)) {
    updateAqlValues()
  }
})

onOpenForm()

defineExpose({
  refresh,
  loadLocalData
})
</script>

<style scoped>
.report {
  color: #333
}

.report .desc {
  color: #999
}

.title,
.summary {
  border-radius: 5px;
  text-align: center;
}

.title {
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
}

.summary {
  color: #999
}

.component {
  /* margin: 30px 0; */
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.component .options {
  text-align: left;
  margin-bottom: 10px;
}

.component.meta {
  margin: 0;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid #ccc;
}

.component.meta:hover {
  background-color: #f9f9f9;
}

.submit-btn,
.save-btn {
  width: 140px;
  margin-left: 10px;
}

.affixed-style {
  border: 2px solid #ccc;
  border-radius: 20px;
  box-shadow: 2px 5px 10px #ddd;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  width: 100%;
}

.unaffixed-style {
  border-top: 2px solid #ccc;
  /* box top shadow */

  box-shadow: 0px 15px 10px -15px #333;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  width: 100%;
}


.controls.affixed-style.toggleSubmitControls {
  display: none;
}

.controls-switch {
  position: fixed;
  bottom: 40px;
  left: -10px;
}

.report-items-wrapper {
  max-width: 1024px;
  /* padding: 20px 20px 100px 20px; */
  padding-bottom: 100px;
  height: 100%;
  background-color: #fff;
  margin: 0 auto;
  position: relative;
}


.component-wrapper {
  border-bottom: 1px solid #ccc;
  padding: 20px;
  position: relative
}

.component-wrapper:hover {
  background-color: #f9f9f9;
}

.component-wrapper .edit-mode {
  position: absolute;
  right: 5px;
  top: 5px;
  color: #ccc;
  cursor: pointer;
}

.component-wrapper .edit-mode:hover {
  color: #000;
}

.catalog {
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
  margin: 20px;
  font-size: 12px;
  z-index: 10000;
  box-shadow: 1px 1px 5px #ccc;
}

.catalog .item {
  min-height: 16px;
  margin-bottom: 10px;
  cursor: pointer;
}

.catalog .item:last-child {
  margin-bottom: 0;
}

.catalog .item:hover {
  text-decoration: underline;
}


.toggle-catalog {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
  cursor: pointer;
}

.catalog-show {
  position: fixed;
  top: 100px;
  left: -10px;
}

.hide-catalog {
  position: absolute;
  left: -30px;
  top: 80px;
}

.component-wrapper.notpass {
  background-color: #f9e8e8;
}

.component-wrapper.pass {
  background-color: #DDFFFA;
}


/* mobile */
@media screen and (max-width: 768px) {
  .report-items-wrapper {
    max-width: 1024px;
    /* padding: 10px 10px 100px 10px; */
    padding-bottom: 100px;
    height: 100%;
    background-color: #fff;
    margin: 0 auto;
    position: relative;
  }

}
</style>
