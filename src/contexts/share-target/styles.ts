import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import { motion } from 'framer-motion'

export const PageContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: white;
  z-index: 1000;
  padding: 16px 16px;
`

export const SectionHeading = styled(Typography)`
  margin-top: 32px;
`

export const SectionSubHeading = styled(Typography)`
  margin-top: 8px;
  margin-bottom: 16px;
`
