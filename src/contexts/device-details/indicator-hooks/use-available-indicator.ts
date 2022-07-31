import { useMemo } from 'react'
import { AvailableIcon } from '../../../components/icon/available-icons'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'

const useAvailableIndicator = (device: Device) => {
  const [available, , exists] = useDeviceState(device, 'available', 100)

  const icon = useMemo<AvailableIcon>(() => {
    return available ? 'sensors' : 'sensors_off'
  }, [available, exists])

  return exists && icon
}

export default useAvailableIndicator
