import { MAX_BULK_GET_SIZE } from '../../../config/local-iobroker'
import ioBrokerDb from '../../../db/iobroker-db'
import nSizedChunks from '../../../helpers/n-sized-chunks'
import Credentials from '../../../types/credentials'

const fetchStates = async (stateIds: string[], credentials: Credentials) => {
  if (!credentials || !stateIds.length) {
    return
  }

  const { url, cfClientId, cfClientSecret } = credentials

  const chunks = nSizedChunks(stateIds, MAX_BULK_GET_SIZE)

  for (const chunk of chunks) {
    const path = '/getBulk/' + chunk.join(',')

    try {
      const response = await fetch(`https://${url}${path}`, {
        headers: {
          'CF-Access-Client-Id': cfClientId,
          'CF-Access-Client-Secret': cfClientSecret,
        },
      })

      if (response.status !== 200) {
        return
      }

      const json = await response.json()
      const newStates = json
        .filter(({ id }: any) => !!id)
        .map(({ id, val: value }: any) => ({
          id,
          value,
          ts: new Date(),
          role: id.split('.').at(-1),
        })) as {
        id: string
        value: any
        ts: Date
        role: string
      }[]

      await ioBrokerDb.states.bulkPut(newStates)
    } catch (error) {
      console.error(error)
    }
  }
}

export default fetchStates
