import { Chip, IconButton } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import forwardBaseProps from '../../helpers/forward-base-props'
import Icon from '../icon'
import { AvailableIcon } from '../icon/available-icons'
import { Container, StatusText } from './styles'

export type ExpandableStatusProps = {
  statusText: string
  icon: AvailableIcon
  children?: ReactNode
}

const ExpandableStatus = forwardBaseProps<ExpandableStatusProps>(
  ({ statusText, children, icon }, baseProps) => {
    return (
      <Container {...baseProps}>
        <StatusText>
          <Icon icon={icon} />
          <span>
            <AnimatePresence>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={statusText}
              >
                {statusText}
              </motion.span>
            </AnimatePresence>
          </span>
          <IconButton size="small">
            <Icon icon="expand_more" />
          </IconButton>
        </StatusText>
      </Container>
    )
  }
)

export default ExpandableStatus
