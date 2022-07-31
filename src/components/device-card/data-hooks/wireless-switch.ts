import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [battery] = useDeviceState(device, 'battery', 100)
  const [available] = useDeviceState(device, 'available', true)

  const texts = useMemo<DataText[]>(
    () =>
      [
        available && {
          id: 'battery',
          text: `${battery}% battery`,
        },
        !available && {
          id: 'available',
          text: 'Not available',
        },
      ].filter(Boolean) as DataText[],
    [battery, available]
  )

  return {
    toggleValue: available,
    texts,
  }
}

export default useData
