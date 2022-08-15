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

  const credentialsObservable = liveQuery(() =>
    ioBrokerDb.credentials.limit(1).toArray()
  )
  const lowPriorityStatesObservable = liveQuery(() =>
    ioBrokerDb.subscribedStates.where('priority').equals('low').toArray()
  )
  const normalPriorityStatesObservable = liveQuery(() =>
    ioBrokerDb.subscribedStates.where('priority').equals('normal').toArray()
  )
  const highPriorityStatesObservable = liveQuery(() =>
    ioBrokerDb.subscribedStates.where('priority').equals('high').toArray()
  )
  const knownStatesObservable = liveQuery(() => ioBrokerDb.states.toArray())
  const subscribedStatesObservable = liveQuery(() =>
    ioBrokerDb.subscribedStates.toArray()
  )

  credentialsObservable.subscribe((newCredentials) => {
    target.credentials = newCredentials[0] || null
  })

  lowPriorityStatesObservable.subscribe((newLowPriorityStates) => {
    target.states.lowPriority = toStateIdsSet(newLowPriorityStates)

    setBackgroundStates(target.states.background)
  })

  normalPriorityStatesObservable.subscribe((newNormalPriorityStates) => {
    target.states.normalPriority = toStateIdsSet(newNormalPriorityStates)

    setBackgroundStates(target.states.background)
  })

  highPriorityStatesObservable.subscribe((newHighPriorityStates) => {
    target.states.highPriority = toStateIdsSet(newHighPriorityStates)

    setBackgroundStates(target.states.background)
  })

  const sub = knownStatesObservable.subscribe((newKnownStates) => {
    const knownIds = newKnownStates.map((state) => state.id)

    setBackgroundStates(knownIds)
  })

  subscribedStatesObservable.subscribe((states) => {
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
