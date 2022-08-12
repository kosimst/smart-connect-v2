import { AnimatePresence, motion } from 'framer-motion'
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import clamp from '../../helpers/clamp'
import preventDefault from '../../helpers/prevent-default'
import useScrollLock from '../../hooks/use-scoll-lock'
import useSpring from '../../hooks/use-spring'
import Icon from '../icon'
import { AvailableIcon } from '../icon/available-icons'
import {
  Card,
  ColoredIcon,
  ContentContainer,
  Indicators,
  Name,
  PresenceContainer,
  Slider,
  State,
  TextContainer,
} from './device-card-styles'
import { DataText } from './use-data-hook/data-hook'

export type PureDeviceCardProps = {
  icon: AvailableIcon
  color: string
  bgColor: string
  name: string
  texts?: DataText[]
  toggleValue?: boolean
  sliderValue?: number
  onToggleChange?: (value: boolean) => void
  onSliderChange?: (value: number) => void
  onContextMenu?: () => void
  lowBattery?: boolean
  notAvailable?: boolean
}

const PureDeviceCard: FC<PureDeviceCardProps> = ({
  icon,
  color,
  bgColor,
  name,
  texts = [],
  toggleValue = true,
  sliderValue = 100,
  onToggleChange,
  onSliderChange: onSliderChangeCb,
  onContextMenu,
  lowBattery = false,
  notAvailable = false,
}) => {
  const canSlide = useMemo(
    () => !!onSliderChangeCb && sliderValue !== undefined,
    [onSliderChangeCb]
  )
  const canToggle = useMemo(
    () => !!onToggleChange && toggleValue !== undefined,
    [onToggleChange]
  )

  const [actualSliderValue, setActualSliderValue] = useState(50)
  const [isSliding, setIsSliding] = useState(false)

  const onCardClick = useCallback(() => {
    if (!canToggle) {
      return
    }

    onToggleChange!(!toggleValue)
  }, [toggleValue, onToggleChange])

  const [lastSlide, setLastSlide] = useState(0)

  const onSliderInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      if (!canSlide) {
        return
      }

      setIsSliding(true)
      setLastSlide(Date.now())

      const value = e.target.valueAsNumber
      setActualSliderValue(value)
    },
    [canSlide]
  )

  useEffect(() => {
    if (!isSliding) {
      return
    }

    const timeout = setTimeout(() => {
      setIsSliding(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [setIsSliding, isSliding, lastSlide])

  const sliderRef = useRef<HTMLInputElement>(null)

  const onSlideEnd = useCallback(() => {
    if (!canSlide || !isSliding) {
      return
    }

    if (actualSliderValue === sliderValue) {
      return
    }

    setIsSliding(false)
    onSliderChangeCb!(actualSliderValue)
  }, [
    canSlide,
    onSliderChangeCb,
    isSliding,
    actualSliderValue,
    sliderValue,
    toggleValue,
    onToggleChange,
  ])

  useEffect(() => {
    if (!sliderRef.current) {
      return
    }

    const slider = sliderRef.current

    slider.addEventListener('change', onSlideEnd)

    return () => {
      slider.removeEventListener('change', onSlideEnd)
    }
  }, [onSlideEnd])

  useEffect(() => {
    setActualSliderValue(sliderValue)
  }, [sliderValue])

  const sliderValueSpring = useSpring(
    clamp(actualSliderValue, [0, 100]),
    !isSliding
  )

  useScrollLock(isSliding)

  return (
    <>
      <Card
        onClick={onCardClick}
        fgColor={color}
        bgColor={bgColor}
        active={toggleValue}
        transition={{
          layout: {
            duration: 0.15,
          },
          opacity: {
            duration: 0.2,
          },
          scale: {
            duration: 0.1,
          },
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        whileTap={{
          scale: 0.975,
        }}
        layout
        onContextMenu={onContextMenu}
      >
        <Slider
          type="range"
          onInput={onSliderInput}
          active={toggleValue}
          bgColor={bgColor}
          style={{
            backgroundSize: `${
              canSlide ? sliderValueSpring : toggleValue ? 100 : 0
            }% 100%`,
          }}
          onPointerDown={preventDefault}
          ref={sliderRef}
          value={sliderValueSpring}
          step={1}
          min={0}
          max={100}
        />

        <ContentContainer>
          <Indicators>
            {lowBattery && <Icon icon="battery_alert" />}
            {notAvailable && <Icon icon="sensors_off" />}
          </Indicators>

          <AnimatePresence>
            <PresenceContainer>
              <ColoredIcon
                icon={icon}
                filled={toggleValue}
                key={toggleValue ? 'filled' : 'outlined'}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                }}
                exit={{ opacity: 0 }}
              />
            </PresenceContainer>
          </AnimatePresence>
          <TextContainer>
            <AnimatePresence>
              <PresenceContainer>
                <State
                  key={`${isSliding ? 'sliding' : 'not-sliding'}`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{ opacity: 0 }}
                >
                  {!isSliding
                    ? texts.map(({ text, id }) => (
                        <motion.span
                          key={id}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                          }}
                          exit={{ opacity: 0 }}
                        >
                          {text}
                        </motion.span>
                      ))
                    : `${actualSliderValue}%`}
                </State>
              </PresenceContainer>
            </AnimatePresence>
            <Name>{name}</Name>
          </TextContainer>
        </ContentContainer>
      </Card>
    </>
  )
}

export default memo(PureDeviceCard)
