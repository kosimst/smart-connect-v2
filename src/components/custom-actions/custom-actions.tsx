import { Typography } from '@mui/material'
import { FC, ReactNode } from 'react'
import { Container, Texts } from '../custom-slider/styles'
import { ActionsContainer } from './styles'

export type CustomActionsProps = {
  children?: ReactNode
  label?: string
  status?: string
}

const CustomActions: FC<CustomActionsProps> = ({
  children,
  label = 'Actions',
  status = '',
}) => {
  return (
    <Container>
      <Texts>
        <Typography variant="subtitle1">{label}</Typography>
        <Typography variant="subtitle1">{status}</Typography>
      </Texts>

      <ActionsContainer>{children}</ActionsContainer>
    </Container>
  )
}

export default CustomActions
