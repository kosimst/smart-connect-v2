import { Slider, SliderProps, Typography } from '@mui/material'
import { FC, useCallback, useEffect, useState } from 'react'
import { Container, StyledSlider, Texts } from './styles'

export type CustomSliderProps = {
  label: string
  unit?: string
  min?: number
  max?: number
  variant?: 'hue' | 'color-temperature' | 'normal'
  value: number
  onChange: (value: number) => void
}

const CustomSlider: FC<CustomSliderProps> = ({
  label,
  unit = '%',
  min,
  max,
  variant = 'normal',
  value: extValue,
  onChange: onExtChange,
}) => {
  const [value, setValue] = useState(0)
  const onChange = useCallback<Required<SliderProps>['onChange']>(
    (event, value) => {
      setValue(value as number)
    },
    [setValue]
  )

  const onChangeCommitted = useCallback<
    Required<SliderProps>['onChangeCommitted']
  >(
    (event, value) => {
      onExtChange(value as number)
    },
    [onExtChange]
  )

  useEffect(() => {
    setValue(extValue)
  }, [extValue, setValue])

  return (
    <Container>
      <Texts>
        <Typography variant="subtitle1">{label}</Typography>
        <Typography variant="subtitle1">
          {value}
          {unit}
        </Typography>
      </Texts>
      <StyledSlider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        track={variant === 'normal' ? 'normal' : false}
        variant={variant}
        onChangeCommitted={onChangeCommitted}
      />
    </Container>
  )
}

export default CustomSlider
