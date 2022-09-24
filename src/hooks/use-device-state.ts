import { useCallback, useEffect, useState } from 'react'
import { useIoBrokerStates } from '../contexts/iobroker-states/iobroker-states'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'

const useDeviceState = <T extends any>(
  device: Device | undefined,
  state: string,
  defaultValue: T
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

    const abortController = new AbortController()
    const subscribeToState = async () => {
      try {
        await subscribeState(path, setValue, abortController.signal)
        setExists(true)
      } catch {}
    }

    subscribeToState()

    return () => {
      abortController.abort()
      setExists(false)
      setValue(defaultValue)
    }
  }, [subscribeState, path])

  return [value, setState, exists] as const
}

export default useDeviceState
