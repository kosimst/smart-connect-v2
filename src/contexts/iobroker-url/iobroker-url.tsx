import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Button, Container, Input, Row, Subtitle, Title } from './styles'

export const IoBrokerUrlContext = createContext({
  url: '',
  setUrl: (newUrl: string) => {},
})

export const IoBrokerUrlProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [url, setUrlState] = useState('')

  const setUrl = useCallback((newUrl: string) => {
    setUrlState(newUrl)
    localStorage.setItem('iobroker-url', newUrl)
  }, [])

  useEffect(() => {
    const savedUrl = localStorage.getItem('iobroker-url')

    if (!savedUrl) {
      return
    }

    setUrlState(savedUrl)
  }, [])

  const [input, setInput] = useState('')
  const submit = useCallback(async () => {
    if (input !== '192.168.0.15') {
      return
    }

    setUrl(input)
  }, [input])

  return url ? (
    <IoBrokerUrlContext.Provider
      value={{
        url,
        setUrl,
      }}
    >
      {children}
    </IoBrokerUrlContext.Provider>
  ) : (
    <Container>
      <Title>Hey there!</Title>

      <Subtitle>Welcome to Smart Connect!</Subtitle>

      <Row>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={submit}>Go!</Button>
      </Row>
    </Container>
  )
}

const useIoBrokerUrl = () => useContext(IoBrokerUrlContext)

export default useIoBrokerUrl
