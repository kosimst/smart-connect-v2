import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [windowOpenedState] = useDeviceState(
    device,
    'window-opened-state',
    0 as 0 | 1 | 2
  )

  const texts = useMemo<DataText[]>(
    () => [
      {
        id: 'opened',
        text:
          windowOpenedState === 0
            ? 'Closed'
            : windowOpenedState === 1
            ? 'Tilted'
            : 'Opened',
      },
    ],
    [windowOpenedState]
  )

  return {
    toggleValue: windowOpenedState > 0,
    texts,
  }
}

export default useData
