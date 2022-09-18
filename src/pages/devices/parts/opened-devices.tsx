import { Chip } from '@mui/material'
import { FC, useMemo } from 'react'
import Icon from '../../../components/icon'
import deviceDefinitions from '../../../constants/device-definitions'
import useDeviceDetails from '../../../contexts/device-details'
import useOpenedDevices from '../../../hooks/use-opened-devices'
import { StyledExpandableStatus } from '../styles'

const OpenedDevices: FC = () => {
  const openedDevices = useOpenedDevices()

  const { open } = useDeviceDetails()

  const securityText = useMemo(() => {
    const openedCount = openedDevices.length

    if (openedCount === 0) {
      return 'No security issues'
    }

    return `${openedCount} security issue${openedCount > 1 ? 's' : ''}`
  }, [openedDevices.length])

  return (
    <StyledExpandableStatus statusText={securityText} icon="security">
      {openedDevices.map(({ device, openedState }) => (
        <div key={device.id}>
          <Chip
            label={device.name || deviceDefinitions[device.type].fullName}
            size="small"
            icon={<Icon icon={deviceDefinitions[device.type].icon} />}
            onClick={() => open(device)}
          />
          <span>
            in <b>{device.roomName}</b> is{' '}
            {openedState === 1 ? 'tilted' : 'opened'}
          </span>
        </div>
      ))}
    </StyledExpandableStatus>
  )
}

export default OpenedDevices
