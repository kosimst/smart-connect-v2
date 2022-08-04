const deviceDefinitions = {
  'room-light': {
    icon: 'light',
    color: '#EF6C00',
    bgColor: '#FFECB3',
    name: 'Lights',
    fullName: 'Room lights',
  },
  light: {
    icon: 'light',
    color: '#EF6C00',
    bgColor: '#FFECB3',
    name: 'Light',
    fullName: 'Light',
  },
  shutter: {
    icon: 'blinds',
    color: '#00695C',
    bgColor: '#B2DFDB',
    name: 'Shutter',
    fullName: 'Shutter',
  },
  'window-opener': {
    icon: 'sensor_window',
    color: '#00695C',
    bgColor: '#B2DFDB',
    name: 'Window opener',
    fullName: 'Window opener',
  },
  plug: {
    icon: 'outlet',
    color: '#AD1457',
    bgColor: '#F8BBD0',
    name: 'Plug',
    fullName: 'Smart plug',
  },
  'presence-sensor': {
    icon: 'sensor_occupied',
    color: '#D84315',
    bgColor: '#FFCCBC',
    name: 'Presence',
    fullName: 'Presence sensor',
  },
  'bed-occupancy-sensor': {
    icon: 'airline_seat_flat',
    color: '#D84315',
    bgColor: '#FFCCBC',
    name: 'Bed occupancy',
    fullName: 'Bed occupancy sensor',
  },
  'door-sensor': {
    icon: 'door_back',
    color: '#283593',
    bgColor: '#C5CAE9',
    name: 'Door sensor',
    fullName: 'Door sensor',
  },
  'climate-sensor': {
    icon: 'thermostat',
    color: '#4527A0',
    bgColor: '#D1C4E9',
    name: 'Climate',
    fullName: 'Climate sensor',
  },
  'brightness-sensor': {
    icon: 'brightness_6',
    color: '#4527A0',
    bgColor: '#D1C4E9',
    name: 'Brightness',
    fullName: 'Brightness sensor',
  },
  'wireless-switch': {
    icon: 'switch',
    color: '#AD1457',
    bgColor: '#F8BBD0',
    name: 'Wireless switch',
    fullName: 'Wireless switch',
  },
  valve: {
    icon: 'valve',
    color: '#1565C0',
    bgColor: '#CCE4FC',
    name: 'Valve',
    fullName: 'Valve',
  },
  fan: {
    icon: 'mode_fan',
    color: '#1565C0',
    bgColor: '#CCE4FC',
    name: 'Fan',
    fullName: 'Fan',
  },
  'speed-test': {
    icon: 'speed',
    color: '#1565C0',
    bgColor: '#CCE4FC',
    name: 'Speed test',
    fullName: 'Internet speed',
  },
  'music-server': {
    icon: 'album',
    color: '#1565C0',
    bgColor: '#CCE4FC',
    name: 'Music',
    fullName: 'Music server',
  },
} as const

export const supportedDeviceTypes = Object.keys(
  deviceDefinitions
) as SupportedDeviceType[]

export type SupportedDeviceType = keyof typeof deviceDefinitions

export function isSupportedDeviceType(
  deviceType: string
): deviceType is SupportedDeviceType {
  // @ts-ignore
  return supportedDeviceTypes.includes(deviceType)
}

export function assertSupportedDeviceType(
  type: string
): asserts type is SupportedDeviceType {
  // @ts-ignore
  if (!supportedDeviceTypes.includes(type)) {
    throw new Error(`Unsupported device type: ${type}`)
  }
}

export const inactiveSliderColor = '#DFDFDF'

export const inactiveBgColor = '#ECECEC'

export const inactiveColor = '#585858'

export default deviceDefinitions
