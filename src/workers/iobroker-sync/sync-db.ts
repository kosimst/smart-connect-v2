import Dexie, { liveQuery } from 'dexie'
import ioBrokerDb from '../../db/iobroker-db'
import Credentials from '../../types/credentials'
import SubscribedState from '../../types/subscribed-state'

const toStateIdsSet = (states: SubscribedState[]) => [
  ...new Set(states.map((state) => state.id)),
]

const syncDb = async (target: {
  credentials: Credentials | null
  states: {
    lowPriority: string[]
    normalPriority: string[]
    highPriority: string[]
  }
}) => {
  const credentialsQuery = ioBrokerDb.credentials.limit(1).toArray()
  const lowPriorityQuery = ioBrokerDb.subscribedStates
    .where('priority')
    .equals('low')
    .toArray()
  const normalPriorityQuery = ioBrokerDb.subscribedStates
    .where('priority')
    .equals('normal')
    .toArray()
  const highPriorityQuery = ioBrokerDb.subscribedStates
    .where('priority')
    .equals('high')
    .toArray()

  const credentialsObservable = liveQuery(() => credentialsQuery)
  const lowPriorityStatesObservable = liveQuery(() => lowPriorityQuery)
  const normalPriorityStatesObservable = liveQuery(() => normalPriorityQuery)
  const highPriorityStatesObservable = liveQuery(() => highPriorityQuery)

  credentialsObservable.subscribe((newCredentials) => {
    target.credentials = newCredentials[0] || null
  })

  lowPriorityStatesObservable.subscribe((newLowPriorityStates) => {
    target.states.lowPriority = toStateIdsSet(newLowPriorityStates)
  })

  normalPriorityStatesObservable.subscribe((newNormalPriorityStates) => {
    target.states.normalPriority = toStateIdsSet(newNormalPriorityStates)
  })

  highPriorityStatesObservable.subscribe((newHighPriorityStates) => {
    target.states.highPriority = toStateIdsSet(newHighPriorityStates)
  })

  target.credentials = (await credentialsQuery)[0] || null
}

export default syncDb
