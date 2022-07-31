import { SupportedDeviceType } from '../constants/device-definitions'

type Device = {
  id: string
  name?: string
  roomName?: string
  type: SupportedDeviceType
}

export default Device
