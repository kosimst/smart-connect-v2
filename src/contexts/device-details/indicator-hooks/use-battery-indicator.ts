import { useMemo } from 'react'
import { AvailableIcon } from '../../../components/icon/available-icons'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'

const useBatteryIndicator = (device: Device) => {
  const [battery, , exists] = useDeviceState(device, 'battery', 100)

  const icon = useMemo<AvailableIcon>(() => {
    if (!exists) {
      return 'battery_unknown'
    }

    if (battery <= 0) {
      return 'battery_0_bar'
    }

    if (battery <= 15) {
      return 'battery_alert'
    }

    if (battery <= 25) {
      return 'battery_2_bar'
    }

    if (battery <= 50) {
      return 'battery_4_bar'
    }

    if (battery <= 75) {
      return 'battery_5_bar'
    }

    if (battery <= 90) {
      return 'battery_6_bar'
    }

    if (battery <= 100) {
      return 'battery_full'
    }

    return 'battery_unknown'
  }, [battery, exists])

  return exists && icon
}

export default useBatteryIndicator
