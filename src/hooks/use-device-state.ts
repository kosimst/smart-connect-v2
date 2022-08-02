import { useCallback, useEffect, useState } from 'react'
import useIoBroker from '../contexts/iobroker-context'
import { useIoBrokerStates } from '../contexts/iobroker-states-context'
import Device from '../types/device'

const useDeviceState = <T extends any>(
  device: Device,
  state: string,
  defaultValue: T
) => {
  const { fetchIoBroker } = useIoBroker()
  const { subscribeState } = useIoBrokerStates()

  const path = `${device.id}.${state}`

  const [value, setValue] = useState<T>(defaultValue)
  const [exists, setExists] = useState<boolean>(false)

  const setState = useCallback(
    (newValue: T) => {
      fetchIoBroker(`/set/${path}?value=${newValue}`)
    },
    [device.id, state, fetchIoBroker]
  )

  useEffect(() => {
    const unsubscribe = subscribeState(path, (newValue) => {
      setValue(newValue)
      setExists(true)
    })

    return unsubscribe
  }, [subscribeState])

  return [value, setState, exists] as const
}

export default useDeviceState
