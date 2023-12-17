<template>
  <a-row type="flex">
    <a-col :flex="child.size" v-for="child in props.item.children">
      <div v-if="child.type == 'text'">
        <reportText :item="child" />
      </div>
      <div v-else-if="child.type == 'input'">
        <reportInput :item="child" />
      </div>
      <div v-else-if="child.type == 'table'">
        <reportTable :item="child"></reportTable>
      </div>
      <div v-else>unsupported components</div>
    </a-col>
  </a-row>
  <!-- {{ props.item.children }} -->
</template>

<script setup lang="ts">
import reportTable from "./table/index.vue"
import reportText from "./reportText/index.vue"
import reportInput from "./reportInput/index.vue"

const props = defineProps({
  item: {
    type: Object,
  }
})

</script>