const colors = {
  light: {
    color: '#EF6C00',
    bgColor: '#FFECB3',
  },
  sensor: {
    color: '#4527A0',
    bgColor: '#D1C4E9',
  },
  security: {
    color: '#D84315',
    bgColor: '#FFCCBC',
  },
  openedLevel: {
    color: '#00695C',
    bgColor: '#B2DFDB',
  },
  routine: {
    color: '#AD1457',
    bgColor: '#F8BBD0',
  },
  default: {
    color: '#1565C0',
    bgColor: '#CCE4FC',
  },
  media: {
    color: '#3F51B5',
    bgColor: '#C5CAE9',
  },
}

const deviceDefinitions = {
  'room-light': {
    icon: 'light_group',
    name: 'Lights',
    fullName: 'Room light',
    ...colors.light,
  },
  light: {
    icon: 'light',
    name: 'Light',
    fullName: 'Light',
    ...colors.light,
  },
  shutter: {
    icon: 'blinds',
    name: 'Shutter',
    fullName: 'Shutter',
    ...colors.openedLevel,
  },
  'window-opener': {
    icon: 'sensor_window',
    name: 'Window opener',
    fullName: 'Window opener',
    ...colors.openedLevel,
  },
  plug: {
    icon: 'outlet',
    name: 'Plug',
    fullName: 'Smart plug',
    ...colors.default,
  },
  'presence-sensor': {
    icon: 'sensor_occupied',
    name: 'Presence',
    fullName: 'Presence sensor',
    ...colors.security,
  },
  'bed-occupancy-sensor': {
    icon: 'airline_seat_flat',
    name: 'Bed occupancy',
    fullName: 'Bed occupancy sensor',
    ...colors.security,
  },
  'door-sensor': {
    icon: 'door_back',
    name: 'Door sensor',
    fullName: 'Door sensor',
    ...colors.security,
  },
  'climate-sensor': {
    icon: 'thermostat',
    name: 'Climate',
    fullName: 'Climate sensor',
    ...colors.sensor,
  },
  'brightness-sensor': {
    icon: 'brightness_6',
    name: 'Brightness',
    fullName: 'Brightness sensor',
    ...colors.sensor,
  },
  'wireless-switch': {
    icon: 'switch',
    name: 'Wireless switch',
    fullName: 'Wireless switch',
    ...colors.default,
  },
  valve: {
    icon: 'valve',
    name: 'Valve',
    fullName: 'Valve',
    ...colors.default,
  },
  fan: {
    icon: 'mode_fan',
    name: 'Fan',
    fullName: 'Fan',
    ...colors.default,
  },
  'speed-test': {
    icon: 'speed',
    name: 'Speed test',
    fullName: 'Internet speed',
    ...colors.default,
  },
  'music-server': {
    icon: 'album',
    name: 'Music',
    fullName: 'Music server',
    ...colors.media,
  },
  'window-tilted-sensor': {
    icon: 'window_sensor',
    name: 'Window sensor',
    fullName: 'Window tilted sensor',
    hidden: true,
    ...colors.security,
  },
  'window-opened-sensor': {
    icon: 'window_sensor',
    name: 'Window sensor',
    fullName: 'Window opened sensor',
    hidden: true,
    ...colors.security,
  },
  routine: {
    icon: 'routine',
    name: 'Routine',
    fullName: 'Routine',
    ...colors.routine,
  },
  'nuki-opener': {
    icon: 'doorbell_3p',
    name: 'Opener',
    fullName: 'Nuki opener',
    ...colors.security,
  },
  switch: {
    icon: 'toggle_on',
    name: 'Switch',
    fullName: 'Switch',
    ...colors.default,
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
