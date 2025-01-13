<template>

    <div class="report-wrapper">
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

        <div v-if="!store.loading && report" style="padding: 20px;">
            <div>
                <InspectRequirementBlock :report="report" type="aql" fieldKey="inspection_standards" />
                <InspectRequirementBlock :report="report" type="string" fieldKey="general_requirements" />
                <InspectRequirementBlock :report="report" type="string" fieldKey="special_requirements" />
                <InspectRequirementBlock :report="report" type="string" fieldKey="other_requirements" />
                <InspectRequirementBlock :report="report" type="case" fieldKey="complained_cases" />
                <InspectRequirementBlock :report="report" type="pdfs" fieldKey="inspection_requirement_pdfs" />

            </div>

        </div>
        <div v-if="store.loading" class="flex"
            style="justify-content: center; align-items:center; width: 100%; min-height: 600px;">
            <Spin font-size="60px" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw } from "vue"
import Designer from "@/components/design/public_approve.vue"
import { ReportFillStore } from "@/store/report_fill"
import Spin from "@/components/spin/index.vue"
import { useRouter, useRoute } from "vue-router"
import { reportDatabase } from "@/hook/dexie_hook"
import InspectRequirementBlock from "@/components/design/inspect_require_com.vue"
import dayjs from "dayjs"
const router = useRouter()
const route = useRoute()
const designerRef = ref(null)
const store = ReportFillStore()
const hasPermissionRef = ref(false)
const report = ref(null)
const initialize = async () => {
    store.loading = true
    // hasPermissionRef.value = await store.apiCheckPermission()
    // console.log('hasPermissionRef.value:', hasPermissionRef.value, store.report)
    // if (!hasPermissionRef.value) {
    //   store.loading = false
    //   return
    // }
    // store.loading = false

    // if(hasPermissionRef.value) {
    //   await store.apiGet(route.params.reportId)
    //   console.log('**report:', toRaw(store.report))
    //   store.loading = false
    // }
    let result = await store.apiGetForView(route.params.reportId)
    if (result.entity) {
        report.value = result.entity
    }
    store.loading = false
}


initialize()
</script>

<style scoped>
.report {
    color: #333
}

.report-wrapper {
    max-width: 1024px;
    height: 100%;
    background-color: #fff;
    margin: 0 auto;
    position: relative;
}

.report-wrapper.is-staff {
    padding-bottom: 100px;
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
</style>