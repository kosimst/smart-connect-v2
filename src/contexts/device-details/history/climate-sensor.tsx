import {
  Button,
  ButtonGroup,
  capitalize,
  IconButton,
  Typography,
} from '@mui/material'
import { indigo, pink, purple, red } from '@mui/material/colors'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Icon from '../../../components/icon'
import useHistories from '../../../hooks/use-histories'
import useRect from '../../../hooks/use-rect'
import Device from '../../../types/device'

const tooltipFormatter = (value: number, name: string) => [
  `${Math.round(value * 100) / 100}${
    {
      temperature: '°C',
      humidity: '%',
      co2: 'ppm',
    }[name]
  }`,
  name === 'co2' ? 'CO2' : capitalize(name),
]

const History: FC<{ device: Device }> = ({ device }) => {
  const [from, setFrom] = useState(Date.now() - 60 * 60 * 1000)
  const [to, setTo] = useState(Date.now())
  const [interval, setInterval] = useState(2 * 60 * 1000)
  const states = useMemo(() => ['temperature', 'humidity', 'co2'], [])

  const [histories, loading, error] = useHistories(
    device,
    states,
    from,
    to,
    interval
  )

  const onTimeFrameSelect = useCallback(
    (timeFrame: '1h' | '6h' | '12h' | '24h' | '168h' | '720h') => () => {
      const hours = parseInt(timeFrame)

      setFrom(Date.now() - hours * 60 * 60 * 1000)
      setTo(Date.now())

      const intervals = {
        '1h': 1 * 60 * 1000,
        '6h': 5 * 60 * 1000,
        '12h': 10 * 60 * 1000,
        '24h': 30 * 60 * 1000,
        '168h': 60 * 60 * 1000,
        '720h': 4 * 60 * 60 * 1000,
      }
      setInterval(intervals[timeFrame])
    },
    []
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullScreen = useCallback(async () => {
    try {
      const fullScreenElement = document.fullscreenElement
      if (fullScreenElement) {
        await document.exitFullscreen()
        await screen.orientation.unlock()
      } else {
        await containerRef.current?.requestFullscreen()
        await screen.orientation.lock('landscape')
      }
    } catch {}
  }, [containerRef])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        backgroundColor: 'white',
      }}
    >
      <ButtonGroup
        style={{
          marginBottom: 16,
        }}
      >
        <Button onClick={onTimeFrameSelect('1h')}>1h</Button>
        <Button onClick={onTimeFrameSelect('6h')}>6h</Button>
        <Button onClick={onTimeFrameSelect('12h')}>12h</Button>
        <Button onClick={onTimeFrameSelect('24h')}>1d</Button>
        <Button onClick={onTimeFrameSelect('168h')}>1w</Button>
        <Button onClick={onTimeFrameSelect('720h')}>1m</Button>
      </ButtonGroup>

      <IconButton
        onClick={toggleFullScreen}
        style={{
          position: 'absolute',
          top: -6,
          right: 0,
        }}
      >
        <Icon icon="fullscreen" />
      </IconButton>
      {error ? (
        <div>Failed to fetch history</div>
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
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
              formatter={(val) => (val === 'co2' ? 'CO2' : capitalize(val))}
              align="left"
              iconType="plainline"
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
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.33)',
              }}
              contentStyle={{
                outline: 'none',
                border: 'none',
                borderRadius: 8,
              }}
              labelStyle={{
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 4,
                opacity: 0.75,
              }}
            />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            {states.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={[indigo[500], purple[500], pink[600]].find(
                  (_, i) => i === states.indexOf(key)
                )}
                dot={false}
                yAxisId={key}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default History
