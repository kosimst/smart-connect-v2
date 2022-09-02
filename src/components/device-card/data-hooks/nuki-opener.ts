import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device, visible) => {
  /**
    "0": "NO_ACTION",
    "1": "ACTIVE RTO",
    "2": "DEACTIVATE RTO",
    "3": "ELECTRIC STRIKE ACTUATION",
    "4": "ACTIVATE CM",
    "5": "DEACTIVATE CM"
   */
  const [, setAction] = useDeviceState(
    device,
    'action',
    0 as 0 | 1 | 2 | 3 | 4 | 5,
    visible ? 'medium' : 'background'
  )

  /**
   "0": "UNINITIALIZED",
    "1": "PAIRING",
    "2": "NORMAL",
    "3": "CONTINUOUS",
    "4": "MAINTENANCE"
   */
  const [mode] = useDeviceState(
    device,
    'mode',
    0 as 0 | 1 | 2 | 3 | 4,
    visible ? 'medium' : 'background'
  )

  /**
    "0": "UNTRAINED",
    "1": "ONLINE",
    "3": "RING_TO_OPEN",
    "5": "OPEN",
    "7": "OPENING",
    "253": "BOOT_RUN",
    "255": "UNDEFINED"
   */
  const [lockState] = useDeviceState(
    device,
    'lock-state',
    0 as 0 | 1 | 3 | 5 | 7 | 253 | 255,
    visible ? 'medium' : 'background'
  )

  const isRingToOpen = lockState === 3
  const isContinuousMode = mode === 3
  const isNormalMode = mode === 2 && lockState === 1

  const texts = useMemo<DataText[]>(
    () =>
      isNormalMode
        ? [
            {
              id: 'normal',
              text: 'Normal',
            },
          ]
        : isContinuousMode
        ? [
            {
              id: 'continuous',
              text: 'Continuous',
            },
          ]
        : isRingToOpen
        ? [
            {
              id: 'ring-to-open',
              text: 'Ring to open',
            },
          ]
        : [
            {
              id: 'unknown',
              text: 'Unknown',
            },
          ],
    [isRingToOpen, isContinuousMode, isNormalMode]
  )

  return {
    texts,
    toggleValue: true,
    onToggleChange: () => {
      setAction(3)
    },
  }
}

export default useData
