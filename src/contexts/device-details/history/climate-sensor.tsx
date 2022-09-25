import { FC } from 'react'
import HistoryDetails from '../../../components/history-details'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'

const History: FC<{ device: Device }> = ({ device }) => {
  const [, , co2Exists] = useDeviceState(device, 'co2', 0)

  return (
    <HistoryDetails
      device={device}
      states={
        ['temperature', 'humidity', co2Exists && 'co2'].filter(
          Boolean
        ) as string[]
      }
    />
  )
}

export default History
