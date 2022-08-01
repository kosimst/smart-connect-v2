import styled from '@emotion/styled'
import { Button as MuiButton, TextField } from '@mui/material'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  padding: 32px 16px;
  gap: 16px;

  & > * {
    width: 100%;
  }
`

export const Row = styled.div``

export const Input = styled(TextField)``

export const Button = styled(MuiButton)``

export const Title = styled.h1``

export const Subtitle = styled.h2``
