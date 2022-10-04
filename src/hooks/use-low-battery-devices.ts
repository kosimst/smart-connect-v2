import { useEffect, useState } from 'react'
import useIoBrokerConnection from '../contexts/iobroker-connection'
import useIoBrokerDevices from '../contexts/iobroker-devices'
import { useIoBrokerStates } from '../contexts/iobroker-states'
import Device from '../types/device'

const useLowBatteryDevices = () => {
  const { connection } = useIoBrokerConnection()
  const { getDeviceFromId } = useIoBrokerDevices()
  const { subscribeState } = useIoBrokerStates()

  const [batteryStates, setLowBatteryStates] = useState<string[]>([])
  const [batteryCriticalStates, setBatteryCriticalStates] = useState<string[]>(
    []
  )

  const [ready, setReady] = useState(false)

  const [lowBatteryDevices, setLowBatteryDevices] = useState<
    {
      device: Device
      battery: number | 'critical'
    }[]
  >([])

  useEffect(() => {
    const fetchStatesToWatch = async () => {
      if (!connection) {
        return
      }

      setReady(false)

      const [newBatteryStates, newBatteryCriticalStates] = await Promise.all([
        connection.getStates('alias.0.*.battery'),
        connection.getStates('alias.0.*.battery-critical'),
      ])

      setReady(true)

      const devicesWithLowBattery = Object.entries(newBatteryStates)
        .filter(([, state]) => state?.val <= 20)
        .map(([id, { val: battery }]) => ({
          device: getDeviceFromId(id),
          battery,
        }))
        .filter(({ device }) => device) as {
        device: Device
        battery: number | 'critical'
      }[]

      const devicesWithCriticalBattery = Object.entries(
        newBatteryCriticalStates
      )
        .filter(([, state]) => state?.val)
        .map(([id]) => ({
          device: getDeviceFromId(id),
          battery: 'critical',
        }))
        .filter(({ device }) => device) as {
        device: Device
        battery: number | 'critical'
      }[]

      setLowBatteryDevices([
        ...devicesWithLowBattery,
        ...devicesWithCriticalBattery,
      ])

      setLowBatteryStates(Object.keys(newBatteryStates))
      setBatteryCriticalStates(Object.keys(newBatteryCriticalStates))
    }

    fetchStatesToWatch()
  }, [connection])

  useEffect(() => {
    const abortController = new AbortController()

    const watchStates = async () => {
      for (const batteryState of batteryStates) {
        await subscribeState(
          batteryState,
          (val) => {
            const device = getDeviceFromId(batteryState)

            if (!device) {
              return
            }

            setLowBatteryDevices((prev) =>
              prev.filter(({ device: d }) => d.id !== device.id)
            )

            if (val > 20) {
              return
            }

            setLowBatteryDevices((devices) => [
              ...devices,
              {
                device,
                battery: val,
              },
            ])
          },
          abortController.signal
        ).catch(() => {})
      }

      for (const batteryCriticalState of batteryCriticalStates) {
        await subscribeState(
          batteryCriticalState,
          (val) => {
            const device = getDeviceFromId(batteryCriticalState)

            if (!device) {
              return
            }

            setLowBatteryDevices((prev) =>
              prev.filter(({ device: d }) => d.id !== device.id)
            )

            if (!val) {
              return
            }

            setLowBatteryDevices((devices) => [
              ...devices,
              {
                device,
                battery: 'critical',
              },
            ])
          },
          abortController.signal
        ).catch(() => {})
      }
    }

    watchStates()

    return () => {
      abortController.abort()
    }
  }, [subscribeState, batteryStates, batteryCriticalStates])

  return [lowBatteryDevices, ready] as const
}

export default useLowBatteryDevices
