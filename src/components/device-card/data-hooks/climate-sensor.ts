import { useMemo } from 'react'
import readableFloat from '../../../helpers/readable-float'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [temperature] = useDeviceState(device, 'temperature', 0)
  const [humidity, , humidityExists] = useDeviceState(device, 'humidity', 0)
  const [co2, , co2Exists] = useDeviceState(device, 'co2', 0)
  const [battery] = useDeviceState(device, 'battery', 100)

  const texts = useMemo<DataText[]>(
    () =>
      battery <= 5
        ? [
            {
              id: 'battery',
              text: `Low battery`,
            },
          ]
        : ([
            {
              id: 'temperature',
              text: `${readableFloat(temperature, 1)}°C`,
            },
            humidityExists &&
              !co2Exists && {
                id: 'humidity',
                text: `${readableFloat(humidity, 0)}%`,
              },
            co2Exists && {
              id: 'co2',
              text: `${readableFloat(co2, 0)}ppm`,
            },
          ].filter(Boolean) as DataText[]),
    [temperature, humidity, co2, battery, humidityExists, co2Exists]
  )

  return {
    texts,
  }
}

export default useData
