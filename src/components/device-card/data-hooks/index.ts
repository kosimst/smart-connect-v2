import bedOccupancySensor from './bed-occupancy-sensor'
import climateSensor from './climate-sensor'
import doorSensor from './door-sensor'
import light from './light'
import presenceSensor from './presence-sensor'
import roomLight from './room-light'
import shutter from './shutter'
import valve from './valve'
import windowOpener from './window-opener'
import wirelessSwitch from './wireless-switch'
import fan from './fan'
import plug from './plug'
import brightnessSensor from './brightness-sensor'
import speedTest from './speed-test'

const dataHooks = {
  'bed-occupancy-sensor': bedOccupancySensor,
  'climate-sensor': climateSensor,
  'door-sensor': doorSensor,
  light,
  'presence-sensor': presenceSensor,
  'room-light': roomLight,
  shutter,
  valve,
  'window-opener': windowOpener,
  'wireless-switch': wirelessSwitch,
  fan,
  plug,
  'brightness-sensor': brightnessSensor,
  'speed-test': speedTest,
}

export default dataHooks
