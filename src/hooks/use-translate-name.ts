import { useTranslation } from 'react-i18next'

const useTranslateName = (name: string) => {
  const { i18n } = useTranslation()
  const lang = i18n.language

  if (lang === 'en') {
    return name
  }

  return name
}

export default useTranslateName
