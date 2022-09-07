import 'react-i18next'

import locales from './locales'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof locales.en.translation
    }
  }
}
