import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [brightness, setBrightness, brightnessExists] = useDeviceState(
    device,
    'brightness',
    0
  )
  const [on, setOn, , readyState] = useDeviceState(device, 'on', false)

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
    readyState,
  }
}

export default useData
