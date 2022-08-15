import Dexie, { Table } from 'dexie'
import Credentials from '../types/credentials'
import Device from '../types/device'
import SubscribedState from '../types/subscribed-state'

export class IoBrokerDb extends Dexie {
  credentials!: Table<Credentials, string>
  states!: Table<
    {
      id: string
      value: any
    },
    string
  >
  devices!: Table<Device, string>
  subscribedStates!: Table<SubscribedState, string>

  constructor() {
    super('ioBrokerDb')

    this.version(4).stores({
      credentials: 'url',
      states: 'id',
      devices: 'id',
      subscribedStates: 'subscriptionId,id,priority',
    })
  }
}

const ioBrokerDb = new IoBrokerDb()

export default ioBrokerDb
