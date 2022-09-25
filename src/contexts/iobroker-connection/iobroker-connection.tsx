import { Connection } from '@iobroker/socket-client'
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { IOBROKER_PROXY_HOST } from '../../constants/iobroker-proxy'
import sleep from '../../helpers/sleep'
import useLocalStorage from '../../hooks/use-local-storage'

export type IoBrokerCredentials = {
  host: string
  cfAccessClientId: string
  cfAccessClientSecret: string
}

export const IoBrokerConnectionContext = createContext({
  connect: (credentials: IoBrokerCredentials) => {},
  connecting: false,
  connection: null as Connection | null,
  disconnect: () => {},
  error: null as Error | null,
  valid: false,
  credentials: null as IoBrokerCredentials | null,
})

const getConnectionDetailsHash = (
  host: string,
  port: string,
  protocol: string
) => `host=${host}&port=${port}&protocol=${protocol}`

const connectionsMap = new Map<string, Connection>()

const getConnection = (host: string, port: string, protocol: string) => {
  const hash = getConnectionDetailsHash(host, port, protocol)
  if (!connectionsMap.has(hash)) {
    connectionsMap.set(hash, new Connection({ host, port, protocol }))
  }
  return connectionsMap.get(hash)!
}

export const IoBrokerConnectionProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [credentials, setCredentials] = useLocalStorage(
    'iobroker-credentials',
    null as IoBrokerCredentials | null
  )
  const [valid, setValid] = useLocalStorage('iobroker-credentials-valid', false)

  const [connection, setConnection] = useState<Connection | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const setupConnection = useCallback(async () => {
    if (!credentials) {
      return
    }

    setConnecting(true)

    try {
      const { host, cfAccessClientId, cfAccessClientSecret } = credentials

      const newConnection = getConnection(
        IOBROKER_PROXY_HOST,
        `443?host=${host}&clientId=${cfAccessClientId}&clientSecret=${cfAccessClientSecret}`,
        'wss'
      )

      const result = await Promise.race([
        newConnection
          .waitForFirstConnection()
          .then(() => 'Success')
          .catch(() => 'Failed to connect'),
        sleep(5000).then(() => 'Timed out'),
      ])

      if (result === 'Success') {
        setConnection(newConnection)
        setValid(true)
        setError(null)
      } else {
        setError(new Error(result))
      }
    } catch (error) {
      setError(new Error('Failed to connect'))
    } finally {
      setConnecting(false)
    }
  }, [])

  useEffect(() => {
    if (credentials) {
      setupConnection()
    } else {
      setConnection(null)
      setValid(false)
      setError(null)
    }
  }, [credentials, setupConnection])

  useEffect(() => {
    if (!valid || !error || connecting || connection) {
      return
    }

    const timeout = setTimeout(() => {
      setupConnection()
    }, 3000)

    return () => {
      clearTimeout(timeout)
    }
  }, [valid, setupConnection, error, connecting, connection])

  const connect = useCallback((credentials: IoBrokerCredentials) => {
    setCredentials(credentials)
  }, [])

  const disconnect = useCallback(() => {
    setCredentials(null)
  }, [])

  return (
    <IoBrokerConnectionContext.Provider
      value={{
        connect,
        connection,
        disconnect,
        connecting,
        error,
        valid,
        credentials,
      }}
    >
      {children}
    </IoBrokerConnectionContext.Provider>
  )
}

const useIoBrokerConnection = () => useContext(IoBrokerConnectionContext)

export default useIoBrokerConnection
