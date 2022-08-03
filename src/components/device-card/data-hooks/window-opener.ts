import { useCallback, useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook from '../use-data-hook/data-hook'

const useData: DataHook = (device) => {
  const [openedLevel, setOpenedLevel] = useDeviceState(
    device,
    'opened-level',
    -0.5
  )

  const texts = useMemo(
    () => [
      {
        id: 'opened-state',
        text:
          openedLevel === -0.5
            ? 'Locked'
            : openedLevel === 100
            ? 'Opened'
            : `${openedLevel}% opened`,
      },
    ],
    [openedLevel]
  )

  const onToggleChange = useCallback(
    (value: boolean) => {
      setOpenedLevel(value ? 100 : -0.5)
    },
    [setOpenedLevel]
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
