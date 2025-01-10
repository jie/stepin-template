<template>
    <div class="report-container" v-if="store.report">
        <div class="report-wrapper">
            <div class="report-banner">
                <img style="width: 100%;" src="https://qcplatformassets.yilaw-ec.com/logo/ecqa_email_banner_hd.jpg">
            </div>
            <div style="padding-left: 20px; padding-right: 20px; margin-bottom: 40px;">
                <div style="margin: 0; font-weight: bold;">Dear Customer,</div>
                <div style="margin-top: 10px;">Your inspection report is now available. Please access it by clicking the
                    button below.</div>
                <div style="margin-top: 10px;"><a target="_blank" class="link-text"
                        href="https://qcplatformassets.yilaw-ec.com/mail/report_email/report_intro.jpg">how to review
                        the
                        report?</a></div>
            </div>
            <div style="padding-left: 20px; padding-right: 20px; margin-bottom: 30px;" v-if="store.report.report_files && store.report.report_files.length != 0">
                <div style="margin: 0; font-weight: bold; font-size: 120%;">Reports</div>
                <div v-for="item in store.report.report_files">
                    <div>
                        <div class="text"
                            style="margin-right: 10px; margin-bottom: 15px; margin-top: 15px; max-width: 100%; display:block;color: #184895; font-weight: bold; ">
                            <img src="https://qcplatformassets.yilaw-ec.com/mail/report_email/ios/1x/icon-xiazai.png"
                                style="width: 18px;height: 18px;" /><span
                                style="margin-left: 20px;word-break:break-all;">{{ item['name'] }}</span>
                        </div>
                        <div style="min-height: 36px; line-height: 36px;" v-if="item.detail_url || item.simple_url">
                            <a :href="item['detail_url']" class="btn-link text right detail-url-link"
                                v-if="item.detail_url" style=""><span>Detailed
                                    Ver. </span><img
                                    src="https://qcplatformassets.yilaw-ec.com/mail/report_email/ios/1x/icon-shou.png"
                                    style="width: 20px;margin-top: 3px" alt="" /></a>
                            <a :href="item['simple_url']" class="btn-link text right simple-url-link"
                                v-if="item.simple_url"><span>Simplified
                                    Ver. </span><img
                                    src="https://qcplatformassets.yilaw-ec.com/mail/report_email/ios/1x/icon-shou.png"
                                    style="width: 20px;margin-top: 3px" /></a>
                        </div>
                    </div>
                </div>


                <div v-if="store.report.attachments && store.report.attachments.length != 0">
                    <div style="margin-top:20px;">
                        <div style="margin: 0; font-weight: bold; margin-bottom: 20px; font-size: 120%;">Attachments
                        </div>
                        <div class="text" style="margin-bottom: 20px;" v-for="item in store.report.attachments">
                            <img src="https://qcplatformassets.yilaw-ec.com/mail/report_email/ios/1x/icon-xiazai.png"
                                style="width: 18px;height: 18px;" />
                            <span style="margin-left: 20px;" v-if="item.type">{{ item['type'] }}: </span>
                            <a :href="item.url" v-if="item.url"
                                style="text-decoration: underline; color: #184895;margin-right: 10px;font-weight: bold; word-break: break-all;">{{
                                    item.name }}</a>
                            <span v-if="item.mb">({{ item.mb }}) MB</span>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 30px;">
                    <div style="border: 1px solid #ddd;;">

                        <div class="item-wrapper" v-if="store.report?.order?.company?.shortname">
                            <div class="item-field">
                                Client</div>
                            <div style="flex: 1; padding: 10px; word-break: break-all;">{{ store.report?.order?.company?.shortname }}
                            </div>
                        </div>
                        <div class="item-wrapper" v-if="store.report?.order?.factory_name">
                            <div class="item-field">
                                Factory</div>
                            <div style="flex: 1; padding: 10px; word-break: break-all;">{{ store.report?.order?.factory_name }}
                            </div>
                        </div>
                        <div class="item-wrapper" v-if="store.report?.po_number">
                            <div class="item-field">
                                PO Number(s)</div>
                            <div style="flex: 1; padding: 10px; word-break: break-all;">{{ store.report?.po_number }}
                            </div>
                        </div>
                        <div class="item-wrapper">
                            <div class="item-field">
                                Inspection Result</div>
                            <div style="flex: 1; padding: 10px;">{{ ReportResultStatus[store.report.status] }}</div>
                        </div>
                        <div class="item-wrapper" v-if="store.report?._create_by?.name">
                            <div class="item-field">
                                Report auditor</div>
                            <div style="flex: 1; padding: 10px;">{{ store.report?._create_by?.name }}</div>
                        </div>
                        <div style="min-height: 40px;" v-if="store.report.inspect_remark">
                            <div style="font-weight: bold; color: #184895; padding: 10px; padding-bottom: 0;">Remarks
                            </div>
                            <div style="flex: 1; padding: 10px; line-height: 24px;">
                                <div style="margin: 0; white-space: pre-wrap;">{{ store.report.inspect_remark }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="padding-left: 20px; padding-right: 20px; margin-bottom: 20px; color: #999; margin-top: 50px;">
                To access your previous reports, please log in by clicking the button below.
            </div>
            <div style="padding-left: 20px; padding-right: 20px; padding-bottom: 20px;">
                <a href="https://www.yilaw-ec.com/report_system/workplace/my_report"
                    style="padding: 5px 10px; border: 1px solid #db1526; border-radius: 5px; text-decoration: none; color: #db1526; background-color: #f2f2f2;margin-right: 10px">View
                    Historical Reports</a>
            </div>
        </div>
    </div>
</template>

<style>
html {
    background-color: #f9f9f9!important;
}
</style>
<style scoped>
html {
    background-color: #f9f9f9!important;
}
.btn-link {
    background-color: #EEEEEE;
}

.btn-link:hover {
    background-color: #EEEEEE;
}

.text {
    position: relative;
    display: inline-block;
    line-height: 1.3;
}

.text img {
    position: absolute;
    top: 0;
    left: 0;
    margin-right: 10px;
    /* height: 100%; */
}

.text.right img {
    position: absolute;
    right: 0;
    left: auto;
    margin-right: 5px;
    /* height: 100%; */
}

.link-text {
    text-decoration: none;
    color: #184895
}

.link-text:hover {
    text-decoration: underline;
}

.report-container {
    margin: 0;
    background-color: #f9f9f9;
    font-size: 14px;
    color: #666;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding-bottom: 20px;
}

.report-wrapper {
    max-width: 700px;
    margin: 0 auto;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    box-shadow: 2px 2px 6px #00000029;
}

.report-banner {
    background-color: #f9f9f9;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.detail-url-link {
    position: relative;
    border: 1px solid #db1526;
    border-radius: 5px;
    text-decoration: none;
    color: #db1526;
    height: 30px;
    line-height: 30px;
    min-width: 110px;
    font-size: 13px;
    padding-left: 10px;
    padding-right: 10px;
}

.simple-url-link {
    position: relative;
    border: 1px solid #db1526;
    border-radius: 5px;
    text-decoration: none;
    color: #db1526;
    height: 30px;
    line-height: 30px;
    min-width: 118px;
    font-size: 13px;
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 10px;
}

.item-field {
    width: 150px;
    font-weight: bold;
    color: #184895;
    padding: 10px;
    border-right: 1px solid #ddd;
    background-color: #f2f2f2
}

.item-wrapper {
    min-height: 40px;
    display: flex;
    border-bottom: 1px solid #ddd;
}
</style>


<script lang="ts" setup>
import { ref, reactive, toRaw } from "vue"
import { ReportFillStore } from "@/store/report_fill"
import Spin from "@/components/spin/index.vue"
import { useRouter, useRoute } from "vue-router"
import { CloudDownloadOutlined } from '@ant-design/icons-vue';
import { reportDatabase } from "@/hook/dexie_hook"
import dayjs, { locale } from "dayjs"
import { i18n } from '@/lang/i18n';
import { ReportResultStatus, ReportResultStatusOptions } from "@/utils/constant";
const router = useRouter()
const route = useRoute()
const designerRef = ref(null)
const store = ReportFillStore()
const hasPermissionRef = ref(false)
const changeLocale = (lang) => {
    console.log('i18n.global.locale:', i18n.global.locale)
    // let localLang = localStorage.getItem('locale')

    // if (localLang != lang) {

    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 1000)
    // }
    i18n.global.locale = lang
    dayjs.locale(lang);
    localStorage.setItem('locale', lang);

}


const initialization = async () => {
    store.loading = true
    // hasPermissionRef.value = await store.apiCheckPermission()
    // if (!hasPermissionRef.value) {
    //   store.loading = false

    //   return
    // }
    // store.loading = false
    hasPermissionRef.value = true
    await store.apiGet(route.params.reportId)
    console.log('report:', toRaw(store.report))
    store.loading = false
    if (route.query.lang) {
        changeLocale(route.query.lang)
    }

}



const onClickLogin = async () => {
    store.loading = true
    hasPermissionRef.value = await store.apiCheckPermission()
    if (!hasPermissionRef.value) {
        store.loading = false

        return
    }
    store.loading = false
}

const downloadFile = (item, key) => {
    const link = document.createElement('a');
    // 设置 a 标签的 href 属性，值为下载链接
    // link.target = '_blank'
    link.href = item[key];
    // 设置 a 标签的 download 属性，值为下载文件的名称
    link.download = item[key].split('/').pop();
    // 触发 a 标签的点击事件，开始下载
    link.click();
}


initialization()
</script>
