<script lang="ts" setup>
  import { ref } from 'vue';
  import { StepinHeaderAction } from 'stepin';
  import {i18n} from '@/lang/i18n';

  const emits = defineEmits<{
    (e: 'showSetting'): void;
    (e: 'change-locale', lang: string): void;
  }>();


  const langs = {
    zh: '中文',
    en: 'English',
  }

  const getLocale = () => {
    const locale = localStorage.getItem('locale');
    if (locale) {
      return locale;
    }
    return 'zh';
  };

  getLocale()

  const currentLocale = ref(i18n.global.locale)
  const changeLocale = (lang: any) => {
    emits('change-locale', lang)
  };
</script>
<template>
  <a-popover placement="bottomRight">
    <StepinHeaderAction>
      <div class="action-item translate">
        <translation-outlined /> <span class="text-sm ml-2">{{ langs[currentLocale] }}</span>
      </div>
    </StepinHeaderAction>
    <template #content>
      <div>
        <a-button type="text" v-for="lang in Object.keys(langs)" @click="changeLocale(lang)">{{ langs[lang] }}</a-button>
      </div>
    </template>
  </a-popover>
</template>
<style scoped lang="less">
  .gitee-logo {
    width: 20px;
  }
  .action-item {
    font-size: 20px;
    height: 100%;
    margin: 0 -8px;
    padding: 0 4px;
    line-height: 40px;
    display: flex;
    align-items: center;

    &.setting {
      font-size: 18px;
    }

    &.notice {
      font-size: 18px;
    }
  }
</style>
