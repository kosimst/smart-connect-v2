import styled from '@emotion/styled'
import { motion } from 'framer-motion'

export const Container = styled(motion.div)`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 32px auto;
`

export const StatusText = styled.span`
  box-sizing: border-box;
  padding: 0 8px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: space-between;

  & > * {
    color: rgba(0, 0, 0, 0.54);

    &:first-of-type {
      justify-self: start;
    }

    &:nth-of-type(2) {
      display: grid;
      width: 100%;
      text-align: center;

      & > * {
        grid-area: 1 / 1;
      }
    }
  }
`

export const ChildrenContainer = styled.div`
  padding: 16px;
  opacity: 0.5;

  display: flex;
  flex-direction: column;
  gap: 4px;

  & > div > span {
    line-height: 24px;
    display: inline-block;
    height: 24px;
    margin-left: 6px;
    font-size: 14px;
  }
`
