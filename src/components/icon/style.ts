import styled from '@emotion/styled'
import { motion } from 'framer-motion'

export const Span = styled(motion.span)<{ filled?: boolean }>`
  font-variation-settings: 'FILL' ${({ filled }) => (filled ? 1 : 0)},
    'wght' 400, 'GRAD' 0, 'opsz' 48;
  display: inline-block;
  color: ${({ theme }) => theme.palette.text.primary};
`
