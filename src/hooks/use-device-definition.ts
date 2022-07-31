import deviceDefinitions from '../constants/device-definitions'
import Device from '../types/device'

const useDeviceDefinition = (device: Device) => {
  return deviceDefinitions[device.type]
}

export default useDeviceDefinition
