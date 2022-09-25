import { FC } from 'react'
import CustomInfos from '../../../components/custom-infos'
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

  const [lastUpdate] = useDeviceState(device, 'last-update', 0)

  return (
    <SliderFlex>
      <CustomInfos label="Last results">
        {readableFloat(downloadMegabits, 1)} Mbit/s •{' '}
        {readableFloat(uploadMegabits, 1)} Mbit/s
      </CustomInfos>

      <CustomInfos label="Last updated">
        {lastUpdate && readableDate(new Date(lastUpdate))}
      </CustomInfos>
    </SliderFlex>
  )
}

export default Controls
