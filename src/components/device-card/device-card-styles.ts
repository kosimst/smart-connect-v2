import styled from '@emotion/styled'
import { Color as MuiColor } from '@mui/material'
import { grey } from '@mui/material/colors'
import Color from 'color'
import { motion } from 'framer-motion'
import { Theme } from '../../constants/theme'
import Icon from '../icon'

type CardProps = {
  accentColor: MuiColor
  active: boolean
}

type CardPropFunction = (props: CardProps & { theme: Theme }) => string

const withAlpha = (color: MuiColor, alpha: number, level: keyof MuiColor) =>
  Color(color[level]).alpha(alpha).toString()

const getTextColor: CardPropFunction = ({ accentColor, active, theme }) =>
  withAlpha(
    active ? accentColor : grey,
    theme.palette.mode === 'light' ? 1 : 0.9,
    theme.palette.mode === 'light' ? 900 : 100
  )

const getSliderColor: CardPropFunction = ({ accentColor, active, theme }) =>
  withAlpha(
    active ? accentColor : grey,
    theme.palette.mode === 'light' ? 0.25 : 0.2,
    theme.palette.mode === 'light' ? 500 : 300
  )

const getBackgroundColor: CardPropFunction = ({ accentColor, active, theme }) =>
  withAlpha(
    active ? accentColor : grey,
    theme.palette.mode === 'light' ? 0.2 : 0.15,
    theme.palette.mode === 'light' ? 500 : 300
  )

const getOutlineColor: CardPropFunction = ({ accentColor, active, theme }) =>
  withAlpha(
    active ? accentColor : grey,
    0.45,
    theme.palette.mode === 'light' ? 500 : 300
  )

export const Card = styled(motion.div)<CardProps>`
  background-color: ${getBackgroundColor};
  color: ${getTextColor};
  border-radius: 16px;
  position: relative;

  display: grid;

  & > * {
    grid-area: 1 / 1;
  }

  &[hidden] {
    display: none;
  }

  @media (min-width: 500px) {
    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border: solid 2px ${getOutlineColor};
      border-radius: 20px;
      pointer-events: none;
      transform: scale(1.1);
      opacity: 0;
      transition: all 0.075s ease-in-out;
    }

    &:focus-within,
    &:active,
    &:focus {
      &::before {
        transform: scale(1);
        opacity: 1;
      }
    }
  }

  & input {
    background-image: linear-gradient(${getSliderColor}, ${getSliderColor});
  }
`

export const ColoredIcon = styled(Icon)`
  color: currentColor;
  font-size: 32px;
`

export const Name = styled.div`
  font-size: 14px;
  color: currentColor;
`

export const State = styled(motion.div)`
  color: currentColor;
  font-size: 12px;
  margin-bottom: 2px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  span:not(:last-child)::after {
    font-weight: 800;
    content: ' • ';
  }
`

export const PresenceContainer = styled.div`
  display: grid;
`

export const TextContainer = styled.div`
  position: relative;
`

export const Slider = styled.input<{
  active: boolean
}>`
  appearance: none;
  width: 100%;
  height: 100%;
  background-color: transparent;
  pointer-events: none;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: left;
  border-radius: inherit;

  transition: background-image 0.2s ease-in-out;

  &::-webkit-slider-thumb {
    appearance: none;
    pointer-events: auto;
    height: 999px;
    width: 16px;
  }

  &:focus {
    outline: none;
  }
`

export const ContentContainer = styled.div`
  pointer-events: none;
  display: flex;
  vertical-align: middle;
  align-items: center;
  padding: 8px;
  font-weight: 500;
  column-gap: 8px;
  box-sizing: border-box;

  position: relative;
`

export const IndicatorIcon = styled(Icon)``

export const Indicators = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;

  & > span {
    font-size: 18px;
    color: currentColor;
  }
`
