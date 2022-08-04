import { AnimatePresence } from 'framer-motion'
import { FC, useEffect, useMemo, useState } from 'react'
import Chip from '../../components/chip'
import DeviceCard from '../../components/device-card'
import DeviceGrid from '../../components/device-grid'
import Icon from '../../components/icon'
import deviceDefinitions from '../../constants/device-definitions'
import { useSettings } from '../../contexts/settings'
import groupBy from '../../helpers/group-by'
import useDevices from '../../hooks/use-devices'
import { Chips, Link, LinksGrid, Room, RoomTitle } from './styles'

const DevicesPage: FC = () => {
  const devices = useDevices()

  const deviceTypes = useMemo(
    () =>
      devices
        .map((device) => device.type)
        .map((type) => deviceDefinitions[type].name)
        .filter((type, index, types) => types.indexOf(type) === index)
        .sort(),
    [devices]
  )
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState([] as string[])
  useEffect(() => {
    const storedSelectedDeviceTypes = localStorage.getItem(
      'selectedDeviceTypes'
    )
    if (storedSelectedDeviceTypes) {
      setSelectedDeviceTypes(JSON.parse(storedSelectedDeviceTypes))
    } else {
      setSelectedDeviceTypes(deviceTypes)
    }
  }, [deviceTypes])

  const [favoriteRoom, setFavoriteRoom] = useState('Simon')
  useEffect(() => {
    const storedFavoriteRoom = localStorage.getItem('favoriteRoom')

    if (storedFavoriteRoom) {
      setFavoriteRoom(storedFavoriteRoom)
    }
  }, [])

  const selectedDevices = useMemo(
    () =>
      devices.filter((device) =>
        selectedDeviceTypes.includes(deviceDefinitions[device.type].name)
      ),
    [devices, selectedDeviceTypes]
  )

  const groupedByRoom = useMemo(() => {
    const sorted = Object.entries(
      groupBy(selectedDevices, 'roomName', 'Other devices')
    )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([roomName, devices]) =>
          [
            roomName,
            devices.sort((a, b) => b.type.localeCompare(a.type)),
          ] as const
      )

    const withoutFavorite = sorted.filter(
      ([roomName]) => roomName !== favoriteRoom
    )
    const favorite = sorted.filter(([roomName]) => roomName === favoriteRoom)

    return [...favorite, ...withoutFavorite]
  }, [selectedDevices, favoriteRoom])

  const { open: openSettings } = useSettings()

  return (
    <>
      <Chips>
        {deviceTypes.map((type) => (
          <Chip
            key={type}
            selected={selectedDeviceTypes.includes(type)}
            onClick={() => {
              if (selectedDeviceTypes.includes(type)) {
                setSelectedDeviceTypes((prev) => {
                  const newVal = prev.filter((t) => t !== type)
                  localStorage.setItem(
                    'selectedDeviceTypes',
                    JSON.stringify(newVal)
                  )
                  return newVal
                })
              } else {
                setSelectedDeviceTypes((prev) => {
                  const newVal = [...prev, type]
                  localStorage.setItem(
                    'selectedDeviceTypes',
                    JSON.stringify(newVal)
                  )
                  return newVal
                })
              }
            }}
            onContextMenu={() => {
              setSelectedDeviceTypes((prev) => {
                const newVal =
                  prev.length === 1 && prev[0] === type ? deviceTypes : [type]
                localStorage.setItem(
                  'selectedDeviceTypes',
                  JSON.stringify(newVal)
                )
                return newVal
              })
            }}
          >
            {type}
          </Chip>
        ))}
      </Chips>
      {groupedByRoom.map(([roomName, devices]) => (
        <Room
          key={roomName}
          transition={{
            layout: {
              duration: 0.15,
            },
          }}
          layout
        >
          <RoomTitle
            onContextMenu={() => {
              setFavoriteRoom(roomName)
              localStorage.setItem('favoriteRoom', roomName)
            }}
          >
            {roomName}
          </RoomTitle>

          <DeviceGrid>
            <AnimatePresence>
              {devices.map((device) => (
                <DeviceCard device={device} key={device.id} />
              ))}
            </AnimatePresence>
          </DeviceGrid>
        </Room>
      ))}

      <LinksGrid
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          layout: {
            duration: 0.15,
          },
          opacity: {
            duration: 0.15,
            delay: 0.5,
          },
        }}
        layout
      >
        <Link onClick={openSettings}>
          <Icon icon="settings" filled />
          <span>Settings</span>
        </Link>
      </LinksGrid>
    </>
  )
}

export default DevicesPage
