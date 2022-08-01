import { Connection } from '@iobroker/socket-client'
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import useScript from '../hooks/use-script'
import useIoBrokerUrl from './iobroker-url'

type SocketClientDisconnected = {
  connected: false
}

// @ts-ignore
interface SocketClientConnected extends Connection {
  connected: true
}

export type SocketClient = (
  | SocketClientDisconnected
  | SocketClientConnected
) & {
  reachable: boolean
}

const SocketClientContext = createContext<SocketClient>({
  connected: false,
  reachable: false,
})

export const SocketClientProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { url: ioBrokerUrl } = useIoBrokerUrl()

  const socketIoLoaded = useScript(
    ioBrokerUrl ? `https://${ioBrokerUrl}/lib/js/socket.io.js` : ''
  )

  const [connection, setConnection] = useState<SocketClient | null>(null)
  const [reachable, setReachable] = useState(false)

  useEffect(() => {
    if (!socketIoLoaded || !ioBrokerUrl || connection) {
      return
    }

    const socket = new Connection({
      host: ioBrokerUrl,
      port: 443,
      protocol: 'wss',
    })

    const handler = (connected: boolean) => {
      if (connected) {
        // @ts-ignore
        setConnection(socket)
      } else {
        setConnection(null)
      }
    }

    socket.registerConnectionHandler(handler)
  }, [socketIoLoaded, ioBrokerUrl, connection])

  useEffect(() => {
    if (!connection) {
      setReachable(false)
      return
    }

    const interval = setInterval(async () => {
      if (!connection.connected) {
        return
      }

      const newReachable = await Promise.race<boolean>([
        connection.getState('admin').then((res) => true),
        new Promise((resolve) => setTimeout(() => resolve(false), 500)),
      ])

      setReachable(newReachable)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  })

  const value = useMemo<SocketClient>(() => {
    if (!connection?.connected) {
      return {
        connected: false,
        reachable,
      }
    }

    return Object.assign(connection, {
      reachable,
    })
  }, [connection, reachable])

  return (
    <SocketClientContext.Provider value={value}>
      {children}
    </SocketClientContext.Provider>
  )
}

export const useSocketClient = () => useContext(SocketClientContext)

export default SocketClientContext
