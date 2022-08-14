import styled from '@emotion/styled'
import { Slider, Stack } from '@mui/material'
import { FC } from 'react'
import CustomSlider from '../../../components/custom-slider'
import CustomToggle from '../../../components/custom-toggle'
import Icon from '../../../components/icon'
import useDeviceState from '../../../hooks/use-device-state'
import Device from '../../../types/device'
import { SliderFlex } from './styles'

const Controls: FC<{
  device: Device
}> = ({ device }) => {
  const [openedLevel, setOpenedLevel] = useDeviceState(
    device,
    'opened-level',
    0
  )

  return (
    <>
      <SliderFlex>
        <CustomSlider
          label="Opened level"
          value={openedLevel}
          onChange={setOpenedLevel}
        />
      </SliderFlex>
    </>
  )
}

export default Controls
