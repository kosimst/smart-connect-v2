import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import locales from './locales'

i18n.use(initReactI18next).init({
  fallbackLng: 'de',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  lng: 'de',
  react: {
    useSuspense: false,
  },
  resources: locales,
})

export default i18n
