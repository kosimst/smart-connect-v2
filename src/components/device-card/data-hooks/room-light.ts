import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [brightness, setBrightness] = useDeviceState(device, 'brightness', 0)
  const [on, setOn] = useDeviceState(device, 'on', false)

  const texts = useMemo<DataText[]>(
    () =>
      [
        {
          text: on ? 'On' : 'Off',
          id: 'on',
        },
        {
          text: `${brightness}%`,
          id: 'level',
        },
      ].filter(Boolean) as DataText[],
    [brightness, on]
  )

  return {
    sliderValue: brightness,
    onSliderChange: setBrightness,
    toggleValue: on,
    onToggleChange: setOn,
    texts,
  }
}

export default useData
