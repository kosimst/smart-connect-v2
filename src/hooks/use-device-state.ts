import { useCallback, useEffect, useState } from 'react'
import { useIoBrokerStates } from '../contexts/iobroker-states/iobroker-states'
import Device from '../types/device'

export type ReadyState = 'ready' | 'init' | 'timeout'

const useDeviceState = <T extends any>(
  device: Device | undefined,
  state: string,
  defaultValue: T
) => {
  const { subscribeState, updateState } = useIoBrokerStates()

  const path = device && `${device.id}.${state}`

  const [value, setValue] = useState<T>(defaultValue)
  const [exists, setExists] = useState<boolean>(false)

  const [readyState, setReadyState] = useState<ReadyState>('init')

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
        await subscribeState(
          path,
          (val) => {
            setReadyState('ready')
            setValue(val)
          },
          abortController.signal
        )
        if (abortController.signal.aborted) {
          return
        }
        setExists(true)
        setReadyState('ready')
      } catch {}
    }

    subscribeToState()

    return () => {
      abortController.abort()
      setExists(false)
      setValue(defaultValue)
    }
  }, [subscribeState, path])

  return [value, setState, exists, readyState] as const
}

export default useDeviceState
