import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device, visible) => {
  const [brightness, setBrightness, brightnessExists] = useDeviceState(
    device,
    'brightness',
    0,
    visible ? 'medium' : 'background'
  )
  const [on, setOn] = useDeviceState(
    device,
    'on',
    false,
    visible ? 'medium' : 'background'
  )

  const texts = useMemo<DataText[]>(
    () =>
      [
        {
          text: on ? 'On' : 'Off',
          id: 'on',
        },
        brightnessExists &&
          on && {
            text: `${brightness}%`,
            id: 'level',
          },
      ].filter(Boolean) as DataText[],
    [brightness, on]
  )

  return {
    ...(brightnessExists
      ? { sliderValue: brightness, onSliderChange: setBrightness }
      : {}),
    toggleValue: on,
    onToggleChange: setOn,
    texts,
  }
}

export default useData
