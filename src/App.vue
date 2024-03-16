<template>
  <a-config-provider :getPopupContainer="getPopupContainer" :locale="locale === 'en' ? enUS : zhCN">
    <ThemeProvider is-root v-bind="themeConfig" :apply-style="false" :size="size" :font="font">
      <stepin-view
        system-name=""
        logo-src="@/assets/logo.png"
        :class="`${contentClass}`"
        :user="user"
        :navMode="navigation"
        :useTabs="useTabs"
        :themeList="themeList"
        v-model:show-setting="showSetting"
        v-model:theme="theme"
        @themeSelect="configTheme"
      >
        <template #headerActions>
          <HeaderActions @showSetting="showSetting = true" v-on:change-locale="onChangeLocale"/>
        </template>
        <template #pageFooter>
          <PageFooter />
        </template>
        <template #themeEditorTab>
          <a-tab-pane tab="其它" key="other">
            <Setting />
          </a-tab-pane>
        </template>
      </stepin-view>
    </ThemeProvider>
  </a-config-provider>
  <login-modal :unless="['/login']" />
</template>

<script lang="ts" setup>
  import { reactive, ref, toRaw } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAccountStore, useMenuStore, useSettingStore, storeToRefs } from '@/store';
  import avatar from '@/assets/avatar.png';
  import { PageFooter, HeaderActions } from '@/components/layout';
  import Setting from './components/setting';
  import { LoginModal } from '@/pages/login';
  import { configTheme, themeList } from '@/theme';
  import { ThemeProvider } from 'stepin';
  import { computed } from 'vue';
  import {i18n} from '@/lang/i18n';
  import dayjs  from 'dayjs';
  import enUS from 'ant-design-vue/es/locale/en_US';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  const { logout, profile } = useAccountStore();
  const locale = ref("zh");

  // 获取个人信息
  profile().then((response) => {
    user.name = response.name;
    // user.avatar = account.avatar;
  });

  const showSetting = ref(false);
  const router = useRouter();

  useMenuStore().getMenuList();

  const { navigation, useTabs, theme, contentClass } = storeToRefs(useSettingStore());
  console.log('theme:', toRaw(theme))
  console.log('contentClass:', toRaw(contentClass))
  const themeConfig = computed(() => themeList.find((item) => item.key === theme.value)?.config ?? {});
  console.log('themeConfig:', toRaw(themeConfig))
  const user = reactive({
    name: 'admin',
    avatar: avatar,
    menuList: [
      { title: '个人中心', key: 'personal', icon: 'UserOutlined', onClick: () => router.push('/profile') },
      { title: '设置', key: 'setting', icon: 'SettingOutlined', onClick: () => (showSetting.value = true) },
      { type: 'divider' },
      {
        title: '退出登录',
        key: 'logout',
        icon: 'LogoutOutlined',
        onClick: () => logout().then(() => router.push('/account/login')),
      },
    ],
  });

  function getPopupContainer() {
    return document.querySelector('.stepin-layout');
  }

  function onChangeLocale(lang: string) {
    locale.value = lang;
    console.log('lang', lang)
    console.log('i18n.global.locale:', i18n.global.locale)
    i18n.global.locale = lang;
    dayjs.locale(lang);
    localStorage.setItem('locale', lang);
    setTimeout(() => {
      window.location.reload();
    }, 1000)
  }

  const size = {
    // 'width-side': '240px',
    'width-side-collapsed': '96px'
  }

  const font = {
    'font-size': '16px'
  }

  function updateLocale() {
    let lang = localStorage.getItem("locale")
    if(!lang) {
      lang = 'zh'
    }
    locale.value = lang
  }


  updateLocale()
</script>

<style lang="less">
  .stepin-view {
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background-color: theme('colors.primary.500');
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: theme('colors.primary.400');

      &:hover {
        background-color: theme('colors.primary.500');
      }
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
      border-radius: 4px;
      background: theme('backgroundColor.layout');
    }
  }

  html {
    height: 100vh;
    overflow-y: hidden;
  }

  body {
    margin: 0;
    height: 100vh;
    overflow-y: hidden;
  }
  .stepin-img-checkbox {
    @apply transition-transform;
    &:hover {
      @apply scale-105 ~"-translate-y-[2px]";
    }
    img {
      @apply shadow-low rounded-md transition-transform;
    }
  }
</style>
