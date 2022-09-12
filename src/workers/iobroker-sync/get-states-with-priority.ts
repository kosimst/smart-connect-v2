import { SubscriptionPriority } from '.'

const getStatesWithPriority = (
  subscriptions: Map<
    string,
    {
      high?: Set<string>
      medium?: Set<string>
      low?: Set<string>
      background?: Set<string>
    }
  >,
  priority: SubscriptionPriority
) => {
  const priorityOrder = [
    'high',
    'medium',
    'low',
    'background',
  ] as SubscriptionPriority[]

  const states = new Set<string>()

  for (const [state, priorities] of subscriptions) {
    for (const priorityEntry of priorityOrder) {
      if (priorityEntry !== priority) {
        continue
      }

      const higherPriorities = priorityOrder.slice(
        0,
        priorityOrder.indexOf(priorityEntry)
      )
      const hasHigherPriority = higherPriorities.some(
        (higherPriority) => !!priorities[higherPriority]?.size
      )

      if (hasHigherPriority) {
        break
      }

      if (priorityEntry === priority && priorities[priorityEntry]?.size) {
        states.add(state)
        break
      }
    }
  }

  return states
}

export default getStatesWithPriority
