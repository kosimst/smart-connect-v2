import { liveQuery } from 'dexie'
import ioBrokerDb from '../../db/iobroker-db'
import Credentials from '../../types/credentials'

const syncDb = async (target: {
  credentials: Credentials | null
  states: string[]
}) => {
  const knownStatesObservable = liveQuery(() => ioBrokerDb.states.toArray())
  const credentialsObservable = liveQuery(() =>
    ioBrokerDb.credentials.limit(1).toArray()
  )

  knownStatesObservable.subscribe((newKnownStates) => {
    const knownIds = newKnownStates.map((state) => state.id)
    target.states = [...new Set(knownIds)]
  })

  credentialsObservable.subscribe((newCredentials) => {
    target.credentials = newCredentials[0] || null
  })
}

export default syncDb
