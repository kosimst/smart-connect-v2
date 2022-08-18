import roomLight from './room-light'
import shutter from './shutter'
import windowOpener from './window-opener'
import plug from './plug'
import climateSensor from './climate-sensor'
import musicServer from './music-server'

const controls = {
  'room-light': roomLight,
  light: roomLight,
  shutter,
  'window-opener': windowOpener,
  plug,
  'climate-sensor': climateSensor,
  'music-server': musicServer,
}

export default controls
