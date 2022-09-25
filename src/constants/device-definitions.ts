import {
  amber,
  blue,
  deepOrange,
  indigo,
  pink,
  purple,
  teal,
  yellow,
} from '@mui/material/colors'

const modifiedAmber = {
  ...amber,
  900: yellow[900],
}

const colors = {
  light: {
    accentColor: modifiedAmber,
  },
  sensor: {
    accentColor: purple,
  },
  security: {
    accentColor: deepOrange,
  },
  openedLevel: {
    accentColor: teal,
  },
  routine: {
    accentColor: pink,
  },
  default: {
    accentColor: blue,
  },
  media: {
    accentColor: indigo,
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
  'entrance-door-sensor': {
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
    fullName: 'Window sensor',
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
  'nuki-lock': {
    icon: 'lock_open',
    name: 'Nuki',
    fullName: 'Nuki lock',
    ...colors.security,
  },
  'readonly-plug': {
    icon: 'outlet',
    name: 'R/O Plug',
    fullName: 'R/O Smart plug',
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
export default deviceDefinitions
