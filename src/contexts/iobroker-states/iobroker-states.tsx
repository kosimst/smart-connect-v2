import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import ioBrokerDb from '../../db/iobroker-db'
import randomUUID from '../../helpers/randomUUID'
import IoBrokerSync, { SubscriptionPriority } from '../../workers/iobroker-sync'
import Device from '../../types/device'
import useIoBrokerConnection from '../iobroker-connection'
import { BinaryStateChangeHandler } from '@iobroker/socket-client'

type IoBrokerStates = {
  subscribeState(id: string, cb: (val: any) => void): Promise<() => void>
  updateState(id: string, val: any): void
}

const IoBrokerStatesContext = createContext<IoBrokerStates>({
  subscribeState: () => {
    throw new Error('State provider not initialized yet')
  },
  updateState: () => {
    throw new Error('State provider not initialized yet')
  },
})

export const IoBrokerStatesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { connection } = useIoBrokerConnection()

  const updateState = useCallback(
    async function (id: string, value: any) {
      if (!connection) {
        throw new Error('Not connected to ioBroker')
      }

      await connection.setState(id, {
        val: value,
      })
    },
    [connection]
  )

  const subscribeState = useCallback(
    async (id: string, cb: (val: any) => void) => {
      if (!connection) {
        throw new Error('Not connected to ioBroker')
      }

      const usedCb = (id: string, state: any) => {
        if (!state) {
          return
        }

        cb(state.val)
      }

      await connection.subscribeState(id, usedCb)

      return () => {
        connection.unsubscribeState(id, usedCb)
      }
    },
    [connection]
  )

  return (
    <IoBrokerStatesContext.Provider
      value={{
        subscribeState,
        updateState,
      }}
    >
      {children}
    </IoBrokerStatesContext.Provider>
  )
}

export const useIoBrokerStates = () => useContext(IoBrokerStatesContext)

export default IoBrokerStatesContext
