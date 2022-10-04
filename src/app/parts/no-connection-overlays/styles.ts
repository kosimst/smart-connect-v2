import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import { motion } from 'framer-motion'
import Icon from '../../../components/icon'
import withProps from '../../../helpers/with-props'

export const FullBleedCentered = withProps(
  styled(motion.div)`
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    background-color: ${({ theme }) => theme.palette.background.default};
    z-index: 9999;
  `,
  {
    initial: {
      opacity: 0,
    },
    exit: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    transition: {
      duration: 0.2,
    },
  }
)

export const BigIcon = styled(Icon)`
  font-size: 64px;
  opacity: 0.75;
`

export const Text = styled(
  withProps(Typography, {
    variant: 'h5',
  })
)`
  opacity: 0.75;
  color: ${({ theme }) =>
    theme.palette.mode === 'dark'
      ? theme.palette.common.white
      : theme.palette.common.black};
`

export const BottomRow = styled.div``
