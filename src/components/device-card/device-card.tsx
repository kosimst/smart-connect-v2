import { FC, Suspense, useCallback } from 'react'
import useDeviceDetails from '../../contexts/device-details'
import useDeviceDefinition from '../../hooks/use-device-definition'
import useDeviceState from '../../hooks/use-device-state'
import Device from '../../types/device'
import PureDeviceCard from './device-card.pure'
import useDataHook from './use-data-hook'

export type DeviceCardProps = {
  device: Device
}

const SuspendedDeviceCard: FC<DeviceCardProps> = ({ device }) => {
  const useData = useDataHook(device)

  const { open } = useDeviceDetails()

  const data = useData(device)
  const definition = useDeviceDefinition(device)

  const onContextMenu = useCallback(() => {
    open(device)
  }, [open])

  const [battery, , batteryExists] = useDeviceState(device, 'battery', 100)
  const [available, , availableExists] = useDeviceState(
    device,
    'available',
    true
  )

  return (
    <PureDeviceCard
      {...data}
      {...definition}
      name={device.name || definition.name}
      onContextMenu={onContextMenu}
      lowBattery={batteryExists && battery <= 15}
      notAvailable={availableExists && !available}
    />
  )
}

const DeviceCard: FC<DeviceCardProps> = ({ device }) => {
  const definition = useDeviceDefinition(device)

  return (
    <Suspense
      fallback={
        <PureDeviceCard
          {...definition}
          texts={[{ text: 'Loading...', id: 'loading' }]}
          name={device.name || definition.name}
          isLoading={true}
        ></PureDeviceCard>
      }
    >
      <SuspendedDeviceCard device={device} />
    </Suspense>
  )
}

export default DeviceCard
