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

export const Hr = styled.hr`
  margin: 24px 0;
  margin-bottom: 16px;
  width: 80%;
  position: relative;
  left: 10%;
  border-bottom: 1px solid black;
  opacity: 0.5;
`

export const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 1fr);
  gap: 16px;
  align-items: center;
  justify-items: center;
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
