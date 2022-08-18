import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'

const useUnavailableDevices = () => {
  const lowBatteryStates = useLiveQuery(
    () =>
      ioBrokerDb.states
        .where('role')
        .equals('available')
        .and((state) => state.value === false)
        .toArray(),
    [],
    Array<{
      id: string
      value: number
    }>()
  )

  const deviceIds = useMemo(
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
    }>()
  )

  useEffect(() => {
    const getDevices = async () => {
      const devices = (await ioBrokerDb.devices.bulkGet(
        deviceIds.map((d) => d.deviceId)
      )) as Device[]

      setInfos(
        devices.map((d) => ({
          device: d,
        }))
      )
    }

    getDevices()
  }, [deviceIds])

  return infos
}

export default useUnavailableDevices
