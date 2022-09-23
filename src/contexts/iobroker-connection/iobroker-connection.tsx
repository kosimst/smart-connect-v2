import { Connection } from '@iobroker/socket-client'
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
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

  useEffect(() => {
    const setupConnection = async () => {
      setConnecting(true)

      try {
        const { host, cfAccessClientId, cfAccessClientSecret } = credentials!

        const newConnection = new Connection({
          host: IOBROKER_PROXY_HOST,
          port: `443?host=${host}&clientId=${cfAccessClientId}&clientSecret=${cfAccessClientSecret}`,
          protocol: 'wss',
        })

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
    }

    if (credentials) {
      setupConnection()
    } else {
      setConnection(null)
      setValid(false)
      setError(null)
    }
  }, [credentials])

  const connect = useCallback((credentials: IoBrokerCredentials) => {
    console.log('connect', credentials)

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
