import { IconButton } from '@mui/material'
import { AnimatePresence, motion, Transition, Variants } from 'framer-motion'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import forwardBaseProps from '../../helpers/forward-base-props'
import Icon from '../icon'
import { AvailableIcon } from '../icon/available-icons'
import { ChildrenContainer, Container, StatusText } from './styles'

export type ExpandableStatusProps = {
  statusText: string
  icon: AvailableIcon
  children?: ReactNode
}

const containerVariants: Variants = {
  expanded: {
    height: 'auto',
  },
  collapsed: {
    height: 32,
  },
}

const transition: Transition = {
  duration: 0.2,
}

const ExpandableStatus = forwardBaseProps<ExpandableStatusProps>(
  ({ statusText, children, icon }, baseProps) => {
    const [expanded, setExpanded] = useState(false)
    const toggle = useCallback(
      () => setExpanded((prev) => !prev),
      [setExpanded]
    )

    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      if (!containerRef.current) return

      if (!expanded) {
        containerRef.current.setAttribute('inert', '')
      } else {
        containerRef.current.removeAttribute('inert')
      }
    }, [expanded])

    return (
      <Container
        {...baseProps}
        animate={expanded ? 'expanded' : 'collapsed'}
        variants={containerVariants}
        transition={transition}
        initial="collapsed"
      >
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
          {
            // @ts-ignore
            children?.length > 0 &&
              // @ts-ignore
              children
                // @ts-ignore
                .map((child) => (Array.isArray(child) ? child.length : true))
                .some(Boolean) && (
                <IconButton size="small" onClick={toggle}>
                  <Icon icon={expanded ? 'expand_less' : 'expand_more'} />
                </IconButton>
              )
          }
        </StatusText>

        <ChildrenContainer ref={containerRef}>{children}</ChildrenContainer>
      </Container>
    )
  }
)

export default ExpandableStatus
