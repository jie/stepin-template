<template>
    <div>
        <a-form-item :rules="[{ required: props?.item?.required, message: `Please enter ${props?.item?.title}`, type:'string' }]" :label="props?.item?.title" :extra="props?.item?.summary" :required="props?.item?.required" :name="props?.item?.key">
            <a-input v-model:value="props.value" readonly></a-input>
        </a-form-item>
    </div>

</template>
<script lang="ts" setup>
import {ref, toRaw} from "vue"
const props = defineProps({
    item: {
        type: Object,        
    },
    value: {
        type: String,
        default: ""
    }
})

const itemValue = ref("")

const emits = defineEmits(["update:value"])



const refreshValue = (data: any) => {
    console.log('refreshValue:', data)
    itemValue.value = data.value
    console.log('itemValue:', itemValue.value)
}


defineExpose({
    props,
    itemValue,
    refreshValue
})
</script>