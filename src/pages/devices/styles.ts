import styled from '@emotion/styled'
import { IconButton, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import ExpandableChips from '../../components/expandable-chips'
import ExpandableStatus from '../../components/expandable-status'

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

export const StyledExpandableChips = styled(ExpandableChips)``

export const FilterIconButton = styled(IconButton)``

export const Title = styled(Typography)`
  font-size: 32px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`

export const StatusContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 16px;
`

export const StyledExpandableStatus = styled(ExpandableStatus)``
