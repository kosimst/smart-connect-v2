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
    "1": "ACTIVE RTO",
    "2": "DEACTIVATE RTO",
    "3": "ELECTRIC STRIKE ACTUATION",
    "4": "ACTIVATE CM",
    "5": "DEACTIVATE CM"
   */
  const [, setAction] = useDeviceState(
    device,
    'action',
    0 as 0 | 1 | 2 | 3 | 4 | 5
  )

  /**
     "0": "UNINITIALIZED",
      "1": "PAIRING",
      "2": "NORMAL",
      "3": "CONTINUOUS",
      "4": "MAINTENANCE"
     */
  const [mode] = useDeviceState(device, 'mode', 0 as 0 | 1 | 2 | 3 | 4)

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
    0 as 0 | 1 | 3 | 5 | 7 | 253 | 255
  )

  const activateRTO = useCallback(() => {
    setAction(1)
  }, [setAction])

  const deactivateRTO = useCallback(() => {
    setAction(2)
  }, [setAction])

  const activateCM = useCallback(() => {
    setAction(4)
  }, [setAction])

  const deactivateCM = useCallback(() => {
    setAction(5)
  }, [setAction])

  const open = useCallback(() => {
    setAction(3)
  }, [setAction])

  return (
    <SliderFlex>
      <CustomInfos label="Opener state">
        {mode === 3
          ? 'Continuous mode'
          : lockState === 0
          ? 'Untrained'
          : lockState === 1
          ? 'Online'
          : lockState === 3
          ? 'Ring to open'
          : lockState === 5
          ? 'Open'
          : lockState === 7
          ? 'Opening...'
          : lockState === 253
          ? 'Boot run'
          : lockState === 255
          ? 'Unknown'
          : 'Unknown'}
      </CustomInfos>

      <CustomActions label="Actions">
        <IconButton onClick={lockState === 3 ? deactivateRTO : activateRTO}>
          <Icon
            icon={lockState === 3 ? 'notifications_off' : 'notifications'}
          />
        </IconButton>
        <IconButton onClick={mode === 3 ? deactivateCM : activateCM}>
          <Icon icon={mode === 3 ? 'lock_open' : 'lock'} />
        </IconButton>
        <IconButton onClick={open}>
          <Icon icon="door_open" />
        </IconButton>
      </CustomActions>
    </SliderFlex>
  )
}

export default Controls
