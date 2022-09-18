import styled from '@emotion/styled'
import { IconButton, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import DeviceGrid from '../../components/device-grid'
import ExpandableChips from '../../components/expandable-chips'
import ExpandableStatus from '../../components/expandable-status'

export const RoomTitle = styled(Typography)`
  padding: 16px;
  padding-top: 18px;
  position: sticky;
  top: -2px;
  background-color: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.secondary};
  z-index: 4;
  width: 100vw;
  transform: translateX(-16px);
  margin-bottom: 0;
`

export const Room = styled(motion.section)`
  position: relative;
  margin-top: 30px;

  &::after {
    content: '';
    background-color: ${({ theme }) => theme.palette.background.default};
    position: absolute;
    top: 54px;
    height: 4px;
    width: 100vw;
    transform: translateX(-16px) translateY(0px);
    z-index: 3;
  }

  & > .shadow {
    position: sticky;
    top: 54px;
    width: 100vw;
    z-index: 0;
    transform: translateX(-16px);
    height: 2px;
    background-image: linear-gradient(
      to bottom,
      ${({ theme }) =>
        theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,0.2)'
          : 'rgba(0, 0, 0, 0.2)'},
      transparent
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
  color: ${({ theme }) => theme.palette.text.primary};
`

export const StatusContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 16px;
  max-width: 500px;
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

export const StyledDeviceGrid = styled(DeviceGrid)`
  margin-top: 8px;
`
