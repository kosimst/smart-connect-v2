import styled from '@emotion/styled'
import { Slider, Typography } from '@mui/material'

export const Texts = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  & > * {
    font-size: 14px;

    &:last-child {
      font-weight: 500;
    }
  }
`

export const Container = styled.div``

export const StyledSlider = styled(Slider)<{
  variant: 'hue' | 'color-temperature' | 'normal'
}>`
  padding: 14px 0 !important;

  & .MuiSlider-thumb {
    width: 16px;
    height: 16px;

    &:active,
    &:focus {
      box-shadow: 0px 0px 0px 8px rgb(96, 125, 139, 16%);
    }
  }
`

export const AliasTypography = styled(Typography)`
  font-variant-numeric: tabular-nums;
`
