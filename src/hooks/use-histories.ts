import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
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
  const [history, setHistory] = useState<
    {
      ts: number
      [state: string]: any
    }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const credentials = useLiveQuery(
    () => ioBrokerDb.credentials.toArray(),
    [],
    []
  )[0]

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
    if (!credentials || !states.length) {
      return
    }

    const fetchHistory = async () => {
      setLoading(true)
      setError(false)

      const response = await fetch(
        `https://${credentials.url}/query/${states
          .map((state) => `${device.id}.${state}`)
          .join(
            ','
          )}?dateFrom=${fromIsoDate}&dateTo=${toIsoDate}&count=${dataPointsCount}&aggregate=average`,
        {
          headers: {
            'CF-Access-Client-Id': credentials.cfClientId,
            'CF-Access-Client-Secret': credentials.cfClientSecret,
          },
        }
      )

      if (!response.ok) {
        console.log('error')
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
    credentials?.toString(),
    device.toString(),
    fromIsoDate,
    toIsoDate,
    states.toString(),
    dataPointsCount,
  ])

  return [history, loading, error] as const
}

export default useHistories
