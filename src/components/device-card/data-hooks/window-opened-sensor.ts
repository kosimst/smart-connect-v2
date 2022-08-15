import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import useWindowTilted from '../../../hooks/use-window-tilted'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [opened] = useDeviceState(device, 'opened', false)
  const [tilted, tiltedExists] = useWindowTilted(device)

  const texts = useMemo<DataText[]>(
    () => [
      {
        id: 'state',
        text: tiltedExists && tilted ? 'Tilted' : opened ? 'Opened' : 'Closed',
      },
    ],
    [opened, tilted, tiltedExists]
  )

  return {
    toggleValue: opened || (tiltedExists && tilted),
    texts,
  }
}

export default useData
