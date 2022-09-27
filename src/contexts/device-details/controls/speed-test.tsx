import { IconButton } from '@mui/material'
import { FC, useCallback } from 'react'
import CustomActions from '../../../components/custom-actions'
import CustomInfos from '../../../components/custom-infos'
import Icon from '../../../components/icon'
import readableDate from '../../../helpers/readable-date'
import readableFloat from '../../../helpers/readable-float'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'
import { SliderFlex } from './styles'

const Controls: FC<{
  device: Device
}> = ({ device }) => {
  const [downloadMegabits] = useDeviceState(device, 'download-megabits', 0)
  const [uploadMegabits] = useDeviceState(device, 'upload-megabits', 0)
  const [ping] = useDeviceState(device, 'ping', 0)
  const [running] = useDeviceState(device, 'running', false)
  const [, setRunBtn] = useDeviceState(device, 'run', false)

  const [lastUpdate] = useDeviceState(device, 'last-update', '')

  const run = useCallback(() => {
    if (running) {
      return
    }

    setRunBtn(true)
  }, [running, setRunBtn])

  return (
    <SliderFlex>
      <CustomInfos label="Last results">
        {readableFloat(downloadMegabits, 1)} Mbit/s •{' '}
        {readableFloat(uploadMegabits, 1)} Mbit/s • {readableFloat(ping, 1)} ms
      </CustomInfos>

      <CustomInfos label="Last updated">
        {running
          ? 'Running...'
          : lastUpdate && readableDate(new Date(lastUpdate))}
      </CustomInfos>

      <CustomActions label="Actions">
        <IconButton onClick={run} disabled={running}>
          <Icon icon="play_circle" />
        </IconButton>
      </CustomActions>
    </SliderFlex>
  )
}

export default Controls
