<script lang="ts" setup>
import { getBase64 } from '@/utils/file';
import { FormInstance, Upload } from 'ant-design-vue';
import { reactive, ref, toRaw, nextTick, watchEffect } from 'vue';
import dayjs from 'dayjs';
import { EditOutlined, SearchOutlined, ReadOutlined, DeleteOutlined, TaobaoSquareFilled, TagsOutlined, MailOutlined } from '@ant-design/icons-vue';
import { formatStatusColor } from "@/utils/formatter";
import RemoteSelect from "@/components/remote_select/index.vue"
import { ApproveStatus, ApproveStatusOptions } from "@/utils/constant";
import { ReportResultStatus, ReportResultStatusOptions } from "@/utils/constant";
import { ReportStore, Report } from '@/store/report'
import { DayjsDateRangeSchema, statusFormSchema } from '@/types'
import { ReportCategoryStore } from '@/store/category'
import { ReportTagStore } from '@/store/tag'
import { ossUploadFiles } from '@/store/uploader'
import { useRouter } from 'vue-router'
import { i18n } from "@/lang/i18n"
import { openNewUrl } from "@/utils/helpers"
import { openNotification } from "@/utils/notification"
import { ReportUserStore } from '@/store/user';
import { message } from 'ant-design-vue'
const userStore = ReportUserStore()
const router = useRouter()
const store = ReportStore()
const tagStore = ReportTagStore()
tagStore.mode = 'option'
const categoryStore = ReportCategoryStore()
const searchKeywords = ref('');
const reportTemplateSelectRef = ref(null)
const reportWorkerRef = ref(null)
const reportUsersReviewRef = ref(null)
const reportCompanyReviewRef = ref(null)
const willSetTagRecord = ref<Report>(null)
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref(null)
const tagsRef = ref([])
const editThirdpartyRecord = ref<Report>()
const poNumberRef = ref('')
const inspectRemarkRef = ref('')
const ccEmailsRef = ref('')
const emailTitleRef = ref('')
const isConfirmEmailThemeRef = ref(false)
const attachments = ref([{
  name: '',
  type: '',
  mb: '',
  url: ''
}])
const reportFiles = ref([
  {
    name: '',
    simple_url: '',
    detail_url: ''
  }
])
const searchDateRangeRef = ref<DayjsDateRangeSchema>()
const columns = [
  {
    title: i18n.global.t('base.Report'),
    dataIndex: 'name',
    fixed: 'left',
    width: 300,
  },
  { title: i18n.global.t('base.DateOfInspection'), dataIndex: 'inspect_date', width: 200 },
  { title: i18n.global.t('base.Customer'), dataIndex: 'company', width: 200 },
  { title: i18n.global.t('base.Factory'), dataIndex: 'factory', width: 200 },
  { title: i18n.global.t('base.Workers'), dataIndex: 'workers', width: 200 },
  { title: i18n.global.t('base.Category'), dataIndex: 'category', width: 160 },
  { title: i18n.global.t('base.CreateBy'), dataIndex: 'creator', width: 80 },
  { title: i18n.global.t('base.SendStatus'), dataIndex: 'send_status', width: 100, fixed: 'right' },
  { title: i18n.global.t('base.ReportResult'), dataIndex: 'status', width: 120, fixed: 'right'},
  { title: i18n.global.t('base.OP'), dataIndex: 'edit', width: 80, fixed: 'right' },
];

const securitySettingRef = reactive({
  is_require_pwd: true,
  is_email_contain_pwd: false,
  is_set_pwd_manully: false,
  review_pwd: ""
})

function addNew() {
  reset();
  showModal.value = true;
  form._isNew = true;
}

const showModal = ref(false);
const showEditThirdpartyModal = ref(false);

const newRecord = (record?: Report) => {
  if (!record) {
    record = { _isNew: true };
  }
  record.name = undefined;
  record.title = undefined;
  record.order_id = undefined;
  record.category_id = undefined;
  record.report_template_id = undefined;
  record.company_id = undefined;
  record.users_review = [];
  record.users = [];
  record.is_thirdparty = false;
  record.status = '0';
  record.settings = {
    validate_password: true,
    validate_permission: true,
    approve_password: true,
    approve_permission: true,
  }
  return record;
};

const copyObject = (target: any, source?: any) => {
  if (!source) {
    return target;
  }
  Object.keys(target).forEach((key) => (target[key] = source[key]));
};

const form = reactive<Report>(newRecord());

function reset() {
  return newRecord(form);
}

function cancel() {
  showModal.value = false;
  reset();
}

const formModel = ref<FormInstance>();


const formLoading = ref(false);

async function extractImg(file: Blob, record: Report) {
  await getBase64(file).then((res) => {
    record.avatar = res;
  });
}

function submit() {
  formLoading.value = true;
  formModel.value
    ?.validateFields()
    .then(async (res: Report) => {
      let reqData = {
        name: form.name,
        title: form.title,
        summary: form.summary,
        report_template_id: form.report_template_id,
        category_id: form.category_id,
        workers: form.workers,
        users: form.users,
        users_review: form.users_review,
        factory_id: form.factory_id,
        company_id: form.company_id,
        settings: form.settings,
        is_thirdparty: form.is_thirdparty
      }
      if (form.id) {
        reqData.id = form.id
      }
      if (form.order_id) {
        reqData.order_id = form.order_id
      }
      if (form.id) {
        await store.apiUpdate(reqData)
      } else {
        await store.apiSave(reqData)
      }


      showModal.value = false;
      initializeData()
      reset();
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      formLoading.value = false;
    });
}

