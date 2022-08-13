import styled from '@emotion/styled'
import { Slider, Stack } from '@mui/material'
import { FC } from 'react'
import Icon from '../../../components/icon'
import Device from '../../../types/device'

const SmallIcon = styled(Icon)`
  font-size: 20px;
`

const BigIcon = styled(Icon)`
  font-size: 28px;
`

const Controls: FC<{
  device: Device
}> = () => {
  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <SmallIcon icon="light_mode" />
        <Slider step={1} />
        <BigIcon icon="light_mode" />
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Icon icon="ac_unit" />
        <Slider step={1} />
        <Icon icon="sunny" />
      </Stack>
    </>
  )
}

export default Controls
