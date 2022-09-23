import { useEffect, useMemo, useState } from 'react'
import useIoBrokerConnection from '../contexts/iobroker-connection'
import ioBrokerDb from '../db/iobroker-db'
import closestMinute from '../helpers/closest-minute'
import sleep from '../helpers/sleep'
import Device from '../types/device'

type HistoryResult = {
  target: string
  datapoints: [any, number][]
}[]

function assertHistoryResult(json: any): asserts json is HistoryResult {
  if (!json || !Array.isArray(json) || !json.length) {
    throw new Error('Invalid history result')
  }

  for (const item of json) {
    if (!item.datapoints || !Array.isArray(item.datapoints)) {
      throw new Error('Invalid history result')
    }
  }
}

const useHistories = (
  device: Device,
  states: string[],
  from: number,
  to: number,
  interval: number
) => {
  const { connection } = useIoBrokerConnection()

  const [history, setHistory] = useState<
    {
      ts: number
      [state: string]: any
    }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fromIsoDate = useMemo(
    () => closestMinute(new Date(from)).toISOString(),
    [from]
  )
  const toIsoDate = useMemo(
    () => closestMinute(new Date(to)).toISOString(),
    [to]
  )

  const dataPointsCount = useMemo(
    () =>
      Math.ceil(
        (closestMinute(new Date(to)).getTime() -
          closestMinute(new Date(from)).getTime()) /
          interval
      ),
    [from, to, interval]
  )

  useEffect(() => {
    if (!connection || !states.length) {
      return
    }

    const fetchHistory = async () => {
      setLoading(true)
      setError(false)

      const response = await connection.getHistory(
        'alias.0.simon.climate-sensor.co2',
        {
          start: Date.now() - 60 * 60 * 1000,
          end: Date.now(),
          id: 'alias.0.simon.climate-sensor.co2',
          aggregate: 'minmax',
        }
      )

      console.log(response)

      if (!response.ok) {
        setError(true)
        setLoading(false)
        return
      }

      const json = await response.json()

      try {
        assertHistoryResult(json)
      } catch {
        setError(true)
        setLoading(false)
        return
      }

      const result = Array<{
        ts: number
        [state: string]: any
      }>(dataPointsCount)
        .fill(null as any)
        .map((_, i) => {
          const ts = closestMinute(new Date(from + i * interval)).getTime()

          return {
            ts,
          }
        })

      for (const [i, entry] of Object.entries(result)) {
        for (const state of states) {
          const stateDataPoints = json.find(
            (item) => item.target === `${device.id}.${state}`
          )?.datapoints

          if (!stateDataPoints) {
            setError(true)
            setLoading(false)
            return
          }

          const { ts: entryTs } = entry
          const stateAtTs = stateDataPoints.find(
            ([value, dataPointTs]) => dataPointTs >= entryTs
          )

          if (!stateAtTs) {
            continue
          }

          // @ts-ignore
          result[i][state] = stateAtTs[0]
        }
      }

      setHistory(result)
      setLoading(false)
      setError(false)
    }

    fetchHistory()
  }, [
    device.toString(),
    fromIsoDate,
    toIsoDate,
    states.toString(),
    dataPointsCount,
  ])

  return [history, loading, error] as const
}

export default useHistories
