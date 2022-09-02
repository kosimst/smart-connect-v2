import { FC, MouseEventHandler, Suspense, useCallback } from 'react'
import useDeviceDetails from '../../contexts/device-details'
import useDeviceDefinition from '../../hooks/use-device-definition'
import useDeviceState from '../../hooks/use-device-state'
import Device from '../../types/device'
import PureDeviceCard from './device-card.pure'
import useDataHook from './use-data-hook'

export type DeviceCardProps = {
  device: Device
  visible: boolean
}

const SuspendedDeviceCard: FC<DeviceCardProps> = ({ device, visible }) => {
  const useData = useDataHook(device)

  const { open } = useDeviceDetails()

  const data = useData(device, visible)
  const definition = useDeviceDefinition(device)

  const onContextMenu = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      open(device)
    },
    [open, device]
  )

  const [battery, , batteryExists] = useDeviceState(
    device,
    'battery',
    100,
    'low'
  )
  const [available, , availableExists] = useDeviceState(
    device,
    'available',
    true,
    'low'
  )

  return (
    <PureDeviceCard
      {...data}
      {...definition}
      name={device.name || definition.name}
      onContextMenu={onContextMenu}
      lowBattery={batteryExists && battery <= 15}
      notAvailable={availableExists && !available}
      visible={visible}
    />
  )
}

const DeviceCard: FC<DeviceCardProps> = ({ device, visible }) => {
  return (
    <Suspense fallback={null}>
      <SuspendedDeviceCard device={device} visible={visible} />
    </Suspense>
  )
}

export default DeviceCard