const editRecord = ref<Report>();

/**
 * Edit
 * @param record
 */
function edit(record: any) {
  editRecord.value = record;
  copyObject(form, record);
  console.log('record:', toRaw(record))
  console.log('form:', toRaw(form))
  form.id = record.id
  form.order_id = record?.order?.id
  form.name = record?.name
  form.title = record?.title
  form.summary = record?.summary
  form.report_template_id = record?.report_template
  form.workers = record?.workers
  form.users_review = record?.users_review
  form.company_id = record?.company
  form.settings = record?.settings
  form.is_thirdparty = record?.is_thirdparty
  if (form.settings.validate_password === undefined) {
    form.settings.validate_password = false
  }
  if (form.settings.validate_permission === undefined) {
    form.settings.validate_permission = false
  }
  if (form.settings.approve_password === undefined) {
    form.settings.approve_password = false
  }
  if (form.settings.approve_permission === undefined) {
    form.settings.approve_permission = false
  }
  showModal.value = true;
  setTimeout(async () => {
    console.log('company_id:', form.company_id)
    reportCompanyReviewRef.value?.getEntity([form.company_id])
    await reportTemplateSelectRef.value?.getEntity([form.report_template_id])
    await reportWorkerRef.value?.getEntity(form.workers)
    console.log('users_review:', form.users_review)
    await reportUsersReviewRef.value?.getEntity(form.users_review)
  }, 1000)
}

const deleteRecord = async (record: Report) => {
  console.log('record:', record)
  await store.apiDelete(record.id)
  initializeData()
}

const setTag = (record: Report) => {
  console.log('record:', record)
  willSetTagRecord.value = record
  tagsRef.value = record.tags || []
}


const onClickSearch = async () => {
  store.queryArgs.keyword = searchKeywords.value
  console.log('store.queryArgs.keyword:', store.queryArgs.keyword)
  if (searchDateRangeRef.value) {
    store.queryArgs.inspect_start = searchDateRangeRef.value[0].format('YYYY-MM-DD')
    store.queryArgs.inspect_end = searchDateRangeRef.value[1].format('YYYY-MM-DD')
  }
  store.apiQuery()
}

const goPublicReviewReport = (report: any) => {
  console.log('form:', toRaw(form))
  openNewUrl(router, {
    name: 'report_review',
    params: {
      reportId: report.id
    }
  })
}

const initializeData = async (isFirst) => {
  if (isFirst) {
    userStore.apiQueryByRole("65ddec7ae06322f206dd2995")
  }
  await store.apiQuery()
  await categoryStore.apiQueryParent()
  tagStore.pagination.pagesize = 1000
  tagStore.apiQuery()
}

// status form
const statusForm = reactive<statusFormSchema>({
  id: "",
  status: "",
  reason: ""
});
const statusFormModel = ref<FormInstance>()

const statusDialogRef = ref(false)
const showStatusDialog = (record: Report) => {
  statusDialogRef.value = true
  statusForm.reason = record.reason || ''
  statusForm.id = record.id
  statusForm.status = record.status
}
const statusDialogConfirm = async () => {
  await store.apiSetStatus(statusForm)
  initializeData()
  statusDialogRef.value = false
}
const statusDialogCancel = () => {
  statusDialogRef.value = false
  statusForm.reason = ''
  statusForm.id = ''
  statusForm.status = ''
}


const goPublicFillReport = (report: any) => {
  console.log('form:', toRaw(form))
  openNewUrl(router, {
    name: 'report_fill',
    params: {
      reportId: report.id
    }
  })
}


const goDesign = (record) => {
  console.log('record:', toRaw(record.template.id))
  console.log(router.resolve({
    name: 'design',
    query: {
      id: record.template.id,
    }
  })
  )
  openNewUrl(router, {
    name: 'design',
    query: {
      id: record.template.id,
    }
  })
}
const handleConfirmOK = async () => {
  await _submitThirdpartyReport()

}
const handleConfirmCancel = () => {
  isConfirmEmailThemeRef.value = false
  showEditThirdpartyModal.value = true
}

const _submitThirdpartyReport = async () => {
  if (!editThirdpartyRecord.value?.id) {
    return
  }

  for (let item of attachments.value) {
    if (item.url && !item.type) {
      openNotification({
        type: "error",
        message: i18n.global.t("base.please_select_attachment_type"),
      })
      return
    }
  }

  await store.apiEditThirdpartyReport({
    id: editThirdpartyRecord.value?.id,
    report_files: reportFiles.value,
    attachments: attachments.value,
    // send_email: true,
    po_number: poNumberRef.value,
    inspect_remark: inspectRemarkRef.value,
    cc_emails: ccEmailsRef.value.split(';'),
    email_title: emailTitleRef.value,
    is_require_pwd: securitySettingRef.is_require_pwd,
    is_email_contain_pwd: securitySettingRef.is_email_contain_pwd,
    is_set_pwd_manully: securitySettingRef.is_set_pwd_manully,
    review_pwd: securitySettingRef.review_pwd
  })


  await store.apiQuery()
  showEditThirdpartyModal.value = false
  isConfirmEmailThemeRef.value = false
}

const submitThirdpartyReport = async () => {
  if (!isCCemailValid.value) {
    message.error(i18n.global.t('base.cc_emails_invalid'))
    return
  }
  isConfirmEmailThemeRef.value = true
}

