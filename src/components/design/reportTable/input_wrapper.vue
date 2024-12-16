<template>
    <div>
        <div v-if="props.col.fieldType == 'text'">
            <div style="border-left: 1px solid; padding-left: 20px">
                <a-form-item :label="props.col.title" v-if="props.col?.children?.length == 0">
                    <a-input v-model:value="props.value[props.col.key]" allowClear readonly />
                </a-form-item>
                <div v-else style="padding-left: 10px;">
                    <div>{{ props.col.title }}</div>
                    <div v-for="child in props.col.children">
                        <InputWrapper :col="child" v-model:value="props.value" @change="updateFieldValue" />
                    </div>
                </div>
            </div>
        </div>
        <div v-else style="border-left: 1px solid; padding-left: 20px">
            <a-form-item :label="props.col.title" v-if="props.col?.children?.length == 0">
                <a-auto-complete :getPopupContainer="triggerNode => triggerNode.parentNode"
                    v-model:value="props.value[props.col.key]" style="width: 100%"
                    v-if="props.value[props.col.key].is_defect" :options="defectOptions" @search="handleSearchDefect"
                    @change="updateFieldValue" allowClear>
                    <template
                        #option="{ content_en: content_en, id: id, content: content, types: types, product: product, product_en: product_en }">
                        <div style="display:flex;" @click="onDefectSelect(props, props.col.key, id)">
                            <div @click="onDefectSelect(props, props.col.key, id)">
                                <div style="margin-bottom: 2px"><a-tag v-for="tag in types">{{ tag }}</a-tag></div>
                                <div>{{ product }}: {{ content }}</div>
                                <div>{{ product_en }}: {{ content_en }}</div>
                            </div>
                        </div>
                    </template>
                </a-auto-complete>
                <a-input v-model:value="props.value[props.col.key]" allowClear v-else @change="updateFieldValue" />
            </a-form-item>
            <div v-else>
                <div>{{ props.col.title }}</div>
                <div v-for="child in props.col.children">
                    <InputWrapper :col="child" v-model:value="props.value" @change="updateFieldValue" />
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import BaseSlot from "../base_slot.vue"
import { defineEmits, defineProps, ref, watch, watchEffect } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { toRaw, computed, reactive } from 'vue';
import { copyObject } from "@/utils/objectUtils"
import { ReportFillStore } from "@/store/report_fill"
import InputWrapper from "./input_wrapper.vue"
// import { DeleteOutlined, EditOutlined, SettingOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from "@ant-design/icons-vue";
const emit = defineEmits(['update:value']);
const store = ReportFillStore()
const defectOptions = ref([])

const props = defineProps({
    col: {
        type: Object
    },
    value: {
        type: Object
    },
    rowSchema: {
        type: Object
    }
})

const handleSearchDefect = (value) => {
    defectOptions.value = value ? store.defects.filter((s) => s.content_en.toLowerCase().includes(value.toLowerCase())) : []
}

const onDefectSelect = (row, key, e) => {
    if (store.report?.template?.language == 'zh') {
        row.fieldOptions[key].val = store.defects.find((s) => s.id == e).content
    } else {
        row.fieldOptions[key].val = store.defects.find((s) => s.id == e).content_en
    }
}

const updateFieldValue = (e) => {
    emit('update:value', props.value)
}

</script>