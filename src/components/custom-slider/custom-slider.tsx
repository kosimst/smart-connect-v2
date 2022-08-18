import { Slider, SliderProps, Typography } from '@mui/material'
import {
  FC,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import msToTime from '../../helpers/ms-to-time'
import { Container, StyledSlider, Texts } from './styles'

export type CustomSliderProps = {
  label: string
  unit?: string
  min?: number
  max?: number
  step?: number
  variant?: 'hue' | 'color-temperature' | 'normal'
  aliases?: {
    [key: string]: string
  }
  time?: boolean
  value: number
  onChange: (value: number) => void
}

const CustomSlider: FC<CustomSliderProps> = forwardRef(
  (
    {
      label,
      unit = '%',
      min = 0,
      max = 100,
      variant = 'normal',
      value: extValue,
      onChange: onExtChange,
      aliases = {},
      step = 1,
      time,
    },
    ref
  ) => {
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

    const alias = useMemo(() => {
      const currValueString = value.toString()
      const alias = aliases[currValueString]

      return alias
    }, [aliases, value])

    return (
      <Container>
        <Texts>
          <Typography variant="subtitle1">{label}</Typography>
          <Typography variant="subtitle1">
            {alias
              ? alias
              : time
              ? msToTime(value)
              : `${Math.trunc(value)}${unit}`}
          </Typography>
        </Texts>
        <StyledSlider
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          //track={variant === 'normal' ? 'normal' : false}
          variant={variant}
          onChangeCommitted={onChangeCommitted}
          step={step}
        />
      </Container>
    )
  }
)

export default CustomSlider
