import { useMemo } from 'react'
import useWindowSensor from '../../../hooks/use-window-sensor'
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
