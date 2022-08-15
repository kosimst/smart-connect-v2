import { StyledComponent } from '@emotion/styled'
import { Chip, Typography } from '@mui/material'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import forwardBaseProps from '../../helpers/forward-base-props'
import Icon from '../icon'
import { Chips, Container } from './styles'

export type ExpandableChipsProps = {
  children: ReactNode[]
  expanded?: boolean
  marginTop?: number
  marginBottom?: number
}

const ExpandableChips = forwardBaseProps<ExpandableChipsProps, HTMLDivElement>(
  (
    { children, expanded = false, marginBottom = 0, marginTop = 0 },
    baseProps
  ) => {
    const chipsVariants = useMemo<Variants>(
      () => ({
        expanded: {
          opacity: 1,
          maxHeight: 1000,
          marginTop,
          marginBottom,
        },
        collapsed: {
          opacity: 0,
          maxHeight: 0,
          marginTop: 0,
          marginBottom: 0,
        },
      }),
      []
    )

    return (
      <Container
        initial="collapsed"
        animate={expanded ? 'expanded' : 'collapsed'}
        {...baseProps}
      >
        <Chips variants={chipsVariants}>{children}</Chips>
      </Container>
    )
  }
)

export default ExpandableChips
