<template>
  <div v-if="!store.loading">
    <div class="report-container relative" v-if="store.report">
      <div class="change-language">
        <div class="lang-item" v-if="i18n.global.locale == 'zh'" @click="changeLocale('en')">English</div>
        <div class="lang-item" v-else @click="changeLocale('zh')">中文</div>
      </div>
      <h4 class="report-title text-center  pt-2 pb-2" v-if="store.report.title">{{ store.report.title }}</h4>
      <div class="report-files" v-if="store.report.report_files && store.report.report_files.length > 0">
        <div class="file-title">{{ $t('base.OnlineReport') }}</div>
        <div class="items pt-2">
          <div v-for="item in store.report.report_files" class="item-line">
            <div class="icon mr-2">
              <CloudDownloadOutlined />
            </div>
            <div class="title link mr-2" @click="downloadFile(item, 'detail_url')">{{ item.name }}</div>
            <div class="version" v-if="item.detail_url || item.simple_url">
              <a-button class="mr-2" @click="downloadFile(item, 'detail_url')" v-if="item.detail_url"><template #icon>
                  <CloudDownloadOutlined />
                </template>{{ $t('base.DetailedVerson') }}</a-button>
              <a-button class="" @click="downloadFile(item, 'simple_url')" v-if="item.simple_url"><template #icon>
                  <CloudDownloadOutlined />
                </template>{{ $t('base.SimplifiedVerson') }}</a-button>
            </div>
          </div>
        </div>
      </div>
      <div class="report-attachments" v-if="store.report.attachments && store.report.attachments.length > 0">
        <div class="file-title">{{ $t('base.Attachments') }}</div>
        <div class="items pt-2">
          <div v-for="item in store.report.attachments" class="item-line">
            <div class="icon  mr-2">
              <CloudDownloadOutlined />
            </div>
            <div class="title link mr-2" v-if="item.name" @click="downloadFile(item, 'url')">{{ item.name }}</div>
            <div class="size" v-if="item.mb">
              ({{ item.mb }})MB
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="report-container" style="height: 100vh;" v-else>
      <a-empty description="404 NOT FOUND" />
    </div>
  </div>
  <div v-else class="flex" style="justify-content: center; align-items:center; width: 100%; min-height: 600px;">
    <Spin font-size="60px" />
  </div>
</template>
    
<script lang="ts" setup>
import { ref, reactive, toRaw } from "vue"
import { ReportFillStore } from "@/store/report_fill"
import Spin from "@/components/spin/index.vue"
import { useRouter, useRoute } from "vue-router"
import { CloudDownloadOutlined } from '@ant-design/icons-vue';
import { reportDatabase } from "@/hook/dexie_hook"
import dayjs, { locale } from "dayjs"
import { i18n } from '@/lang/i18n';
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

<style scoped>
.change-language {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  font-size: 12px;
  color: #999;
}

.change-language .lang-item {
  cursor: pointer;
  padding-left: 5px;
  padding-right: 5px;
}

.change-language .lang-item:hover {
  color: #000;
}

.report-container {
  max-width: 800px;
  margin: 0 auto;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  font-size: 16px;
  height: 100vh;
  overflow-y: auto;
  color: #333;
}

.report-files .items,
.report-attachments .items,
.report-files .notes,
.report-attachments .notes {
  margin-left: 30px;
  margin-right: 30px;
}

.report-files .notes,
.report-attachments .notes {
  color: #999;
  line-height: 20px;
  margin-top: 30px;
}

.file-title {
  font-size: 120%;
  font-weight: bold;
}

.report-attachments {
  margin-top: 40px;
}

.report-container .item-line {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.report-container .version {
  display: flex;
  align-items: center;
}

.report-container .link {
  text-decoration: underline;
}

.report-container .link:hover {
  color: #000;
}

.report-container .title {
  cursor: pointer;
}


@media (max-width: 768px) {
  .report-container .item-line {
    display: block;
  }

  .report-container .item-line .icon {
    display: none;
  }

  .report-container .item-line .version {
    margin-top: 16px;
  }

  .report-files .items,
  .report-attachments .items,
  .report-files .notes,
  .report-attachments .notes {
    margin-left: 0;
    margin-right: 0;
  }

  .file-title {
    font-size: 110%;
    font-weight: bold;
  }
}
</style>