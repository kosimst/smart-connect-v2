import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect, useState } from 'react'
import useIoBroker from '../contexts/iobroker-context'
import { useIoBrokerStates } from '../contexts/iobroker-states-context'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'
import { SubscriptionPriority } from '../workers/iobroker-sync'

const useDeviceState = <T extends any>(
  device: Device | undefined,
  state: string,
  defaultValue: T,
  priority: SubscriptionPriority = 'medium'
) => {
  const { subscribeState, updateState } = useIoBrokerStates()

  const path = device && `${device.id}.${state}`

  const [value, setValue] = useState<T>(defaultValue)
  const [exists, setExists] = useState<boolean>(false)

  const dbEntry = useLiveQuery(
    () =>
      ioBrokerDb.states
        .where('id')
        .equals(path ?? 'nowhere-tobe-found')
        .first(),
    [path]
  )

  const setState = useCallback(
    (newValue: T) => {
      if (!path) {
        return
      }

      updateState(path, newValue)
    },
    [updateState, path]
  )

  useEffect(() => {
    if (dbEntry?.value !== undefined) {
      setValue(dbEntry?.value)
      setExists(true)
    }
  }, [dbEntry])

  useEffect(() => {
    if (!path) {
      return
    }

    const unsubscribePromise = subscribeState(path, priority)

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe())
    }
  }, [subscribeState, path])

  return [value, setState, exists] as const
}

export default useDeviceState
