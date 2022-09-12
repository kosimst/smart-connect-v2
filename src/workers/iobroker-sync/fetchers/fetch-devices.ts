import { isSupportedDeviceType } from '../../../constants/device-definitions'
import ioBrokerDb from '../../../db/iobroker-db'
import Credentials from '../../../types/credentials'
import Device from '../../../types/device'

const fetchDevices = async (credentials: Credentials) => {
  const { url, cfClientId, cfClientSecret } = credentials

  const res = await fetch(
    `https://${url}/objects?pattern=alias.0.*&type=channel`,
    {
      headers: {
        'CF-Access-Client-Id': cfClientId,
        'CF-Access-Client-Secret': cfClientSecret,
      },
    }
  )

  if (!res.ok) {
    console.warn(`Failed to fetch devices: ${res.status} (${res.statusText})`)
    return
  }

  const json = await res.json()

  const newDevices = Array<Device>()

  for (const {
    common: { name, role },
    _id: id,
    enums,
  } of Object.values<any>(json)) {
    if (!isSupportedDeviceType(role)) {
      continue
    }

    const roomName = Object.entries(enums).find(
      ([k, v]) => k.startsWith('enum.rooms.') && v
    )?.[1] as string | undefined

    newDevices.push({
      id,
      name,
      type: role,
      roomName,
    })
  }

  await ioBrokerDb.devices.bulkPut(newDevices)

  const devices = await ioBrokerDb.devices.toArray()
  const devicesToRemove = devices
    .filter(
      (device) => !newDevices.some((newDevice) => newDevice.id == device.id)
    )
    .map((device) => device.id)

  if (devicesToRemove.length) {
    await ioBrokerDb.devices.bulkDelete(devicesToRemove)
  }
}

export default fetchDevices
