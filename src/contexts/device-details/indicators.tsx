import styled from '@emotion/styled'
import { FC } from 'react'
import Icon from '../../components/icon'
import Device from '../../types/device'
import useAvailableIndicator from './indicator-hooks/use-available-indicator'
import useBatteryIndicator from './indicator-hooks/use-battery-indicator'

const Container = styled.span`
  display: inline-block;
  height: 30px;
  line-height: 30px;
  position: relative;
  top: 2px;
  margin-left: 6px;

  & > span {
    font-size: 18px;
  }
`

const Indicators: FC<{ device: Device }> = ({ device }) => {
  const battery = useBatteryIndicator(device)
  const available = useAvailableIndicator(device)

  return (
    <Container>
      {battery && <Icon icon={battery} />}
      {available && <Icon icon={available} />}
    </Container>
  )
}

export default Indicators
