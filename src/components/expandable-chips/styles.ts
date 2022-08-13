import styled from '@emotion/styled'
import { Chip } from '@mui/material'
import { motion } from 'framer-motion'

export const Chips = styled(motion.section)`
  display: flex;
  gap: 6px;
  row-gap: 10px;
  flex-wrap: wrap;
  overflow: hidden;
`

export const Container = styled(motion.div)`
  margin-top: 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
`

export const CollapsedText = styled(Chip)`
  position: relative;

  & .MuiChip-icon {
    position: absolute;
    right: 16px;
  }

  & .MuiChip-label {
    display: inline-grid;
    width: 75%;
    justify-items: center;

    & > * {
      grid-area: 1 / 1;
    }
  }
`
