import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [on, , , readyState] = useDeviceState(device, 'on', false)
  const [power, , powerExists] = useDeviceState(device, 'power', 0)

  const texts = useMemo<DataText[]>(
    () =>
      [
        {
          id: 'on',
          text: on ? 'On' : 'Off',
        },
        powerExists &&
          on && {
            id: 'power',
            text: `${power}W`,
          },
      ].filter(Boolean) as DataText[],
    [on, power]
  )

  return {
    texts,
    toggleValue: on,
    readyState,
  }
}

export default useData
