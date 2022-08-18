import { act, renderHook } from '@testing-library/react'

import useIsOffline from './use-is-offline'

describe('useIsOffline', () => {
  it('should return true initially of offline', () => {
    vi.stubGlobal('navigator', {
      onLine: false,
    })

    const offline = renderHook(() => useIsOffline())

    expect(offline.result.current).toBe(true)
  })

  it('should return false initially of online', () => {
    vi.stubGlobal('navigator', {
      onLine: true,
    })

    const offline = renderHook(() => useIsOffline())

    expect(offline.result.current).toBe(false)
  })

  it('should add and remove event listeners', () => {
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')

    const offline = renderHook(() => useIsOffline())

    expect(window.addEventListener).toHaveBeenNthCalledWith(
      1,
      'online',
      expect.any(Function)
    )
    expect(window.addEventListener).toHaveBeenNthCalledWith(
      2,
      'offline',
      expect.any(Function)
    )

    offline.unmount()

    expect(window.removeEventListener).toHaveBeenNthCalledWith(
      1,
      'online',
      expect.any(Function)
    )
    expect(window.removeEventListener).toHaveBeenNthCalledWith(
      2,
      'offline',
      expect.any(Function)
    )
  })

  it('should update when online to offline', () => {
    vi.stubGlobal('navigator', {
      onLine: true,
    })

    const listeners: {
      [key: string]: (...args: any[]) => void
    } = {}

    vi.stubGlobal('addEventListener', (event: string, listener: () => void) => {
      listeners[event] = listener
    })

    const offline = renderHook(() => useIsOffline())

    expect(offline.result.current).toBe(false)

    act(() => listeners['offline']())

    expect(offline.result.current).toBe(true)
  })

  it('should update when offline to online', () => {
    vi.stubGlobal('navigator', {
      onLine: false,
    })

    const listeners: {
      [key: string]: (...args: any[]) => void
    } = {}

    vi.stubGlobal('addEventListener', (event: string, listener: () => void) => {
      listeners[event] = listener
    })

    const offline = renderHook(() => useIsOffline())

    expect(offline.result.current).toBe(true)

    act(() => listeners['online']())

    expect(offline.result.current).toBe(false)
  })
})
