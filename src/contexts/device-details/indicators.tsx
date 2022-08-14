import styled from '@emotion/styled'
import { Chip } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { FC } from 'react'
import Icon from '../../components/icon'
import withProps from '../../helpers/with-props'
import useDeviceState from '../../hooks/use-device-state'
import Device from '../../types/device'
import useAvailableIndicator from './indicator-hooks/use-available-indicator'
import useBatteryIndicator from './indicator-hooks/use-battery-indicator'

const Container = styled.span`
  display: inline-flex;
  gap: 8px;
  height: 27px;
  align-items: center;
`

const StyledChip = withProps(
  styled(motion(Chip))`
    font-size: 12px;
  `,
  {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
    size: 'small',
    transition: {
      duration: 0.2,
    },
  }
)

const Indicators: FC<{ device: Device }> = ({ device }) => {
  const battery = useBatteryIndicator(device)
  const available = useAvailableIndicator(device)

  const [batteryLevel, , batteryExists] = useDeviceState(device, 'battery', 100)
  const [availableState, , availableExists] = useDeviceState(
    device,
    'available',
    true
  )

  return (
    <Container>
      <AnimatePresence>
        {battery && batteryExists && (
          <StyledChip
            label={`${batteryLevel}%`}
            icon={<Icon icon={battery} />}
          />
        )}

        {available && availableExists && (
          <StyledChip
            label={availableState ? 'Available' : 'Unavailable'}
            icon={<Icon icon={available} />}
          />
        )}
      </AnimatePresence>
    </Container>
  )
}

export default Indicators
