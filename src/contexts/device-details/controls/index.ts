import roomLight from './room-light'
import shutter from './shutter'
import windowOpener from './window-opener'
import plug from './plug'
import climateSensor from './climate-sensor'
import musicServer from './music-server'
import speedTest from './speed-test'
import nukiLock from './nuki-lock'
import nukiOpener from './nuki-opener'
import readonlyPlug from './readonly-plug'

const controls = {
  'room-light': roomLight,
  light: roomLight,
  shutter,
  'window-opener': windowOpener,
  plug,
  'climate-sensor': climateSensor,
  'music-server': musicServer,
  'speed-test': speedTest,
  'nuki-lock': nukiLock,
  'nuki-opener': nukiOpener,
  'readonly-plug': readonlyPlug,
}

export default controls
