<template>
    <div class="pb-5" v-if="report.order?.[props.fieldKey] || report.order?.company[props.fieldKey]">
        <h4>{{ $t(`base.${props.fieldKey}`) }}</h4>
        <div v-if="report.order?.[props.fieldKey]">
            <div v-if="props.type == 'array'" class="flex">
                <span v-for="item in report.order?.[props.fieldKey]">{{ item }}</span>
            </div>
            <div v-else-if="props.type == 'aql'">
                <div v-for="item in report.order?.[props.fieldKey]">{{ item }}</div>
            </div>
            <div v-else-if="props.type == 'case'" class="flex">
                <a-image :src="item.url" v-for="item in report.order?.[props.fieldKey]" />
            </div>
            <div v-else>
                {{ report.order?.[props.fieldKey] }}
            </div>
        </div>
        <div v-else>
            <div v-if="props.type == 'array'">
                <div v-for="item in report.order?.company[props.fieldKey]">{{ item }}</div>
            </div>
            <div v-else-if="props.type == 'aql'">
                <div v-for="item in report.order?.company[props.fieldKey]" class="mb-5">
                    <span v-for="key in Object.keys(item)" class="mr-5">
                        {{ key }}: {{ item[key] }}
                    </span>
                </div>
            </div>
            <div v-else-if="props.type == 'case'" class="flex">
                <div
                    v-if="report.order?.company[props.fieldKey].length == 1 && !report.order?.company[props.fieldKey][0].content && report.order?.company[props.fieldKey][0]?.images?.length == 0">
                    N/A
                </div>
                <div v-else>
                    <div v-for="item in report.order?.company[props.fieldKey]">
                        <div v-if="item.content"> {{ item.content }}</div>
                        <div v-if="item.images">
                            <a-image :src="image" v-for="image in item.images" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="props.type == 'pdfs'">
                <div v-if="report.order?.company[props.fieldKey]?.length != 0">
                    <div v-for="item in report.order?.company[props.fieldKey]" class="mb-5">
                        {{ item.name }} <a :href="item.url">{{ item.url }}</a>
                    </div>
                </div>
                <div v-else>N/A</div>

            </div>
            <div v-else>
                <div v-for="item in report.order?.company[props.fieldKey].split('\n')" class="mb-2">{{ item }}
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue'
const props = defineProps({
    fieldKey: String,
    type: String,
    report: Object
})
</script>