import { wrap } from 'comlink'
import Dexie from 'dexie'
import ioBrokerDb from '../../db/iobroker-db'
import Device from '../../types/device'
import IoBrokerSyncWorker from './iobroker-sync-worker?worker'

type Methods = {
  start: () => Promise<void>
  stop: () => void
  refetchDevice: (deviceId: string) => Promise<void>
}

export default class IoBrokerSync {
  #worker = new IoBrokerSyncWorker()

  #proxy = wrap<Methods>(this.#worker)

  start = async () => {
    await this.#proxy.start()
  }

  stop = async () => {
    await this.#proxy.stop()
  }

  refetchDevice = async (deviceId: string) => {
    await this.#proxy.refetchDevice(deviceId)
  }
}