const uploadFile = (index: number, kind: string, item: any) => {
  console.log('index:', index)
  console.log('kind:', kind)
  console.log('item:', item)
  const input = document.createElement('input');
  input.id = 'willUploadFileInput';
  input.type = 'file';
  let prefix = ""

  if (editThirdpartyRecord.value?.order?.company?.id) {
    prefix = `thirdparty_reports/${editThirdpartyRecord.value?.order?.company?.id}/${dayjs().format('YYYYMMDD')}`
  } else {
    prefix = `thirdparty_reports/${dayjs().format('YYYYMMDD')}`
  }


  input.onchange = async (e: any) => {
    const file = e.target.files[0];
    const fileSize = file.size;
    const fileSizeInMB = fileSize / (1024 * 1024);
    const fileSizeFormatted = fileSizeInMB.toFixed(2);
    console.log(fileSizeFormatted);
    let filename = file.name
    let result = await ossUploadFiles(e, prefix)
    console.log('upload-result:', result)
    if (kind === 'simple_url') {
      reportFiles.value[index].simple_url = result[0]
      if (!reportFiles.value[index].name) {
        reportFiles.value[index].name = filename
      }
    } else if (kind === 'detail_url') {
      reportFiles.value[index].detail_url = result[0]
      if (!reportFiles.value[index].name) {
        reportFiles.value[index].name = filename
      }
    } else {
      attachments.value[index].url = result[0]
      attachments.value[index].mb = fileSizeFormatted
      // console.log('file.type:', file.type)
      // let file_type = file.type
      // if (file_type.includes('image')) {
      //   file_type = 'Image'
      // } else if (file_type.include('mp4')) {
      //   file_type = 'MP4'
      // } else if (file_type.include('video')) {
      //   file_type = 'Video'
      // } else if (file_type.include('pdf')) {
      //   file_type = 'PDF'
      // } else if (file_type.include('doc') || file_type.include('docx')) {
      //   file_type = 'Word'
      // } else if (file_type.include('xls') || file_type.include('xlsx')) {
      //   file_type = 'Excel'
      // } else {
      //   file_type = 'File'
      // }
      // attachments.value[index].type = file_type
      if (!attachments.value[index].name) {
        attachments.value[index].name = filename
      }
    }
    // remove child by ID
    const willUploadFileInput = document.getElementById('willUploadFileInput');
    willUploadFileInput?.parentNode?.removeChild(willUploadFileInput);
  };
  input.click();
}

const currentReportCustomer = ref(null)

const onClickShowEditThirdpartyReportModal = async (record: Report) => {
  console.log('record:', toRaw(record))
  ccEmailsRef.value = ""
  let userRes = await userStore.apiGetByCustomerId(record.order.company_customer.id)
  console.log('userRes:', userRes)
  currentReportCustomer.value = userRes.entity
  editThirdpartyRecord.value = record
  showEditThirdpartyModal.value = true
  if (record.cc_emails && record.cc_emails.length > 0) {
    ccEmailsRef.value = record.cc_emails.join(';')
  } else {
    if (!ccEmailsRef.value && userRes.entity.cc_emails && userRes.entity.cc_emails.length > 0) {
      ccEmailsRef.value = userRes.entity.cc_emails.join(';')
    }
  }
  poNumberRef.value = record.po_number || ''
  inspectRemarkRef.value = record.inspect_remark || ''
  if (record.report_files && record.report_files.length > 0) {
    reportFiles.value = record.report_files
  } else {
    if(record.is_thirdparty) {
      reportFiles.value = [{
        name: '',
        simple_url: '',
        detail_url: ''
      }]
    } else {

      reportFiles.value = [{
        name: '',
        simple_url: `${import.meta.env.VITE_QYWX_API_HOST}/report_system/public/report/review/${record.id}?is_simple=true`,
        detail_url: `${import.meta.env.VITE_QYWX_API_HOST}/report_system/public/report/review/${record.id}`
      }]
    }

  }
  if (record.attachments && record.attachments.length > 0) {
    attachments.value = record.attachments
  } else {
    attachments.value = [{
      name: '',
      type: '',
      mb: '',
      url: ''
    }]

  }
  if (record.email_title) {
    emailTitleRef.value = record.email_title
  } else {
    emailTitleRef.value = `New Report Received: ${record.name}`
  }

  securitySettingRef.is_require_pwd = record.is_require_pwd
  securitySettingRef.is_email_contain_pwd = record.is_email_contain_pwd
  securitySettingRef.is_set_pwd_manully = record.is_set_pwd_manully
  if (record.is_set_pwd_manully) {
    securitySettingRef.review_pwd = record.review_pwd
  } else {
    securitySettingRef.review_pwd = ""
  }
}


const sendReportToWorkerModal = ref(false)
const sendReportToWorkerRecord = ref(null)
const isWorkerCCemailValid = ref(true)
const sendToWorkerForm = reactive({
  email_title: '',
  cc_emails: '',
  email: '',
  url: '',
  worker_remark: ''
})


const onClickShowSendToWorkerModal = async (record: Report) => {
  console.log('record:', toRaw(record))
  sendReportToWorkerRecord.value = record
  sendReportToWorkerModal.value = true
  if(record?.order?.workers) {
    let emails = []
    for (let worker of record.order.workers) {
      console.log('worker:', worker)
      if(worker?.worker?.mail) {
        emails.push(worker.worker.mail)
      }
    }
    sendToWorkerForm.email = emails.join(';')
  }
  sendToWorkerForm.email_title = record.title || record.name
  sendToWorkerForm.cc_emails = record._create_by.email
  sendToWorkerForm.url = `${import.meta.env.VITE_QYWX_API_HOST}/report_system/public/report/fill/${record.id}`
}

