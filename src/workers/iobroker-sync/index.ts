import { wrap } from 'comlink'
import Dexie from 'dexie'
import ioBrokerDb from '../../db/iobroker-db'
import Device from '../../types/device'
import { WorkerMethods } from './iobroker-sync-worker'
import IoBrokerSyncWorker from './iobroker-sync-worker?worker'

export type SubscriptionPriority = 'high' | 'medium' | 'low' | 'background'

export default class IoBrokerSync {
  #worker = new IoBrokerSyncWorker()

  #proxy = wrap<WorkerMethods>(this.#worker)

  start = async () => {
    await this.#proxy.start()
  }

  stop = async () => {
    await this.#proxy.stop()
  }

  refetchDevice = async (deviceId: string) => {
    await this.#proxy.refetchDevice(deviceId)
  }

  subscribeState = async (id: string, priority: SubscriptionPriority) => {
    const subscriptionId = await this.#proxy.subscribeState(id, priority)

    return () => this.#proxy.unsubscribeState(subscriptionId)
  }
}
