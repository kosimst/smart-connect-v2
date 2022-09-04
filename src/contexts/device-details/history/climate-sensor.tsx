import { capitalize } from '@mui/material'
import { indigo, pink, purple, red } from '@mui/material/colors'
import { FC, useMemo, useRef } from 'react'
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
import useHistories from '../../../hooks/use-histories'
import useRect from '../../../hooks/use-rect'
import Device from '../../../types/device'

const tooltipFormatter = (value: number, name: string) => [
  `${value}${
    {
      temperature: '°C',
      humidity: '%',
      co2: 'ppm',
    }[name]
  }`,
  name === 'co2' ? 'CO2' : capitalize(name),
]

const History: FC<{ device: Device }> = ({ device }) => {
  const from = useMemo(() => Date.now() - 60 * 60 * 1000, [])
  const to = useMemo(() => Date.now(), [])
  const states = useMemo(() => ['temperature', 'humidity', 'co2'], [])

  const [histories, loading, error] = useHistories(
    device,
    states,
    from,
    to,
    2 * 60 * 1000
  )

  const containerRef = useRef<HTMLDivElement | null>(null)

  const rect = useRect(containerRef)
  const width = rect?.width ?? 0
  const height = rect?.height ?? 0

  return error ? (
    <span>Failed to fetch history</span>
  ) : loading ? (
    <span>Loading...</span>
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
  )
}

export default History
