import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import useWindowSensor from '../../../hooks/use-window-sensor'
import useWindowTilted from '../../../hooks/use-window-sensor'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device, visible) => {
  const { opened } = useWindowSensor(
    device,
    'opened',
    visible ? 'medium' : 'background'
  )
  const { opened: tilted, exists: tiltedExists } = useWindowSensor(
    device,
    'tilted',
    visible ? 'medium' : 'background'
  )

  const texts = useMemo<DataText[]>(
    () => [
      {
        id: 'state',
        text: opened
          ? 'Opened'
          : tiltedExists
          ? tilted
            ? 'Tilted'
            : 'Closed'
          : 'Closed',
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
