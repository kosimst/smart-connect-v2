import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export const IoBrokerUrlContext = createContext({
  url: '',
  setUrl: (newUrl: string) => {},
  connected: false,
  ready: false,
})

export const IoBrokerUrlProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [url, setUrlState] = useState('192.168.0.15')
  const [connected, setConnected] = useState(false)
  const [ready, setReady] = useState(false)

  const setUrl = useCallback((newUrl: string) => {
    setUrlState(newUrl)
    localStorage.setItem('iobroker-url', newUrl)
  }, [])

  /*useEffect(() => {
    const savedUrl = localStorage.getItem('iobroker-url')

    setReady(true)

    if (!savedUrl) {
      return
    }

    setUrlState(savedUrl)
  }, [])*/

  return (
    <IoBrokerUrlContext.Provider
      value={{
        url,
        setUrl,
        connected,
        ready,
      }}
    >
      {children}
    </IoBrokerUrlContext.Provider>
  )
}

const useIoBrokerUrl = () => useContext(IoBrokerUrlContext)

export default useIoBrokerUrl
