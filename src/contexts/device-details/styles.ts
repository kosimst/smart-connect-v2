import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import { motion } from 'framer-motion'

export const Card = styled(motion.div)`
  margin: auto;
  position: relative;
  height: auto;
  min-height: 60vh;
  width: 100vw;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background-color: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.primary};
  padding: 40px 16px;
  overflow-x: hidden;
  box-shadow: ${({ theme }) => theme.shadows[10]};

  max-width: 700px;

  &::after {
    content: '';
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 25%;
    background-color: ${({ theme }) => theme.palette.text.primary};
    height: 3px;
    border-radius: 99px;
    opacity: 0.75;
  }

  @media (min-width: 700px) {
    padding-inline: 24px;
  }
`

export const FixedChildren = styled.div`
  position: fixed;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
`

export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 999;
  background-color: black;
`

export const Subtitle = styled.div`
  opacity: 0.75;
  margin-top: 4px;
`

export const DetailsSeparator = styled.span`
  display: inline-block;
  margin: 0 4px;
`

export const Section = styled.div`
  margin-top: 32px;
`

export const ControlsContainer = styled.div`
  margin-top: 24px;
`

export const TitleRow = styled(Typography)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`

export const NoControlsHint = styled(Typography)`
  position: absolute;
  top: 50%;
  left: 16px;
  right: 16px;
  text-align: center;
  line-height: 1.25;
  opacity: 0.5;
`
