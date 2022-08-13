import { Chip, Typography } from '@mui/material'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import Icon from '../icon'
import { Chips, CollapsedText, Container } from './styles'

export type ExpandableChipsProps = {
  children: ReactNode[]
  collapsedText: string
}

const ExpandableChips: FC<ExpandableChipsProps> = ({
  children,
  collapsedText,
}) => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    // @ts-ignore
    window.toggle = () => setExpanded((expanded) => !expanded)
  }, [setExpanded])

  const chipsVariants = useMemo<Variants>(
    () => ({
      expanded: {
        opacity: 1,
        maxHeight: 1000,
        marginBottom: 10,
      },
      collapsed: {
        opacity: 0,
        maxHeight: 0,
        marginBottom: 0,
      },
    }),
    []
  )

  const chevronVariants = useMemo<Variants>(
    () => ({
      expanded: {
        rotate: 180,
      },
      collapsed: {
        rotate: 0,
      },
    }),
    []
  )

  return (
    <Container
      initial="collapsed"
      animate={expanded ? 'expanded' : 'collapsed'}
    >
      <Chips variants={chipsVariants}>{children}</Chips>
      <CollapsedText
        onClick={() => setExpanded((expanded) => !expanded)}
        label={
          <AnimatePresence>
            <motion.span
              key={expanded ? 'expanded' : 'collapsed'}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              {expanded ? 'Collapse device type filter' : collapsedText}
            </motion.span>
          </AnimatePresence>
        }
        icon={<Icon icon="expand_more" variants={chevronVariants} />}
      />
    </Container>
  )
}

export default ExpandableChips
