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
  border-radius: 16px;
  display: flex;
  flex-direction: column;
`
