import { FC, useMemo } from 'react'
import useHistories from '../../../hooks/use-histories'
import Device from '../../../types/device'

const History: FC<{ device: Device }> = ({ device }) => {
  const from = useMemo(() => Date.now() - 60 * 60 * 1000, [])
  const to = useMemo(() => Date.now(), [])

  const histories = useHistories(
    device,
    ['co2', 'humidity', 'temperature'],
    from,
    to
  )

  return null
}

export default History
