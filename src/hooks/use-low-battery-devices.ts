import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'

const useLowBatteryDevices = () => {
  const lowBatteryStates = useLiveQuery(
    () =>
      ioBrokerDb.states
        .where('role')
        .equals('battery')
        .and((state) => state.value < 20)
        .toArray(),
    [],
    Array<{
      id: string
      value: number
    }>()
  )

  const lowBatteryDeviceIds = useMemo(
    () =>
      lowBatteryStates.map((state) => ({
        deviceId: state.id.split('.').slice(0, -1).join('.'),
        value: state.value,
      })),
    [lowBatteryStates]
  )

  const [infos, setInfos] = useState(
    Array<{
      device: Device
      battery: number
    }>()
  )

  useEffect(() => {
    const getDevices = async () => {
      const devices = (await ioBrokerDb.devices.bulkGet(
        lowBatteryDeviceIds.map((d) => d.deviceId)
      )) as Device[]

      setInfos(
        devices.map((d) => ({
          device: d,
          battery:
            lowBatteryDeviceIds.find((b) => b.deviceId === d.id)?.value ?? 0,
        }))
      )
    }

    getDevices()
  }, [lowBatteryDeviceIds])

  return infos
}

export default useLowBatteryDevices
