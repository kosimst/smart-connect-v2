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

      const stateHistories = await Promise.all(
        states.map(
          (state) =>
            connection.getHistory(`${device.id}.${state}`, {
              instance: 'influxdb.0',
              start: from,
              end: to,
              from: false,
              ack: false,
              q: false,
              addID: false,
              aggregate: 'average',
              returnNewestEntries: true,
              count: dataPointsCount,
            }) as Promise<{ val: any; ts: number }[]>
        )
      )

      const data = Object.fromEntries(
        states.map((state, index) => [state, stateHistories[index]])
      )

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
          const stateDataPoints = data[state]

          if (!stateDataPoints) {
            setError(true)
            setLoading(false)
            return
          }

          const { ts: entryTs } = entry
          const stateAtTs = stateDataPoints.find(
            ({ ts: dataPointTs }) => dataPointTs >= entryTs
          )

          if (!stateAtTs) {
            continue
          }

          // @ts-ignore
          result[i][state] = stateAtTs.val
        }
      }

      setHistory(result)
      setLoading(false)
      setError(false)
    }

    fetchHistory()
  }, [device.id, from, to, , states, dataPointsCount])

  return [history, loading, error] as const
}

export default useHistories
