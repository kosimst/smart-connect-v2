import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [temperature] = useDeviceState(device, 'temperature', 0)
  const [humidity] = useDeviceState(device, 'humidity', 0)
  const [co2] = useDeviceState(device, 'co2', 0)

  const texts = useMemo<DataText[]>(
    () =>
      [
        {
          text: `${temperature}°C`,
          id: 'temperature',
        },
        {
          text: `${co2}ppm`,
          id: 'co2',
        },
      ].filter(Boolean) as DataText[],
    [temperature, humidity, co2]
  )

  return {
    texts,
  }
}

export default useData
