import { useCallback, useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [openedLevel, setOpenedLevel] = useDeviceState(
    device,
    'opened-level',
    -0.5
  )
  const [direction] = useDeviceState(device, 'direction', 0)
  const [, setStop] = useDeviceState(device, 'stop', true)

  const texts = useMemo(
    () => [
      direction
        ? {
            id: 'direction',
            text: direction === 1 ? 'Opening...' : 'Closing...',
          }
        : {
            id: 'opened-state',
            text:
              openedLevel === -0.5
                ? 'Locked'
                : openedLevel === 100
                ? 'Tilted'
                : `${openedLevel}% tilted`,
          },
    ],
    [openedLevel, direction]
  )

  const onToggleChange = useCallback(
    (newToggle: boolean) => {
      if (direction === 0) {
        setOpenedLevel(newToggle ? 100 : -0.5)
      } else {
        setStop(true)
      }
    },
    [direction, setOpenedLevel, setStop]
  )

  const toggleValue = useMemo(() => openedLevel > -0.5, [openedLevel])

  return {
    texts,
    sliderValue: openedLevel,
    toggleValue,
    onSliderChange: setOpenedLevel,
    onToggleChange,
  }
}

export default useData
