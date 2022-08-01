import Device from '../../../types/device'
import DataHook from './data-hook'

const cache = new Map<string, DataHook>()
const errorCache = new Map<string, Error>()

const useDataHook = ({ type: deviceType }: Device) => {
  const cachedDataHook = cache.get(deviceType)
  const cachedError = errorCache.get(deviceType)

  if (cachedDataHook) {
    return cachedDataHook
  }

  if (cachedError) {
    throw cachedError
  }

  throw import(
    /* @vite-ignore */
    `../data-hooks/${deviceType}`
  )
    .then(({ default: dataHook }) => {
      cache.set(deviceType, dataHook)
      return dataHook as DataHook
    })
    .catch(() => {
      const error = new Error(`Failed to load device type "${deviceType}"`)

      errorCache.set(deviceType, error)
      throw error
    })
}

export default useDataHook
