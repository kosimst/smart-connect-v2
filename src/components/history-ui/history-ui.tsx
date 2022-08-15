import { FC, useState } from 'react'
import historyConfigs from '../../constants/history-configs'
import useHistories from '../../hooks/use-histories'
import Device from '../../types/device'
import HistoryConfig from '../../types/history-config'

export type HistoryProps = {
  device: Device
}

const HistoryUi: FC<HistoryProps> = ({ device }) => {
  const [from, setFrom] = useState<number>(Date.now() - 1000 * 60 * 60)
  const [to, setTo] = useState<number>(Date.now())

  // @ts-ignore
  const historyConfig = historyConfigs[device.type] as HistoryConfig

  const histories = useHistories(device, Object.keys(historyConfig), from, to)

  console.log(histories)

  return null
}

export default HistoryUi
