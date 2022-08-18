import { Typography } from '@mui/material'
import { FC, ReactNode } from 'react'
import { Container, Texts } from '../custom-slider/styles'
import { TextContainer } from './styles'

export type CustomActionsProps = {
  children?: ReactNode
  label?: string
  text?: string
}

const CustomInfos: FC<CustomActionsProps> = ({
  children,
  label = 'Infos',
  text = '',
}) => {
  return (
    <Container>
      <Texts>
        <Typography variant="subtitle1">{label}</Typography>
        <Typography variant="subtitle1"></Typography>
      </Texts>

      <TextContainer>{children}</TextContainer>
    </Container>
  )
}

export default CustomInfos
