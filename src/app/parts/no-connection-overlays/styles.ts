import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import Icon from '../../../components/icon'
import withProps from '../../../helpers/with-props'

export const FullBleedCentered = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`

export const BigIcon = styled(Icon)`
  font-size: 64px;
  opacity: 0.75;
`

export const Text = styled(
  withProps(Typography, {
    variant: 'h5',
  })
)`
  opacity: 0.75;
`

export const BottomRow = styled.div``
