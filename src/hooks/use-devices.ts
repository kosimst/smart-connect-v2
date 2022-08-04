import { useLiveQuery } from 'dexie-react-hooks'
import ioBrokerDb from '../db/iobroker-db'

const useDevices = () => {
  const devices = useLiveQuery(() => ioBrokerDb.devices.toArray(), [], [])

  return devices
}

export default useDevices
