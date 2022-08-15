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
    background: string[]
    lowPriority: string[]
    normalPriority: string[]
    highPriority: string[]
  }
}) => {
  const setBackgroundStates = (states: string[]) => {
    const newBackgroundStates = states.filter(
      (id) =>
        !target.states.lowPriority.includes(id) &&
        !target.states.normalPriority.includes(id) &&
        !target.states.highPriority.includes(id)
    )

    target.states.background = [...new Set(newBackgroundStates)]
  }

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
  const knownStatesQuery = ioBrokerDb.states.toArray()
  const subscribedStatesQuery = ioBrokerDb.subscribedStates.toArray()

  const credentialsObservable = liveQuery(() => credentialsQuery)
  const lowPriorityStatesObservable = liveQuery(() => lowPriorityQuery)
  const normalPriorityStatesObservable = liveQuery(() => normalPriorityQuery)
  const highPriorityStatesObservable = liveQuery(() => highPriorityQuery)
  const knownStatesObservable = liveQuery(() => knownStatesQuery)
  const subscribedStatesObservable = liveQuery(() => subscribedStatesQuery)

  credentialsObservable.subscribe((newCredentials) => {
    target.credentials = newCredentials[0] || null
  })

  lowPriorityStatesObservable.subscribe((newLowPriorityStates) => {
    console.log({
      newLowPriorityStates,
    })

    target.states.lowPriority = toStateIdsSet(newLowPriorityStates)

    setBackgroundStates(target.states.background)
  })

  normalPriorityStatesObservable.subscribe((newNormalPriorityStates) => {
    console.log({
      newNormalPriorityStates,
    })
    target.states.normalPriority = toStateIdsSet(newNormalPriorityStates)

    setBackgroundStates(target.states.background)
  })

  highPriorityStatesObservable.subscribe((newHighPriorityStates) => {
    console.log({
      newHighPriorityStates,
    })
    target.states.highPriority = toStateIdsSet(newHighPriorityStates)

    setBackgroundStates(target.states.background)
  })

  const sub = knownStatesObservable.subscribe((newKnownStates) => {
    console.log({ newKnownStates })

    const knownIds = newKnownStates.map((state) => state.id)

    setBackgroundStates(knownIds)
  })

  subscribedStatesObservable.subscribe((states) => {
    console.log({ states })

    const newBackgroundStates = states.filter(
      (state) =>
        !target.states.lowPriority.includes(state.id) &&
        !target.states.normalPriority.includes(state.id) &&
        !target.states.highPriority.includes(state.id)
    )

    target.states.background = [
      ...new Set(newBackgroundStates.map((state) => state.id)),
    ]
  })
}

export default syncDb