const sendReportToWorker = async () => {
  if (!isWorkerCCemailValid.value) {
    message.error(i18n.global.t('base.cc_emails_invalid'))
    return
  }
  let worker_emails = []
  for (let worker of sendToWorkerForm.email.split(';')) {
    if (worker) {
      let name;
      for(let item of sendReportToWorkerRecord.value?.order?.workers) {
        if(item?.worker?.mail.toLowerCase() === worker.toLowerCase()) {
          name = item.worker.name || worker.split('@')[0]
          break
        }
      }
      worker_emails.push({
        email: worker,
        name: name
      })
    }
  }
  console.log('worker_emails:', toRaw(worker_emails))

  worker_emails = [{email: "zy410@qq.com", name: "zy"}]

  await store.apiSendReportToWorker({
    id: sendReportToWorkerRecord.value.id,
    email_title: sendToWorkerForm.email_title,
    cc_emails: sendToWorkerForm.cc_emails.split(';'),
    worker_emails: worker_emails,
    url: sendToWorkerForm.url,
    worker_remark: sendToWorkerForm.worker_remark,
    send_email: true
  })
  sendReportToWorkerModal.value = false
  sendReportToWorkerRecord.value = null
  sendToWorkerForm.email_title = ''
  sendToWorkerForm.cc_emails = ''
  sendToWorkerForm.email = ''
  sendToWorkerForm.url = ''
  sendToWorkerForm.worker_remark = ''
}


const cancelSendReportToWorker = ()=>{
  sendReportToWorkerModal.value = false
  sendReportToWorkerRecord.value = null
  sendToWorkerForm.email_title = ''
  sendToWorkerForm.worker_remark = ''
  sendToWorkerForm.cc_emails = ''
  sendToWorkerForm.email = ''
  sendToWorkerForm.url = ''
}



const addNewThirdpartyReportFiles = () => {
  reportFiles.value.push({
    name: '',
    simple_url: '',
    detail_url: ''
  })
}
const addNewThirdpartyReportAttachments = () => {
  attachments.value.push({
    name: '',
    type: '',
    mb: '',
    url: ''
  })
}

const deleteAttachmentItem = (index: number) => {
  if (attachments.value.length === 1) {
    return
  }
  attachments.value.splice(index, 1)
}
const deleteFileItem = (index: number) => {
  if (reportFiles.value.length === 1) {
    return
  }
  reportFiles.value.splice(index, 1)
}


const setTagDialogConfirm = async () => {
  await store.apiSetTagsForReport({ id: willSetTagRecord.value.id, tags: tagsRef.value })
  store.apiQuery()
  setTagDialogCancel()
  willSetTagRecord.value = null
  tagsRef.value = []

}
const setTagDialogCancel = () => {
  willSetTagRecord.value = null
  tagsRef.value = []
}

const handleTagInputConfirm = async () => {
  console.log('tagInputValue.value:', tagInputValue.value)
  if (tagInputValue.value && tagsRef.value.indexOf(tagInputValue.value) === -1) {
    tagsRef.value = [...tagsRef.value, tagInputValue.value];
  }
  console.log('tagsRef.value:', tagsRef.value)
  tagInputVisible.value = false;
  tagInputValue.value = '';
}


const showTagInput = () => {
  tagInputVisible.value = true;
  nextTick(() => {
    tagInputRef.value.focus();
  });
}

const handleTagClose = (removedTag: any) => {
  console.log('handleTagClose')
  const tags = tagsRef.value.filter(tag => tag !== removedTag);
  console.log(tags);
  tagsRef.value = tags;
}

const saveCcEmails = async () => {
  await userStore.apiSaveCcEmails({ id: currentReportCustomer.value.id, cc_emails: ccEmailsRef.value.split(';') })
  message.success(i18n.global.t('base.Success'))
}

const fillinCcEmails = async () => {
  console.log('currentReportCustomer.value?.cc_emails:', toRaw(currentReportCustomer.value?.cc_emails))
  if (currentReportCustomer.value?.cc_emails && currentReportCustomer.value?.cc_emails.length > 0) {
    ccEmailsRef.value = currentReportCustomer.value.cc_emails.join(';')
  }
}

const onTableChange = (pagination, filters, sorter, { currentDataSource }) => {
  console.log(pagination);
  store.pagination = {
    page: pagination.current,
    pagesize: pagination.pageSize
  }
  store.apiQuery()
};

function updateUrlArgs(link: string, key: string, value: string) {
  let url = new URL(link)
  let searchParams = new URLSearchParams(url.search)
  searchParams.set(key, value)
  url.search = searchParams.toString()
  return url.toString()
}

// create a function to remove the query parameter
function removeUrlArgs(link: string, key: string) {
  let url = new URL(link)
  let searchParams = new URLSearchParams(url.search)
  searchParams.delete(key)
  url.search = searchParams.toString()
  return url.toString()
}

