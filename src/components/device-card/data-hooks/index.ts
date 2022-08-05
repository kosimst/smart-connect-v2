import bedOccupancySensor from './bed-occupancy-sensor'
import brightnessSensor from './brightness-sensor'
import climateSensor from './climate-sensor'
import doorSensor from './door-sensor'
import fan from './fan'
import light from './light'
import musicServer from './music-server'
import plug from './plug'
import presenceSensor from './presence-sensor'
import roomLight from './room-light'
import routine from './routine'
import shutter from './shutter'
import speedTest from './speed-test'
import valve from './valve'
import windowOpenedSensor from './window-opened-sensor'
import windowOpener from './window-opener'
import windowSensor from './window-sensor'
import windowTiltedSensor from './window-tilted-sensor'
import wirelessSwitch from './wireless-switch'

const dataHooks = {
  'bed-occupancy-sensor': bedOccupancySensor,
  'brightness-sensor': brightnessSensor,
  'climate-sensor': climateSensor,
  'door-sensor': doorSensor,
  'music-server': musicServer,
  'presence-sensor': presenceSensor,
  'room-light': roomLight,
  'speed-test': speedTest,
  'window-opened-sensor': windowOpenedSensor,
  'window-opener': windowOpener,
  'window-sensor': windowSensor,
  'window-tilted-sensor': windowTiltedSensor,
  'wireless-switch': wirelessSwitch,
  fan,
  light,
  plug,
  routine,
  shutter,
  valve,
}

export default dataHooks
