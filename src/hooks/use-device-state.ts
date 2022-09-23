import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect, useState } from 'react'
import { useIoBrokerStates } from '../contexts/iobroker-states/iobroker-states'
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
    if (!path) {
      return
    }

    const cb = (val: T) => {
      setValue(val)
      setExists(true)
    }

    const unsubscribePromise = subscribeState(path, cb)

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe())
    }
  }, [subscribeState, path, priority])

  return [value, setState, exists] as const
}

export default useDeviceState
