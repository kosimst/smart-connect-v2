import styled from '@emotion/styled'
import { FC } from 'react'
import useWindowSensor from '../../../hooks/use-window-sensor'
import Device from '../../../types/device'
import Indicators from '../indicators'

const Container = styled.div`
  margin-top: 16px;
`

const Row = styled.div`
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const WindowSensors: FC<{
  device: Device
}> = ({ device }) => {
  const { device: windowOpenedSensor } = useWindowSensor(device, 'opened')
  const { device: windowTiltedSensor } = useWindowSensor(device, 'tilted')

  return (
    <Container>
      {windowOpenedSensor && (
        <Row>
          <span>Window opened sensor</span>
          <Indicators device={windowOpenedSensor} />
        </Row>
      )}
      {windowTiltedSensor && (
        <Row>
          <span>Window tilted sensor</span>
          <Indicators device={windowTiltedSensor} />
        </Row>
      )}
    </Container>
  )
}

export default WindowSensors
