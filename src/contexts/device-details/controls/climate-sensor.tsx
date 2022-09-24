import { FC, useMemo } from 'react'
import CustomInfos from '../../../components/custom-infos'
import readableDate from '../../../helpers/readable-date'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'
import { SliderFlex } from './styles'

const Controls: FC<{
  device: Device
}> = ({ device }) => {
  const [temperature] = useDeviceState(device, 'temperature', 0)
  const [humidity] = useDeviceState(device, 'humidity', 0)
  const [co2, , co2Exists] = useDeviceState(device, 'co2', 0)

  const [lastUpdate, , lastUpdateExists] = useDeviceState(
    device,
    'last-update',
    0
  )
  const lastUpdateFormatted = useMemo(
    () => lastUpdateExists && lastUpdate && readableDate(new Date(lastUpdate)),
    [lastUpdate, lastUpdateExists]
  )

  return (
    <>
      <SliderFlex>
        <CustomInfos label="Climate">
          {temperature}°C • {humidity}%{co2Exists && <> • {co2}ppm</>}
        </CustomInfos>

        {lastUpdateFormatted && (
          <CustomInfos label="Last updated">{lastUpdateFormatted}</CustomInfos>
        )}
      </SliderFlex>
    </>
  )
}

export default Controls
