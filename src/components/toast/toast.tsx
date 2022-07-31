import { FC } from 'react'
import { Container } from './styles'

export type ToastProps = {
  type: 'error' | 'warning' | 'success'
  visible: boolean
  children: string
}

const Toast: FC<ToastProps> = ({ type, visible, children }) => {
  return <Container>{children}</Container>
}

export default Toast
