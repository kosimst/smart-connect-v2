import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'

export const Spinner = styled(CircularProgress)`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`

export const ChartWrapper = styled.div`
  width: 100%;
  position: relative;
`

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: white;
  opacity: 0.75;
  z-index: 2;
`

export const Container = styled.div`
  background-color: white;

  @media all and (display-mode: fullscreen) {
    padding: 16px;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`
