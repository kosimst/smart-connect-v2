import bedOccupancySensor from './bed-occupancy-sensor'
import brightnessSensor from './brightness-sensor'
import climateSensor from './climate-sensor'
import doorSensor from './door-sensor'
import fan from './fan'
import light from './light'
import musicServer from './music-server'
import nukiLock from './nuki-lock'
import nukiOpener from './nuki-opener'
import plug from './plug'
import presenceSensor from './presence-sensor'
import roomLight from './room-light'
import routine from './routine'
import shutter from './shutter'
import speedTest from './speed-test'
import switchHook from './switch'
import valve from './valve'
import windowOpener from './window-opener'
import windowSensor from './window-sensor'
import wirelessSwitch from './wireless-switch'

const dataHooks = {
  'bed-occupancy-sensor': bedOccupancySensor,
  'brightness-sensor': brightnessSensor,
  'climate-sensor': climateSensor,
  'door-sensor': doorSensor,
  'entrance-door-sensor': doorSensor,
  'music-server': musicServer,
  'nuki-lock': nukiLock,
  'nuki-opener': nukiOpener,
  'presence-sensor': presenceSensor,
  'room-light': roomLight,
  'speed-test': speedTest,
  'window-opened-sensor': windowSensor,
  'window-opener': windowOpener,
  'window-tilted-sensor': windowSensor,
  'wireless-switch': wirelessSwitch,
  fan,
  light,
  plug,
  routine,
  shutter,
  switch: switchHook,
  valve,
}

export default dataHooks
