import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import { motion } from 'framer-motion'

export const PageTitle = styled.h1`
  opacity: 0.9;
  margin-bottom: 16px;
`

export const RoomTitle = styled(Typography)`
  margin-bottom: 16px;
  opacity: 0.9;
`

export const Room = styled(motion.section)`
  margin-top: 40px;
`

export const Chips = styled.section`
  margin-top: 16px;
  display: flex;
  gap: 6px;
  row-gap: 10px;
  flex-wrap: wrap;
`

export const LinksGrid = styled(motion.div)`
  margin-top: 40px;
  margin-bottom: 4px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  justify-items: center;
  font-weight: 500;
  position: absolute;
  bottom: 16px;
  width: calc(100vw - 32px);
`

export const Link = styled.span`
  font-size: 16px;
  opacity: 0.75;
  display: inline-flex;
  flex-direction: row;
  gap: 4px;

  &:hover {
    opacity: 1;
  }

  & > * {
    font-size: inherit;
  }

  & > *:first-child {
    position: relative;
    top: 1px;
  }
`
