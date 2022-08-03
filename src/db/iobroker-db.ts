import Dexie, { Table } from 'dexie'
import Device from '../types/device'

class IoBrokerDb extends Dexie {
  credentials!: Table<
    {
      url: string
      cfClientId: string
      cfClientSecret: string
    },
    string
  >
  states!: Table<
    {
      id: string
      value: any
    },
    string
  >
  devices!: Table<Device, string>
  subscribedStates!: Table<
    {
      subscriptionId: string
      id: string
    },
    string
  >

  constructor() {
    super('ioBrokerDb')

    this.version(1).stores({
      credentials: 'url',
      states: 'id',
      devices: 'id',
      subscribedStates: 'subscriptionId,id',
    })
  }
}

const ioBrokerDb = new IoBrokerDb()

export default ioBrokerDb
