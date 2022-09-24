import de from './de.json'
import en from './en.json'

import deDeviceTypes from './device-type-names/de.json'
import enDeviceTypes from './device-type-names/en.json'

// check if all languages intersect
const languages = [en, de]
const keys = Object.keys(en)
for (const language of languages) {
  const languageKeys = Object.keys(language)
  for (const key of keys) {
    if (!languageKeys.includes(key)) {
      throw new Error(`Missing key: ${key}`)
    }
  }
}

export default {
  en: {
    translation: {
      ...en,
      ...enDeviceTypes,
    },
  },
  de: {
    translation: {
      ...de,
      ...deDeviceTypes,
    },
  },
}
