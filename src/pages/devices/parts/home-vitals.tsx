import { Chip } from '@mui/material'
import { FC, useMemo } from 'react'
import Icon from '../../../components/icon'
import deviceDefinitions from '../../../constants/device-definitions'
import useDeviceDetails from '../../../contexts/device-details'
import useLowBatteryDevices from '../../../hooks/use-low-battery-devices'
import useUnavailableDevices from '../../../hooks/use-unavailable-devices'
import { StyledExpandableStatus } from '../styles'
import { InText } from './styles'

const HomeVitals: FC = () => {
  const devicesWithLowBattery = useLowBatteryDevices()
  const unavailableDevices = useUnavailableDevices()

  const devicesHealthText = useMemo(() => {
    const lowBatCount = devicesWithLowBattery.length
    const unavailableCount = unavailableDevices.length

    if (lowBatCount === 0 && unavailableCount === 0) {
      return 'All devices are up and running'
    }

    if (lowBatCount > 0 && unavailableCount === 0) {
      return `${lowBatCount} device${lowBatCount > 1 ? 's' : ''} ${
        lowBatCount > 1 ? 'have' : 'has'
      } low battery`
    }

    if (lowBatCount === 0 && unavailableCount > 0) {
      return `${unavailableCount} device${unavailableCount > 1 ? 's' : ''} ${
        unavailableCount > 1 ? 'are' : 'is'
      } unavailable`
    }

    return `${unavailableCount} device${
      unavailableCount > 1 ? 's' : ''
    } unavailable • ${lowBatCount} low on battery`
  }, [devicesWithLowBattery.length, unavailableDevices.length])

  const { open } = useDeviceDetails()

  return (
    <StyledExpandableStatus statusText={devicesHealthText} icon="monitor_heart">
      {devicesWithLowBattery.map(({ device, battery }) => (
        <div key={device.id}>
          <Chip
            label={device.name || deviceDefinitions[device.type].fullName}
            size="small"
            icon={<Icon icon={deviceDefinitions[device.type].icon} />}
            onClick={() => open(device)}
          />
          <InText>
            in <b>{device.roomName}</b> is low on battery{' '}
            {typeof battery === 'number' && `(${battery}%)`}
          </InText>
        </div>
      ))}
      {unavailableDevices.map((device) => (
        <div key={device.id}>
          <Chip
            label={device.name || deviceDefinitions[device.type].fullName}
            size="small"
            icon={<Icon icon={deviceDefinitions[device.type].icon} />}
            onClick={() => open(device)}
          />
          <InText>
            {' '}
            in <b>{device.roomName}</b> is unavailable
          </InText>
        </div>
      ))}
    </StyledExpandableStatus>
  )
}

export default HomeVitals
