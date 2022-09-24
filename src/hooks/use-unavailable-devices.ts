import { useEffect, useState } from 'react'
import useIoBrokerConnection from '../contexts/iobroker-connection'
import useIoBrokerDevices from '../contexts/iobroker-devices'
import { useIoBrokerStates } from '../contexts/iobroker-states'
import Device from '../types/device'

const useUnavailableDevices = () => {
  const { connection } = useIoBrokerConnection()
  const { getDeviceFromId } = useIoBrokerDevices()
  const { subscribeState } = useIoBrokerStates()

  const [unavailableStates, setUnavailableStates] = useState<string[]>([])

  const [unavailableDevices, setUnavailableDevices] = useState<Device[]>([])

  useEffect(() => {
    const fetchStatesToWatch = async () => {
      if (!connection) {
        return
      }

      const newUnavailableStates = await connection.getStates(
        'alias.0.*.available'
      )

      const newUnavailableDevices = Object.entries(newUnavailableStates)
        .filter(([, state]) => !state?.val)
        .map(([id]) => getDeviceFromId(id))
        .filter((device) => device) as Device[]

      setUnavailableDevices(newUnavailableDevices)
      setUnavailableStates(Object.keys(newUnavailableStates))
    }

    fetchStatesToWatch()
  }, [connection])

  useEffect(() => {
    const abortController = new AbortController()

    const watchStates = async () => {
      for (const state of unavailableStates) {
        subscribeState(
          state,
          (state) => {
            const device = getDeviceFromId(state.id)

            if (!device) {
              return
            }

            setUnavailableDevices((devices) =>
              devices.filter((d) => d.id !== device.id)
            )

            if (!state.val) {
              setUnavailableDevices((devices) => [...devices, device])
            }
          },
          abortController.signal
        ).catch(() => {})
      }
    }

    watchStates()

    return () => {
      abortController.abort()
    }
  }, [unavailableStates])

  return unavailableDevices
}

export default useUnavailableDevices
