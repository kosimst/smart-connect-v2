import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [opened] = useDeviceState(device, 'opened', false)

  const texts = useMemo<DataText[]>(
    () => [
      {
        id: 'opened',
        text: opened ? 'Opened' : 'Closed',
      },
    ],
    [opened]
  )

  return {
    toggleValue: opened,
    texts,
  }
}

export default useData
