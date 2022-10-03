import { useCallback, useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [level, setLevel, , readyState] = useDeviceState(
    device,
    'opened-level',
    0
  )
  const [direction] = useDeviceState(device, 'direction', 0)
  const [, setStop] = useDeviceState(device, 'stop', true)

  const usedLevel = level === 99 ? 100 : level

  const texts = useMemo<DataText[]>(
    () =>
      [
        !direction && {
          text:
            usedLevel === 100
              ? 'Opened'
              : level === 0
              ? 'Shut'
              : `${100 - usedLevel}% shut`,
          id: 'level',
        },
        direction && {
          text: direction === 1 ? 'Opening...' : 'Shutting...',
          id: 'direction',
        },
      ].filter(Boolean) as DataText[],
    [level, direction]
  )

  const onSliderChange = useCallback(
    (newLevel: number) => {
      setLevel(Math.min(100 - newLevel, 99))
    },
    [setLevel]
  )

  const onToggleChange = useCallback(
    (newToggle: boolean) => {
      if (direction === 0) {
        setLevel(newToggle ? 0 : 100)
      } else {
        setStop(true)
      }
    },
    [direction, setLevel, setStop]
  )

  return {
    texts,
    sliderValue: 100 - usedLevel,
    onSliderChange,
    onToggleChange,
    toggleValue: usedLevel < 100,
    readyState,
  }
}

export default useData
