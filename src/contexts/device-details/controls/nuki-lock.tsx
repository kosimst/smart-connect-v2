import { IconButton } from '@mui/material'
import { FC, useCallback } from 'react'
import CustomActions from '../../../components/custom-actions'
import CustomInfos from '../../../components/custom-infos'
import Icon from '../../../components/icon'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'
import { SliderFlex } from './styles'

const Controls: FC<{
  device: Device
}> = ({ device }) => {
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
    0 as 0 | 1 | 2 | 3 | 4 | 5
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
    0 as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 254 | 255
  )

  const lock = useCallback(() => {
    setAction(2)
  }, [setAction])

  const unlock = useCallback(() => {
    setAction(1)
  }, [setAction])

  const open = useCallback(() => {
    setAction(3)
  }, [setAction])

  return (
    <SliderFlex>
      <CustomInfos label="Lock state">
        {lockState === 0 && 'Uncalibrated'}
        {lockState === 1 && 'Locked'}
        {lockState === 2 && 'Unlocking...'}
        {lockState === 3 && 'Unlocked'}
        {lockState === 4 && 'Locking...'}
        {lockState === 5 && 'Unlatched'}
        {lockState === 6 && "Unlocked - lock'n go"}
        {lockState === 7 && 'Unlatching...'}
        {lockState === 254 && 'Motor blocked'}
        {lockState === 255 && 'Unknown'}
      </CustomInfos>

      <CustomActions label="Actions">
        <IconButton onClick={lock}>
          <Icon icon="lock" />
        </IconButton>
        <IconButton onClick={unlock}>
          <Icon icon="lock_open" />
        </IconButton>
        <IconButton onClick={open}>
          <Icon icon="door_open" />
        </IconButton>
      </CustomActions>
    </SliderFlex>
  )
}

export default Controls
