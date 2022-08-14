import styled from '@emotion/styled'
import { Switch } from '@mui/material'

export const StyledSwitch = styled(Switch)`
  width: 45px;
  height: 24px;
  padding: 0;
  margin: 10px 0;

  & .MuiSwitch-track {
    width: 100%;
    height: 100%;
    border-radius: 99px;
  }
  & .MuiSwitch-thumb {
    width: 16px;
    height: 16px;
    position: relative;
    top: -5px;
    left: -4px;
  }
`
