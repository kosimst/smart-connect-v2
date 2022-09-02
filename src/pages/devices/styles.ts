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
  padding: 16px;
  position: sticky;
  top: 0;
  background-color: white;
  color: rgba(0, 0, 0, 0.9);
  z-index: 4;
  width: 100vw;
  transform: translateX(-16px);
`

export const Room = styled(motion.section)`
  position: relative;
  &::after {
    content: '';
    background-color: white;
    position: absolute;
    top: 54px;
    height: 4px;
    width: 100vw;
    transform: translateX(-16px);
    z-index: 3;
  }

  &::before {
    content: '';
    display: block;
    position: sticky;
    top: 0;
    width: 100vw;
    z-index: 2;
    transform: translateX(-16px) translateY(16px);
    height: 40px;
    background-image: linear-gradient(
      to bottom,
      white 95%,
      rgba(0, 0, 0, 0.2) 95%,
      transparent 100%
    );
  }
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
  bottom: 48px;
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

  & > *::first-of-type {
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

export const Version = styled(Typography)`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  text-align: right;
  opacity: 0.5;
`
