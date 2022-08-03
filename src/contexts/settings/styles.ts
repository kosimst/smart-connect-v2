import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import Icon from '../../components/icon'

export const Container = styled(motion.div)`
  background-color: #fff;
  z-index: 999;
  position: fixed;
  inset: 0;
  padding: 16px;
  padding-top: 64px;
`

export const Icons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0.75;
`

export const PushDetails = styled(motion.div)`
  margin-top: 16px;
`
