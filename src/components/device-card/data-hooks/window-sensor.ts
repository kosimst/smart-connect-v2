import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import useWindowSensor from '../../../hooks/use-window-sensor'
import useWindowTilted from '../../../hooks/use-window-sensor'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const { opened } = useWindowSensor(device, 'opened')
  const { opened: tilted, exists: tiltedExists } = useWindowSensor(
    device,
    'tilted'
  )

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
