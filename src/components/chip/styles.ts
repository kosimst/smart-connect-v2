import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Chip as ChipBase } from '@mui/material'

export const Container = styled(motion.div)`
  display: inline-block;
`

export const Chip = styled(ChipBase)`
  position: relative;
  overflow: hidden;

  ${({ theme, variant }) =>
    theme.palette.mode === 'dark' &&
    `
      background-color: ${theme.palette.background.paper};
      opacity: ${variant === 'outlined' ? 0.5 : 1};
      border: none;
    `}

  @media (min-width: 600px) {
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-color: black;
      opacity: 0;
    }

    &:focus::after {
      opacity: 0.1;
    }
  }
`
