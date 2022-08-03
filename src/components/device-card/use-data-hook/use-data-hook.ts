import Device from '../../../types/device'
import dataHooks from '../data-hooks'

const useDataHook = ({ type: deviceType }: Device) => {
  // @ts-ignore
  if (!dataHooks[deviceType]) {
    throw new Error(`No data hook for device type ${deviceType}`)
  }

  // @ts-ignore
  return dataHooks[deviceType]
}

export default useDataHook
