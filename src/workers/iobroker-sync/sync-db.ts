import { liveQuery } from 'dexie'
import { Signal } from '@preact/signals-core'

import ioBrokerDb from '../../db/iobroker-db'
import Credentials from '../../types/credentials'

const syncDb = async (
  credentials: Signal<Credentials | null>,
  states: Signal<Set<string>>
) => {
  const knownStatesObservable = liveQuery(() => ioBrokerDb.states.toArray())
  const credentialsObservable = liveQuery(() =>
    ioBrokerDb.credentials.limit(1).toArray()
  )

  knownStatesObservable.subscribe((newKnownStates) => {
    const knownIds = newKnownStates.map((state) => state.id)
    states.value = new Set(knownIds)
  })

  credentialsObservable.subscribe((newCredentials) => {
    credentials.value = newCredentials[0] || null
  })
}

export default syncDb