const onChangeContainPasswordInEmailLink = async (status: any) => {
  console.log('status:', toRaw(status))
  if(status) {
    let pwd = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    if(reportFiles.value[0].simple_url) {
      let simple_url = updateUrlArgs(reportFiles.value[0].simple_url, 'spwd', pwd)
      reportFiles.value[0].simple_url = simple_url
    }
    if(reportFiles.value[0].detail_url) {
      let detail_url = updateUrlArgs(reportFiles.value[0].detail_url, 'spwd', pwd)
      reportFiles.value[0].detail_url = detail_url
    }

    securitySettingRef.review_pwd = pwd
  } else {
    if(reportFiles.value[0].simple_url) {
      reportFiles.value[0].simple_url = removeUrlArgs(reportFiles.value[0].simple_url, 'spwd')
    }
    if(reportFiles.value[0].detail_url) {
      reportFiles.value[0].detail_url = removeUrlArgs(reportFiles.value[0].detail_url, 'spwd')
    }
  }
}

const onChangePasswordManully = (event:any) => {
  console.log('event:', event.target.value)
  if(reportFiles.value[0].simple_url) {
    let simple_url = updateUrlArgs(reportFiles.value[0].simple_url, 'spwd', event.target.value)
    reportFiles.value[0].simple_url = simple_url
  }
  if(reportFiles.value[0].detail_url) {
    let detail_url = updateUrlArgs(reportFiles.value[0].detail_url, 'spwd', event.target.value)
    reportFiles.value[0].detail_url = detail_url
  }
  securitySettingRef.review_pwd = event.target.value
}

const isCCemailValid = ref(true)

function validate_ccemails(str) {
  const regex = /^[a-zA-Z0-9@.;_-]+$/i;
  const isValid = regex.test(str); // true
  return isValid
}


watchEffect(() => {
  isCCemailValid.value = validate_ccemails(ccEmailsRef.value)
})
watchEffect(() => {
  isWorkerCCemailValid.value = validate_ccemails(sendToWorkerForm.cc_emails)
})

initializeData(true)

