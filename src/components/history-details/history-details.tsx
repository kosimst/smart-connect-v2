import { useTheme } from '@emotion/react'
import { capitalize, ButtonGroup, Button, IconButton } from '@mui/material'
import { indigo, purple, pink } from '@mui/material/colors'
import { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Line,
} from 'recharts'
import forwardBaseProps from '../../helpers/forward-base-props'
import useHistories from '../../hooks/use-histories'
import useRect from '../../hooks/use-rect'
import Device from '../../types/device'
import Icon from '../icon'
import {
  ChartWrapper,
  Container,
  Header,
  LoadingOverlay,
  Spinner,
} from './styles'

const PIXELS_PER_DATA_POINT = 1

export type HistoryDetailsProps = {
  device: Device
  states: string[]
}

const availableTimeFrames = [
  '1h',
  '3h',
  '6h',
  '12h',
  '1d',
  '3d',
  '1w',
  '2w',
  '1m',
  '3m',
  '6m',
  '1y',
]

const onlyVisibleOnFullScreen = ['1h', '6h', '12h', '2w', '6m', '1y']

const timeFrameMinutes = {
  '1h': 60,
  '3h': 180,
  '6h': 360,
  '12h': 720,
  '1d': 1440,
  '3d': 4320,
  '1w': 10080,
  '2w': 20160,
  '1m': 43800,
  '3m': 131400,
  '6m': 262800,
  '1y': 525600,
} as {
  [key: AvailableTimeFrame]: number
}

type AvailableTimeFrame = typeof availableTimeFrames[number]

const dataKeyNames = {
  co2: 'CO2',
  'download-megabits': 'Download',
  'upload-megabits': 'Upload',
}

const tooltipFormatter = (value: number, name: string) => [
  `${Math.round(value * 100) / 100}${
    {
      temperature: '°C',
      humidity: '%',
      co2: 'ppm',
      'download-megabits': 'Mbit/s',
      'upload-megabits': 'Mbit/s',
      power: 'W',
      ping: 'ms',
    }[name]
  }`,
  // @ts-ignore
  capitalize(dataKeyNames[name] || name),
]

const HistoryDetails = forwardBaseProps<HistoryDetailsProps>(
  ({ device, states }, baseProps) => {
    const [selectedTimeFrame, setSelectedTimeFrame] =
      useState<AvailableTimeFrame>('3h')

    const [now, setNow] = useState(Date.now())
    const from = useMemo(
      () => now - timeFrameMinutes[selectedTimeFrame] * 60 * 1000,
      [selectedTimeFrame]
    )
    const to = useMemo(() => now, [now])

    const [isFullscreen, setIsFullscreen] = useState(false)

    const setTimeFrameTo = useCallback(
      (timeFrame: AvailableTimeFrame) => () => {
        setSelectedTimeFrame(timeFrame)
        setNow(Date.now())
      },
      [setSelectedTimeFrame]
    )

    const containerRef = useRef<HTMLDivElement>(null)

    const rect = useRect(containerRef)

    const dataPointsCount = useMemo(() => {
      if (!rect) return 0

      return Math.round(rect.width / PIXELS_PER_DATA_POINT)
    }, [rect])

    const [histories, loading, error] = useHistories(
      device,
      states,
      from,
      to,
      dataPointsCount
    )

    const toggleFullScreen = useCallback(async () => {
      try {
        const fullScreenElement = document.fullscreenElement
        if (fullScreenElement) {
          await document.exitFullscreen()
          await screen.orientation.unlock()
          setInterval((prev) => (prev === 60 * 1000 ? prev : prev * 5))
        } else {
          await containerRef.current?.requestFullscreen()
          await screen.orientation.lock('landscape')
          setInterval((prev) => Math.min(60 * 1000, prev / 5))
        }
      } catch {
      } finally {
        setIsFullscreen((prev) => !prev)
      }
    }, [containerRef])
    useEffect(() => {
      const onFullscreenChange = () => {
        if (!document.fullscreenElement) {
          setIsFullscreen(false)
        }
      }
      document.addEventListener('fullscreenchange', onFullscreenChange)
      return () => {
        document.removeEventListener('fullscreenchange', onFullscreenChange)
      }
    }, [])

    const availableFullScreenHeight = useMemo(() => {
      if (!rect) return 320

      const { height } = rect

      return height - 32 - 40 - 16
    }, [rect])

    const theme = useTheme()

    const [hiddenStates, setHiddenStates] = useState<Set<string>>(new Set())

    const colorLevel = useMemo(
      () => (theme.palette.mode === 'dark' ? 300 : 500),
      [theme.palette.mode]
    )

    return (
      <Container {...baseProps} ref={containerRef}>
        <Header>
          <ButtonGroup>
            {availableTimeFrames
              .filter(
                (timeFrame) =>
                  !onlyVisibleOnFullScreen.includes(timeFrame) || isFullscreen
              )
              .map((timeFrame) => (
                <Button
                  key={timeFrame}
                  onClick={setTimeFrameTo(timeFrame)}
                  variant={
                    selectedTimeFrame === timeFrame ? 'contained' : 'outlined'
                  }
                >
                  {timeFrame}
                </Button>
              ))}
          </ButtonGroup>
          <IconButton onClick={toggleFullScreen}>
            <Icon icon={isFullscreen ? 'fullscreen_exit' : 'fullscreen'} />
          </IconButton>
        </Header>
        {error ? (
          <div>Failed to fetch history</div>
        ) : (
          <ChartWrapper>
            {loading && <Spinner />}
            {loading && <LoadingOverlay />}
            <ResponsiveContainer
              width="100%"
              height={isFullscreen ? availableFullScreenHeight : 320}
            >
              <LineChart data={histories || []}>
                <XAxis dataKey="ts" tickCount={100} tick={false} />
                {states.map((state) => (
                  <YAxis
                    key={state}
                    yAxisId={state}
                    hide
                    domain={[
                      (dataMin: number) => dataMin * 0.975,
                      (dataMax: number) => dataMax * 1.025,
                    ]}
                  />
                ))}
                <Legend
                  // @ts-ignore
                  formatter={(val) => capitalize(dataKeyNames[val] || val)}
                  align="left"
                  iconType="plainline"
                  onClick={({ dataKey }) => {
                    setHiddenStates((prev) => {
                      const next = new Set(prev)
                      if (next.has(dataKey)) {
                        next.delete(dataKey)
                      } else {
                        next.add(dataKey)
                      }
                      return next
                    })
                  }}
                />

                <Tooltip
                  labelFormatter={(ts) =>
                    new Date(ts).toLocaleString('de-AT', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  }
                  formatter={tooltipFormatter}
                  wrapperStyle={{
                    border: 'none',
                    outline: 'none',
                    borderRadius: 8,
                    boxShadow: theme.shadows[2],
                    display: loading ? 'none' : 'block',
                  }}
                  contentStyle={{
                    outline: 'none',
                    border: 'none',
                    borderRadius: 8,
                    backgroundColor: theme.palette.background.paper,
                  }}
                  labelStyle={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 4,
                    opacity: 0.75,
                  }}
                />
                {states.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={[
                      indigo[colorLevel],
                      purple[colorLevel],
                      pink[colorLevel],
                    ].find((_, i) => i === states.indexOf(key))}
                    dot={false}
                    yAxisId={key}
                    strokeWidth={2}
                    hide={hiddenStates.has(key)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        )}
      </Container>
    )
  }
)

export default memo(HistoryDetails)
