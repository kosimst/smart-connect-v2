import styled from '@emotion/styled'
import Color from 'color'
import { motion } from 'framer-motion'
import {
  inactiveBgColor,
  inactiveColor,
  inactiveSliderColor,
} from '../../constants/device-definitions'
import Icon from '../icon'

export const Card = styled(motion.div)<{
  fgColor: string
  bgColor: string
  active: boolean
}>`
  background-color: ${({ bgColor, active }) =>
    active ? new Color(bgColor).lighten(0.1).hex() : inactiveBgColor};
  color: ${(props) => (props.active ? props.fgColor : inactiveColor)};
  border-radius: 16px;
  overflow: hidden;

  display: grid;

  & > * {
    grid-area: 1 / 1;
  }
`

export const ColoredIcon = styled(Icon)`
  color: currentColor;
  font-size: 32px;
`

export const Name = styled.div`
  opacity: 0.7;
  font-size: 14px;
  color: #000000;
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
  bgColor: string
}>`
  appearance: none;
  width: 100%;
  height: 100%;
  background-color: transparent;
  pointer-events: none;
  overflow: hidden;

  background-image: ${({ active, bgColor }) => `linear-gradient(
    ${active ? bgColor : inactiveSliderColor},
    ${active ? bgColor : inactiveSliderColor}
  );`};
  background-repeat: no-repeat;
  background-position: left;

  transition: background-image 0.2s ease-in-out;

  &::-webkit-slider-thumb {
    appearance: none;
    pointer-events: auto;
    height: 999px;
    width: 16px;
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
  }
`
