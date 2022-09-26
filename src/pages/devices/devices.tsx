import { Alert, Badge } from '@mui/material'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Chip from '../../components/chip'
import DeviceCard from '../../components/device-card'
import Icon from '../../components/icon'
import { AvailableIcon } from '../../components/icon/available-icons'
import deviceDefinitions from '../../constants/device-definitions'
import useIoBrokerDevices from '../../contexts/iobroker-devices'
import { useSettings } from '../../contexts/settings'
import forwardBaseProps from '../../helpers/forward-base-props'
import groupBy from '../../helpers/group-by'
import toKebabCase from '../../helpers/to-kebab-case'
import useLocalStorage from '../../hooks/use-local-storage'
import useSetStates from '../../hooks/use-set-states'
import HomeVitals from './parts/home-vitals'
import OpenedDevices from './parts/opened-devices'
import {
  FilterIconButton,
  Link,
  LinksGrid,
  Room,
  RoomTitle,
  StatusContainer,
  StyledDeviceGrid,
  StyledExpandableChips,
  Title,
} from './styles'

const DevicesPage = forwardBaseProps((baseProps) => {
  const { devices } = useIoBrokerDevices()

  const didJustSetStates = useSetStates()

  const isHidden = useCallback(
    (deviceFullName: string) =>
      Object.values(deviceDefinitions).some(
        // @ts-ignore
        ({ fullName, hidden }) => fullName === deviceFullName && !!hidden
      ),
    []
  )

  const deviceTypes = useMemo(
    () =>
      devices
        .map((device) => device.type)
        .map((type) => deviceDefinitions[type].fullName)
        .filter((type, index, types) => types.indexOf(type) === index)
        .sort(),
    [devices]
  )
  const getIcon = useCallback((fullName: string): AvailableIcon => {
    const deviceDefinition = Object.entries(deviceDefinitions).find(
      ([, definition]) => definition.fullName === fullName
    )
    return deviceDefinition ? deviceDefinition[1].icon : 'home_iot_device'
  }, [])

  const { open: openSettings } = useSettings()

  const [favoriteRoom, setFavoriteRoom] = useLocalStorage('favorite-room', '')
  const setFavoriteRoomTo = useCallback(
    (room: string) => () => setFavoriteRoom(room),
    [setFavoriteRoom]
  )

  const [selectedDeviceTypes, setSelectedDeviceTypes] = useLocalStorage(
    'selected-device-types',
    deviceTypes
  )
  const hiddenDeviceTypesCount = useMemo(
    () =>
      deviceTypes.filter((type) => !selectedDeviceTypes.includes(type)).length,
    [deviceTypes, selectedDeviceTypes]
  )

  const [filterExpanded, setFilterExpanded] = useLocalStorage(
    'device-filter-expanded',
    false
  )
  const toggleFilterExpanded = useCallback(() => {
    setFilterExpanded((prev) => !prev)
  }, [setFilterExpanded])

  const selectedDevices = useMemo(
    () =>
      devices.filter(
        (device) =>
          selectedDeviceTypes.includes(
            deviceDefinitions[device.type].fullName
          ) && !isHidden(deviceDefinitions[device.type].fullName)
      ),
    [devices, selectedDeviceTypes]
  )

  const groupedByRoom = useMemo(() => {
    const sorted = Object.entries(groupBy(devices, 'roomName', 'Other devices'))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([roomName, devices]) =>
          [
            roomName,
            devices.sort((a, b) => b.type.localeCompare(a.type)),
          ] as const
      )
      .map(([roomName, devices]) => {
        const devicesWithVisibility = devices.map((device) => {
          const visible =
            selectedDeviceTypes.includes(
              deviceDefinitions[device.type].fullName
            ) && !isHidden(deviceDefinitions[device.type].fullName)

          return {
            device,
            visible,
          }
        })

        return [roomName, devicesWithVisibility] as const
      })

    const withoutFavorite = sorted.filter(
      ([roomName]) => roomName !== favoriteRoom
    )
    const favorite = sorted.filter(([roomName]) => roomName === favoriteRoom)

    return [...favorite, ...withoutFavorite]
  }, [selectedDevices, favoriteRoom])

  return (
    <div {...baseProps}>
      <AnimatePresence>
        {didJustSetStates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="set-states-alert"
            layout
          >
            <Alert severity="success">Action successfully executed.</Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Title variant="h1">
        <span>My home</span>
        <FilterIconButton onClick={toggleFilterExpanded}>
          <Badge
            variant="standard"
            badgeContent={hiddenDeviceTypesCount}
            color="error"
          >
            <Icon icon="tune" />
          </Badge>
        </FilterIconButton>
      </Title>

      <StyledExpandableChips
        expanded={filterExpanded}
        marginBottom={16}
        marginTop={24}
      >
        {deviceTypes.map(
          (type) =>
            !isHidden(type) && (
              <Chip
                key={type}
                icon={getIcon(type)}
                selected={selectedDeviceTypes.includes(type)}
                onClick={() => {
                  if (selectedDeviceTypes.includes(type)) {
                    setSelectedDeviceTypes((prev) => {
                      const newVal = prev.filter((t) => t !== type)
                      return newVal
                    })
                  } else {
                    setSelectedDeviceTypes((prev) => {
                      const newVal = [...prev, type]
                      return newVal
                    })
                  }
                }}
                onContextMenu={() => {
                  setSelectedDeviceTypes((prev) => {
                    const newVal =
                      prev.length === 1 && prev[0] === type
                        ? deviceTypes
                        : [type]
                    return newVal
                  })
                }}
              >
                {type}
              </Chip>
            )
        )}
      </StyledExpandableChips>

      <StatusContainer>
        <OpenedDevices />
        <HomeVitals />
      </StatusContainer>

      <LayoutGroup>
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
            <RoomTitle onContextMenu={setFavoriteRoomTo(roomName)} variant="h2">
              <a id={'#' + toKebabCase(roomName)}>{roomName}</a>
            </RoomTitle>
            <div className="shadow"></div>

            <StyledDeviceGrid>
              {devices.map(({ device, visible }) => (
                <DeviceCard device={device} key={device.id} visible={visible} />
              ))}
            </StyledDeviceGrid>
          </Room>
        ))}
      </LayoutGroup>

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
    </div>
  )
})

export default DevicesPage