</script>
<template>
  <a-modal v-model:visible="isConfirmEmailThemeRef" @ok="handleConfirmOK" @cancel="handleConfirmCancel"
    :ok-text="$t('base.Yes')" :cancel-text="$t('base.No')">
    <div>
      <div>{{ $t('base.please_confirm_email_theme_is_right') }}</div>
      <div>{{ emailTitleRef }}</div>
    </div>
  </a-modal>
  <a-modal :title="$t('base.send_report_customer')" v-model:visible="showEditThirdpartyModal"
    @ok="submitThirdpartyReport" @cancel="cancel" width="660px">
    <a-form>
      <div>
        <a-form-item :label="$t('base.email_title')">
          <a-textarea v-model:value="emailTitleRef" :rows="4" />
        </a-form-item>
      </div>
      <div>
        <a-form-item :label="$t('base.cc_emails')">
          <a-textarea v-model:value="ccEmailsRef" :rows="4" />
          <div v-if="!isCCemailValid" style="color: orangered">{{ $t('base.cc_emails_invalid') }}</div>
          <div class="flex">
            <div style="height: 24px; line-height: 24px; display: flex; flex: 1; padding-top: 5px;">{{
              $t('base.if_you_have_multiple_email_addresses_please_separate_them_with_a_semicolon') }}</div>
            <div class="flex-1">
              <a-button type="primary" @click="fillinCcEmails" style="float: right; margin-top: 10px;">{{
                $t('base.FillinCcEmails') }}</a-button>

              <a-popconfirm :title="$t('base.ConfirmSaveCcEmails')" :ok-text="$t('base.Yes')"
                :cancel-text="$t('base.No')" @confirm="saveCcEmails">
                <a-button type="primary" style="float: right; margin-top: 10px;">{{ $t('base.SaveCcEmails')
                  }}</a-button>

              </a-popconfirm>
            </div>
          </div>

        </a-form-item>

        <div style="margin-bottom: 40px; border-bottom: 1px solid #ddd; border-top: 1px solid #ddd; padding-top: 20px;display:none" v-if="!editThirdpartyRecord.is_thirdparty">
          <div style="margin-bottom: 20px;">{{ $t('base.SecuritySettings') }}</div>
          <div>
            <a-form-item :label="$t('base.is_require_password_to_read')">
              <a-switch v-model:checked="securitySettingRef.is_require_pwd" />
            </a-form-item>
            <a-form-item :label="$t('base.is_contain_password_in_email_link')">
              <a-switch v-model:checked="securitySettingRef.is_email_contain_pwd" @change="onChangeContainPasswordInEmailLink"/>
            </a-form-item>
            <a-form-item :label="$t('base.is_set_password_manully')">
              <a-switch v-model:checked="securitySettingRef.is_set_pwd_manully" />
            </a-form-item>
            <a-form-item :label="$t('base.review_pwd')">
              <a-input v-model:value="securitySettingRef.review_pwd" @change="onChangePasswordManully" :readonly="!securitySettingRef.is_set_pwd_manully"/>
            </a-form-item>
          </div>
        </div>
        <div>{{ $t('base.ReportFiles') }}</div>
        <div style="margin-bottom: 20px;">
          <div v-for="(item, index) in reportFiles" class="report-file">
            <div class="report-file-item">
              <a-form-item :label="$t('base.report_file_name')">
                <a-input v-model:value="item.name" />
              </a-form-item>
              <a-form-item :label="$t('base.report_file_simple_url')">
                <a-input v-model:value="item.simple_url">
                  <template #addonAfter>
                    <div @click="uploadFile(index, 'simple_url', item)">
                      <UploadOutlined /> {{ $t('base.Upload') }}
                    </div>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item :label="$t('base.report_file_detail_url')">
                <a-input v-model:value="item.detail_url">
                  <template #addonAfter>
                    <div @click="uploadFile(index, 'detail_url', item)">
                      <UploadOutlined /> {{ $t('base.Upload') }}
                    </div>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button @click="deleteFileItem(index)">
                  <DeleteOutlined />{{ $t('base.Delete') }}
                </a-button>
              </a-form-item>
            </div>
          </div>
        </div>

        <a-form-item>
          <a-button type="primary" @click="addNewThirdpartyReportFiles" :loading="formLoading" style="float: right;">
            <template #icon>
              <PlusOutlined />
            </template>
            {{ $t('base.AddReportFile') }}
          </a-button>
        </a-form-item>
      </div>


      <div>
        <div>{{ $t('base.Attachments') }}</div>
        <div style="margin-bottom: 20px;">
          <div v-for="(item, index) in attachments" class="report-file">
            <div class="report-file-item">
              <a-form-item :label="$t('base.report_attachment_name')">
                <a-input v-model:value="item.name" />
              </a-form-item>
              <a-form-item :label="$t('base.report_attachment_type')">
                <a-radio-group v-model:value="item.type" button-style="solid">
                  <a-radio-button value="Photo">Photo</a-radio-button>
                  <a-radio-button value="Video">Video</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item :label="$t('base.report_attachment_mb')">
                <a-input v-model:value="item.mb" />
              </a-form-item>
              <a-form-item :label="$t('base.report_attachment_url')">
                <a-input v-model:value="item.url">
                  <template #addonAfter>
                    <div @click="uploadFile(index, 'attatchment', item)">
                      <UploadOutlined /> {{ $t('base.Upload') }}
                    </div>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button @click="deleteAttachmentItem(index)">
                  <DeleteOutlined />{{ $t('base.Delete') }}
                </a-button>
              </a-form-item>
            </div>

          </div>
        </div>
        <a-form-item>
          <a-button type="primary" @click="addNewThirdpartyReportAttachments" :loading="formLoading"
            style="float: right;">
            <template #icon>
              <PlusOutlined />
            </template>
            {{ $t('base.AddAttachment') }}
          </a-button>
        </a-form-item>
      </div>
      <div>
        <div>
          <a-form-item :label="$t('base.po_number')" v-if="editThirdpartyRecord.is_thirdparty">
            <a-input v-model:value="poNumberRef"></a-input>
          </a-form-item>
          <a-form-item :label="$t('base.inspect_remark')">
            <a-textarea v-model:value="inspectRemarkRef" />
          </a-form-item>
        </div>
      </div>
    </a-form>
  </a-modal>

  <a-modal :title="$t('base.send_report_worker')" v-model:visible="sendReportToWorkerModal" @ok="sendReportToWorker"
     @cancel="cancelSendReportToWorker" width="660px" :okText="$t('base.SendToWorker')">
    <a-form  :label-col="{ style: { width: '130px' } }">
      <div>
        <a-form-item :label="$t('base.email_title')">
          <a-textarea v-model:value="sendToWorkerForm.email_title" :rows="2" />
        </a-form-item>
      </div>
      <div>
        <a-form-item :label="$t('base.WorkerEmail')">
          <a-textarea v-model:value="sendToWorkerForm.email" :rows="2" />
        </a-form-item>
      </div>
      <div>
        <a-form-item :label="$t('base.cc_emails')">
          <a-textarea v-model:value="sendToWorkerForm.cc_emails" :rows="2" />
        </a-form-item>
      </div>
      <div>
        <a-form-item :label="$t('base.worker_remark')">
            <a-textarea v-model:value="sendToWorkerForm.worker_remark" :rows="2" />
          </a-form-item>
      </div>
      <div>
        <a-form-item :label="$t('base.email_report_link')">
          <a-textarea v-model:value="sendToWorkerForm.url" :rows="4" />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>


  <a-modal :title="form._isNew ? $t('base.Create') : $t('base.Edit')" v-model:visible="showModal" @ok="submit"
    @cancel="cancel" width="660px">
    <a-form ref="formModel" :model="form" :label-col="{ style: { width: '150px' } }" :wrapper-col="{ span: 14 }">
      <a-form-item required :label="$t('base.Name')" name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item :label="$t('base.Title')" name="title">
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item :label="$t('base.Summary')" name="summary">
        <a-textarea v-model:value="form.summary" />
      </a-form-item>
      <a-form-item :label="$t('base.OrderID')" name="order">
        <a-input v-model:value="form.order_id" />
      </a-form-item>
      <a-form-item :label="$t('base.Category')" required name="category_id">
        <a-tree-select v-model:value="form.category_id" style="width: 100%" :placeholder="$t('base.please_select')"
          allow-clear :tree-data="categoryStore.entities" :field-names="{
            children: 'children',
            label: 'displayName',
            value: 'id',
            selectable: 'selectable'
          }" tree-node-filter-prop="name">
        </a-tree-select>
      </a-form-item>
      <a-form-item :label="$t('base.IsThirdparty')" name="is_thirdparty">
        <a-switch v-model:checked="form.is_thirdparty" />
      </a-form-item>
      <!-- <hr />
      <a-form-item :label="$t('base.FillByPassword')" name="validate_password">
        <a-switch v-model:checked="form.settings.validate_password" />
      </a-form-item>
      <a-form-item :label="$t('base.FillByPermission')" name="validate_permission">
        <a-switch v-model:checked="form.settings.validate_permission" />
      </a-form-item>
      <a-form-item :label="$t('base.ReviewByPassword')" name="approve_password">
        <a-switch v-model:checked="form.settings.approve_password" />
      </a-form-item>
      <a-form-item :label="$t('base.ReviewByPermission')" name="approve_permission">
        <a-switch v-model:checked="form.settings.approve_permission" />
      </a-form-item> -->

      <div v-if="!form.is_thirdparty">
        <hr style="margin-bottom: 20px;" />
        <a-form-item :label="$t('base.Template')" name="report_template_id">
          <RemoteSelect ref="reportTemplateSelectRef" type="report_template" v-model:value="form.report_template_id"
            searchKey="name" />
        </a-form-item>
        <a-form-item :label="$t('base.Workers')" name="workers">
          <RemoteSelect ref="reportWorkerRef" type="worker" v-model:value="form.workers" :isMultiple="true"
            searchKey="name" />
        </a-form-item>
        <a-form-item :label="$t('base.Customer')" name="users_review">
          <RemoteSelect ref="reportUsersReviewRef" type="customer" v-model:value="form.users_review" :isMultiple="true"
            searchKey="name" />
        </a-form-item>
        <a-form-item :label="$t('base.Company')" name="company">
          <RemoteSelect ref="reportCompanyReviewRef" type="company" v-model:value="form.company_id" searchKey="name" />
        </a-form-item>
      </div>

    </a-form>
  </a-modal>
  <!-- 审核dialog -->
  <a-modal :title="$t('base.SetStatus')" v-model:visible="statusDialogRef" @ok="statusDialogConfirm"
    @cancel="statusDialogCancel" width="660px">
    <a-form ref="statusFormModel" :model="statusForm" layout="vertical">
      <a-form-item required :label="$t('base.ReportResult')" name="status">
        <a-select style="width: 100%" v-model:value="statusForm.status" :options="ReportResultStatusOptions" />
      </a-form-item>
      <a-form-item :label="$t('base.Reason')" name="reason">
        <a-textarea v-model:value="statusForm.reason" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 设置标签dialog -->
  <a-modal :title="$t('base.SetTag')" v-model:visible="willSetTagRecord" @ok="setTagDialogConfirm"
    @cancel="setTagDialogCancel" width="660px">
    <div>
      <template v-for="(tag, index) in tagsRef" :key="tag">
        <a-tag closable @close="handleTagClose(tag)">
          {{ tag }}
        </a-tag>
      </template>

    </div>
    <div>
      <a-input v-if="tagInputVisible" ref="tagInputRef" v-model:value="tagInputValue" type="text" size="small"
        :style="{ width: '78px' }" @blur="handleTagInputConfirm" @keyup.enter="handleTagInputConfirm" />
      <a-tag v-else style="background: #fff; border-style: dashed" @click="showTagInput">
        <plus-outlined />
        {{ $t('base.Add') }}
      </a-tag>
    </div>
  </a-modal>
  <!-- 成员表格 -->
  <div style="width: 100%">
    <a-table v-bind="$attrs" :loading="store.loading" :columns="columns" :dataSource="store.entities" :pagination="{
      current: store.pagination.page, pageSize: store.pagination.pagesize, total: store.pagination.total, showSizeChanger: true, showQuickJumper: true
    }" :scroll="{ y: 600 }" @change="onTableChange">
      <template #title>
        <div class="">
          <h4>{{ $t('base.Report') }}</h4>
          <a-row type="flex" style="width: 100%" :gutter="[16, 16]">
            <a-col :span="6">
              <div>
                <span class="mr-2">{{ $t('base.DateOfInspection') }}</span>
                <div><a-range-picker v-model:value="searchDateRangeRef" allowClear style="width: 100%;" /></div>
              </div>
            </a-col>
            <a-col :span="6">
              <div>
                <span class="mr-2">{{ $t('base.Customer') }}</span>
                <a-input v-model:value="store.queryArgs.company_name" allowClear>
                </a-input>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="">
                <span class="mr-2">{{ $t('base.Workers') }}</span>
                <a-input v-model:value="store.queryArgs.worker_name" allowClear>
                </a-input>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="">
                <span class="mr-2">{{ $t('base.ReportResult') }}</span>
                <div>
                  <a-select class="w-full" ref="select" v-model:value="store.queryArgs.status" allowClear>
                    <a-select-option :value="item.value" v-for="item in ReportResultStatusOptions">{{ item.label
                      }}</a-select-option>
                  </a-select>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row type="flex" style="width: 100%;margin-top:10px;" :gutter="[16, 16]">
            <a-col :span="6">
              <div class="mr-2">{{ $t('base.Category') }}</div>
              <a-tree-select v-model:value="store.queryArgs.category_id" show-search style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allow-clear
                tree-default-expand-all :tree-data="categoryStore.entities" :field-names="{
                  children: 'children',
                  label: 'name',
                  value: 'id',
                }" tree-node-filter-prop="name">
              </a-tree-select>
            </a-col>
            <a-col :span="6">
              <div class="mr-2">{{ $t('base.Tags') }}</div>
              <div>
                <a-select v-model:value="store.queryArgs.tag" style="width: 100%" :options="tagStore.tagsOptions"
                  allow-clear></a-select>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="mr-2">{{ $t('base.CreateBy') }}</div>
              <div>
                <a-select v-model:value="store.queryArgs.create_by" style="width: 100%"
                  :options="userStore.role_entities" :fieldNames="{ label: 'name', value: 'id' }"
                  allow-clear></a-select>
              </div>
            </a-col>
            <a-col :span="6">
              <a-button type="primary" @click="addNew" :loading="formLoading" style="float: right;">
                <template #icon>
                  <PlusOutlined />
                </template>
                {{ $t('base.Create') }}
              </a-button>
              <a-button class="mr-2" @click="onClickSearch" style="float: right;">
                <template #icon>
                  <SearchOutlined />
                </template>
                {{ $t('base.Search') }}
              </a-button>

            </a-col>
          </a-row>
        </div>
      </template>
      <template #bodyCell="{ column, text, record }">
        <div class="" v-if="column.dataIndex === 'name'">
          <div class="" >
            <div class="text-title font-bold whitespace-normal">{{ text }}</div>
            <div class="text-title cursor-pointer template-name" v-if="record?.template?.name"
              @click="goDesign(record)">
              {{ record?.template?.name
              }}</div>
            <span v-if="record.tags && record.tags.length != 0">
              <a-tag v-for="tag in record.tags"> {{ tag }} </a-tag>
            </span>
            <span v-if="record.is_thirdparty">
              <a-tag color="#87d068">外部报告</a-tag>
            </span>
            <span v-else>
              <a-tag color="#108ee9">系统报告</a-tag>
            </span>
          </div>
        </div>
        <div class="" v-else-if="column.dataIndex === 'company'">
          <div class="text-title font-bold" v-if="record.order">
            <a :href="`/report_system/workplace/user?keywords=${record.order_data.company_contact.mail}`">{{
              record.order_data.company.shortname }}</a>
          </div>
          <div class="text-title font-bold" v-else>
            {{ record.company.shortname }}
          </div>
        </div>
        <div class="" v-else-if="column.dataIndex === 'factory'">
          <div class="text-title font-bold">
            {{ record.order.factory_name }}
          </div>
        </div>
        <div class="" v-else-if="column.dataIndex === 'workers'">
          <div class="text-title font-bold" v-if="record.order">
            {{ record.order_data.workers }}
          </div>
          <div class="text-title font-bold" v-else>
            {{ record.workers }}
          </div>
          <div v-if="record.send_worker_count">
            <a-tag color="#0F954D">{{ $t('base.Sended') }}</a-tag>
          </div>
        </div>
        <div class="" v-else-if="column.dataIndex === 'category'">
          <div class="text-title font-bold">
            {{ record.category?.name }} {{ record.category?.name_en ? `/ ${record.category?.name_en}` : '' }}
          </div>
        </div>
        <template v-else-if="column.dataIndex === 'status'">
          <a-badge class="text-subtext" :color="formatStatusColor(text)">
            <template #text>
              <span class="text-subtext">{{ ReportResultStatus[text] || 'PENDING' }}</span>
            </template>
          </a-badge>
        </template>
        <template v-else-if="column.dataIndex === 'send_status'">{{ record?.send_email_count ?
          $t('base.Sended') : '' }}</template>
        <template v-else-if="column.dataIndex === 'creator'">
          {{ record?._create_by?.name }}
        </template>
        <template v-else-if="column.dataIndex === 'inspect_date'">
          {{ text }}
        </template>
        <template v-else-if="column.dataIndex === 'edit'">
          <a-dropdown>
            <span class="ant-dropdown-link cursor-pointer" @click.prevent>
              <SettingOutlined />
            </span>
            <template #overlay>
              <a-menu>
                <!-- <a-menu-item key="0">
                  <a @click="goPublicReviewReport(record)" rel="noopener noreferrer">
                    <VerifiedOutlined />
                    {{ $t('base.PublicView') }}
                  </a>
                </a-menu-item> -->
                <a-menu-item key="0">
                  <a @click="edit(record)" rel="noopener noreferrer">
                    <EditOutlined />
                    {{ $t('base.Edit') }}
                  </a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a @click="setTag(record)" rel="noopener noreferrer">
                    <TagsOutlined />
                    {{ $t('base.SetTag') }}
                  </a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a-popconfirm :title="$t('base.ConfirmDelete')" :okText="$t('base.Yes')" :cancelText="$t('base.No')"
                    @confirm="deleteRecord(record)">
                    <a rel="noopener noreferrer">
                      <DeleteOutlined />
                      {{ $t('base.Delete') }}
                    </a>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item key="1">
                  <a @click="showStatusDialog(record)" rel="noopener noreferrer">
                    <VerifiedOutlined />
                    {{ $t('base.SetReportResult') }}
                  </a>
                </a-menu-item>
                <a-menu-item key="1" v-if="!record.is_thirdparty">
                  <a @click="goPublicFillReport(record)" rel="noopener noreferrer">
                    <VerifiedOutlined />
                    {{ $t('base.PublicView') }}
                  </a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a @click="onClickShowEditThirdpartyReportModal(record)" rel="noopener noreferrer">
                    <MailOutlined />
                    {{ $t('base.send_report_customer') }}
                  </a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a @click="onClickShowSendToWorkerModal(record)" rel="noopener noreferrer">
                    <MailOutlined />
                    {{ $t('base.send_report_worker') }}
                  </a>
                </a-menu-item>
                <!-- <a-menu-item key="1">
                  <a @click="edit(record)" rel="noopener noreferrer">
                    <MailOutlined />
                    {{ $t('base.SendToCustomer') }}
                  </a>
                </a-menu-item> -->
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <div v-else class="text-subtext">
          {{ text }}
        </div>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.template-name {
  color: #999;
  cursor: pointer;
  font-size: 80%;
}

.template-name:hover {
  text-decoration: underline;
}

.report-file-item {
  border-bottom: 1px solid #ccc;
  padding-top: 20px;
}

.report-file:last-child>.report-file-item {
  border-bottom: 0
}
</style>