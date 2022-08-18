import { SwitchProps, Typography } from '@mui/material'
import { FC, useCallback } from 'react'
import { Container, Texts } from '../custom-slider/styles'
import { StyledSwitch } from './styles'

export type CustomToggleProps = {
  onChange: (value: boolean) => void
  value: boolean
  label?: string
  trueLabel?: string
  falseLabel?: string
}

const CustomToggle: FC<CustomToggleProps> = ({
  onChange,
  value,
  label = 'On/Off',
  trueLabel = 'On',
  falseLabel = 'Off',
}) => {
  const onChangeHandler = useCallback<Required<SwitchProps>['onChange']>(
    (event, checked) => {
      onChange(checked)
    },
    [onChange]
  )

  return (
    <Container>
      <Texts>
        <Typography variant="subtitle1">{label}</Typography>
        <Typography variant="subtitle1">
          {value ? trueLabel : falseLabel}
        </Typography>
      </Texts>

      <StyledSwitch
        checked={value}
        onChange={onChangeHandler}
        focusRipple={false}
      />
    </Container>
  )
}

export default CustomToggle
