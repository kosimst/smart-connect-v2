import { useMemo } from 'react'
import useDeviceState from '../../../hooks/use-device-state'
import DataHook, { DataText } from '../use-data-hook/data-hook'

const useData: DataHook = (device, visible) => {
  /**
    "0": "NO_ACTION",
    "1": "UNLOCK",
    "2": "LOCK",
    "3": "UNLATCH",
    "4": "LOCK_N_GO",
    "5": "LOCK_N_GO_WITH_UNLATCH"
   */
  const [, setAction] = useDeviceState(
    device,
    'action',
    0 as 0 | 1 | 2 | 3 | 4 | 5,
    visible ? 'medium' : 'background'
  )

  /**
   "0": "UNCALIBRATED",
    "1": "LOCKED",
    "2": "UNLOCKING",
    "3": "UNLOCKED",
    "4": "LOCKING",
    "5": "UNLATCHED",
    "6": "UNLOCKED_LOCK_N_GO",
    "7": "UNLATCHING",
    "254": "MOTOR_BLOCKED",
    "255": "UNDEFINED"
   */
  const [lockState] = useDeviceState(
    device,
    'lock-state',
    0 as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 254 | 255,
    visible ? 'medium' : 'background'
  )

  const texts = useMemo<DataText[]>(
    () => [
      {
        id: 'lock-state',
        text:
          {
            0: 'Uncalibrated',
            1: 'Locked',
            2: 'Unlocking...',
            3: 'Unlocked',
            4: 'Locking...',
            5: 'Unlatched',
            6: "Lock'n Go",
            7: 'Unlatching...',
            254: 'Motor blocked',
            255: 'Unknown',
          }[lockState] || 'Unknown',
      },
    ],
    [lockState]
  )

  const toggleValue = useMemo(
    () => [2, 3, 4, 5, 7, 254, 255].includes(lockState),
    [lockState]
  )

  return {
    texts,
    toggleValue,
    onToggleChange: () => {
      setAction(3)
    },
  }
}

export default useData
