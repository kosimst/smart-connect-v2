import styled from '@emotion/styled'
import { motion } from 'framer-motion'

export const PageTitle = styled.h1`
  opacity: 0.9;
  margin-bottom: 16px;
`

export const RoomTitle = styled.h2`
  margin-bottom: 16px;
  opacity: 0.9;
`

export const Room = styled(motion.section)`
  margin-top: 24px;

  & + & {
    margin-top: 32px;
  }
`

export const Chips = styled.section`
  margin-top: 16px;
  display: flex;
  gap: 6px;
  row-gap: 10px;
  flex-wrap: wrap;
`
