import { createI18n } from 'vue-i18n'
import zh_lang from './locales/zh.json'
import en_lang from './locales/en.json'
import dayjs from 'dayjs'
const lang = localStorage.getItem('locale') || 'zh'
dayjs.locale(lang);

export const i18n = createI18n({
    locale: lang, // set locale
    fallbackLocale: 'zh', // set fallback locale
    messages: {
      'zh': zh_lang,
      'en': en_lang
    }, // set locale messages
    // If you need to specify other options, you can set other options
    // ...
  })

