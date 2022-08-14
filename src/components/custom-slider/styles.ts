import styled from '@emotion/styled'
import { Slider } from '@mui/material'
import temperatureToRgb from '../../helpers/temperature-to-rgb'

export const Texts = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Container = styled.div``

const ctGradientStops = Array(10)
  .fill(0)
  .map((_, i, { length }) => {
    const progress = i / length
    const val = 2198 + (6494 - 2198) * progress

    return temperatureToRgb(val)
  })
  .join(', ')

export const StyledSlider = styled(Slider)<{
  variant: 'hue' | 'color-temperature' | 'normal'
}>`
  padding: 16px 0 !important;

  & .MuiSlider-thumb {
    width: 16px;
    height: 16px;

    &:focus,
    &:hover,
    &.Mui-active,
    &.Mui-focusVisible {
      box-shadow: none;
    }
  }

  & .MuiSlider-rail,
  & .MuiSlider-track {
    height: 16px;
  }

  & .MuiSlider-track {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  ${({ variant }) =>
    variant === 'hue' &&
    `& .MuiSlider-rail {
    background-image: linear-gradient(
      to right,
      #f00,
      #ff0,
      #0f0,
      #0ff,
      #00f,
      #f0f,
      #f00
    );
    opacity: 1;
  }`}

  ${({ variant }) =>
    variant === 'color-temperature' &&
    `& .MuiSlider-rail {
    background-image: linear-gradient(
      to right,
      ${ctGradientStops}
      );
    opacity: 1;
  }`}

  ${({ variant }) =>
    variant !== 'normal' &&
    `& .MuiSlider-track, & .MuiSlider-thumb {
    background-color: transparent;
    border: none;
  }

  & .MuiSlider-thumb {
    background-color: white;
    box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, 0.25) !important;
  }
  `}
`
