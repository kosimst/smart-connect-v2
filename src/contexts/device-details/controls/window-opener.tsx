import { IconButton } from '@mui/material'
import { FC, useCallback } from 'react'
import CustomActions from '../../../components/custom-actions'
import CustomSlider from '../../../components/custom-slider'
import Icon from '../../../components/icon'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'
import { SliderFlex } from './styles'

const Controls: FC<{
  device: Device
}> = ({ device }) => {
  const [openedLevel, setOpenedLevel] = useDeviceState(
    device,
    'opened-level',
    0,
    'high'
  )
  const [direction] = useDeviceState(device, 'direction', 0, 'high')
  const [, setStop] = useDeviceState(device, 'stop', true)

  const stop = useCallback(() => setStop(true), [setStop])
  const open = useCallback(() => setOpenedLevel(100), [setOpenedLevel])
  const close = useCallback(() => setOpenedLevel(0), [setOpenedLevel])
  const lock = useCallback(() => setOpenedLevel(-0.5), [setOpenedLevel])

  return (
    <>
      <SliderFlex>
        <CustomActions
          status={
            direction === 0
              ? 'Idle'
              : direction === 1
              ? 'Opening...'
              : 'Closing...'
          }
        >
          <IconButton onClick={open}>
            <Icon icon="arrow_upward" />
          </IconButton>

          <IconButton onClick={stop}>
            <Icon icon="stop" />
          </IconButton>
          <IconButton onClick={close}>
            <Icon icon="arrow_downward" />
          </IconButton>

          <IconButton onClick={lock}>
            <Icon icon="lock" />
          </IconButton>
        </CustomActions>

        <CustomSlider
          label="Opened level"
          value={openedLevel}
          onChange={setOpenedLevel}
          aliases={{
            '-0.5': 'Locked',
          }}
        />
      </SliderFlex>
    </>
  )
}

export default Controls
