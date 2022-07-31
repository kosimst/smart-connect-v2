import { useEffect, useState } from 'react'
import { isSupportedDeviceType } from '../constants/device-definitions'
import { useSocketClient } from '../contexts/socket-client'
import Device from '../types/device'

const useDevices = () => {
  const [loaded, setLoaded] = useState(false)

  const [devices, setDevices] = useState(Array<Device>())

  const [cachedDevices, setCachedDevices] = useState(Array<Device>())

  useEffect(() => {
    const cached = localStorage.getItem('devices')

    if (!cached) {
      return
    }

    const devices = JSON.parse(cached) as Device[]
    setCachedDevices(devices)
  }, [])

  const ioSocket = useSocketClient()

  useEffect(() => {
    if (!ioSocket.connected) return

    const loadDevices = async () => {
      const channels = await ioSocket.getForeignObjects('alias.0.*', 'channel')

      const newDevices = Array<Device>()
      for (const [id, channel] of Object.entries(channels)) {
        const {
          common: { role, name },
          enums,
        } = channel

        if (!isSupportedDeviceType(role)) {
          continue
        }

        const room = Object.entries(enums).find(([key]) =>
          key.startsWith('enum.rooms')
        )?.[1] as string | undefined

        const device: Device = {
          id,
          name,
          type: role,
          roomName: room,
        }

        newDevices.push(device)
      }

      setDevices(newDevices)
      setLoaded(true)
      localStorage.setItem('devices', JSON.stringify(newDevices))
    }

    loadDevices()
  }, [ioSocket])

  return loaded ? devices : cachedDevices
}

export default useDevices
