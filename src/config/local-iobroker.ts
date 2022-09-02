// Controls how many states will be fetched in one call at max
export const MAX_BULK_GET_SIZE = 15

// How often devices will be fetched (ms)
export const DEVICES_REFETCH_INTERVAL = 30_000

// How often low priority states will be fetched (ms)
export const LOW_PRIORITY_REFETCH_INTERVAL = 5_000

// How often background priority states will be fetched (ms)
export const BACKGROUND_PRIORITY_REFETCH_INTERVAL = 7_500

// How often high priority states will be fetched (ms)
export const HIGH_PRIORITY_REFETCH_INTERVAL = 500

// How often states will be fetched (ms)
export const STATE_REFETCH_INTERVAL = 3_000

// How long fetch of recently subscribed states will be debounced (ms)
export const SUBSCRIPTION_FETCH_DEBOUNCE_INTERVAL = 250

// How often states of a device will be re-fetched
export const DEVICE_STATE_REFETCH_COUNT = 5

// Delay between re-fetches of a device's states
export const DEVICE_STATE_REFETCH_DELAY = 333
