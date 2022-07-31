import { useCallback, useEffect, useState } from 'react'
import { useSocketClient } from '../contexts/socket-client'
import Device from '../types/device'

const useDeviceState = <T extends any>(
  device: Device,
  state: string,
  defaultValue: T
) => {
  const ioSocket = useSocketClient()

  const path = `${device.id}.${state}`

  const [value, setValue] = useState<T>(defaultValue)
  const [exists, setExists] = useState<boolean>(false)

  const setState = useCallback(
    (newValue: T) => {
      if (!ioSocket.connected) {
        return
      }

      ioSocket.setState(path, newValue)
    },
    [ioSocket, device.id, state]
  )

  useEffect(() => {
    if (!ioSocket.connected) {
      return
    }

    let unsubscribe = () => {}

    const addListener = async () => {
      try {
        await ioSocket.getState(path)
      } catch (e) {
        setExists(false)
        return
      }

      setExists(true)

      const handler = (id: string, state: any) => {
        setValue(state.val)
      }

      ioSocket.subscribeState(path, handler)

      unsubscribe = () =>
        ioSocket.unsubscribeState(`${device.id}.${state}`, handler)
    }

    addListener()

    return () => {
      unsubscribe()
    }
  }, [ioSocket, setExists])

  return [value, setState, exists] as const
}

export default useDeviceState
