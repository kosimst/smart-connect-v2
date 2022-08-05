import bedOccupancySensor from './bed-occupancy-sensor'
import brightnessSensor from './brightness-sensor'
import climateSensor from './climate-sensor'
import doorSensor from './door-sensor'
import fan from './fan'
import light from './light'
import plug from './plug'
import presenceSensor from './presence-sensor'
import roomLight from './room-light'
import shutter from './shutter'
import speedTest from './speed-test'
import valve from './valve'
import windowOpener from './window-opener'
import wirelessSwitch from './wireless-switch'
import musicServer from './music-server'
import windowTiltedSensor from './window-tilted-sensor'
import routine from './routine'

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
  'music-server': musicServer,
  'window-tilted-sensor': windowTiltedSensor,
  routine,
}

export default dataHooks
