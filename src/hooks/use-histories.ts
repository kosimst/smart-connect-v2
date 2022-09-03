import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'

const useHistories = (
  device: Device,
  states: string[],
  from: number,
  to: number
) => {
  const [history, setHistory] = useState<{
    [state: string]: {
      timestamp: number
      value: any
    }[]
  }>(Object.fromEntries(states.map((state) => [state, []])))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const credentials = useLiveQuery(
    () => ioBrokerDb.credentials.toArray(),
    [],
    []
  )[0]

  const fromIsoDate = useMemo(() => new Date(from).toISOString(), [from])
  const toIsoDate = useMemo(() => new Date(to).toISOString(), [to])

  useEffect(() => {
    console.log('start')

    if (!credentials || !states.length) {
      console.log('no credentials or states')
      return
    }

    const fetchHistory = async () => {
      setLoading(true)
      setError(false)

      const response = await fetch(
        `https://${credentials.url}/query/${states
          .map((state) => `${device.id}.${state}`)
          .join(',')}?dateFrom=${fromIsoDate}&dateTo=${toIsoDate}`,
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

      if (!json || !Array.isArray(json) || !json.length) {
        console.log('no json')
        setError(true)
        setLoading(false)
        return
      }

      const result: {
        [state: string]: {
          ts: number
          value: any
        }[]
      } = {}

      for (const state of states) {
        const { datapoints } =
          json.find((item) => item.target === `${device.id}.${state}`) || {}

        console.log(state, datapoints)

        if (!datapoints || !datapoints.length) {
          console.log('no datapoints')
          setError(true)
          setLoading(false)
          return
        }

        result[state] = datapoints.map(([value, ts]: [any, number]) => ({
          value,
          ts,
        }))
      }

      console.log(result)

      //setHistory(json)
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
  ])

  return [history, loading, error] as const
}

export default useHistories
