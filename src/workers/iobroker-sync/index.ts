import { wrap } from 'comlink'
import Device from '../../types/device'
import IoBrokerSyncWorker from './iobroker-sync-worker?worker'

type Methods = {
  start: () => Promise<void>
  stop: () => void
  refetchDevice: (device: Device) => Promise<void>
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

  refetchState = async (device: Device) => {
    await this.#proxy.refetchDevice(device)
  }
}
