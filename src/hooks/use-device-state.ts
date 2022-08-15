import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect, useState } from 'react'
import useIoBroker from '../contexts/iobroker-context'
import { useIoBrokerStates } from '../contexts/iobroker-states-context'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'

const useDeviceState = <T extends any>(
  device: Device,
  state: string,
  defaultValue: T,
  priority: 'high' | 'normal' | 'low' = 'normal'
) => {
  const { subscribeState, updateState } = useIoBrokerStates()

  const path = `${device.id}.${state}`

  const [value, setValue] = useState<T>(defaultValue)
  const [exists, setExists] = useState<boolean>(false)

  const dbEntry = useLiveQuery(
    () => ioBrokerDb.states.where('id').equals(path).first(),
    [path]
  )

  const setState = useCallback(
    (newValue: T) => {
      updateState(path, newValue)
    },
    [updateState]
  )

  useEffect(() => {
    if (dbEntry?.value !== undefined) {
      setValue(dbEntry?.value)
      setExists(true)
    }
  }, [dbEntry])

  useEffect(() => {
    const unsubscribe = subscribeState(path, priority)

    return unsubscribe
  }, [subscribeState])

  return [value, setState, exists] as const
}

export default useDeviceState
