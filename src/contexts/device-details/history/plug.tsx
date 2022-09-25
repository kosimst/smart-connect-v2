import { FC } from 'react'
import HistoryDetails from '../../../components/history-details/history-details'
import Device from '../../../types/device'

const History: FC<{ device: Device }> = ({ device }) => {
  return <HistoryDetails device={device} states={['power']} />
}

export default History
