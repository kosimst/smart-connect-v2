import Device from '../../../types/device'
import dataHooks from '../data-hooks'
import DataHook from './data-hook'

const useDataHook = ({ type: deviceType }: Device) => {
  // @ts-ignore
  if (!dataHooks[deviceType]) {
    throw new Error(`No data hook for device type ${deviceType}`)
  }

  // @ts-ignore
  return dataHooks[deviceType] as DataHook
}

export default useDataHook
