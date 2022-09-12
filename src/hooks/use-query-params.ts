import { useCallback, useEffect, useState } from 'react'
import randomUUID from '../helpers/randomUUID'

const useQueryParams = () => {
  const [queryParams, setQueryParamsState] = useState<Record<string, string>>(
    {}
  )

  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search)

    setQueryParamsState(Object.fromEntries(params))
  }, [])

  useEffect(() => {
    updateQueryParams()

    window.addEventListener('popstate', updateQueryParams)

    return () => {
      window.removeEventListener('popstate', updateQueryParams)
    }
  }, [updateQueryParams])

  const setQueryParams = useCallback(
    (params: Record<string, string>) => {
      const searchParams = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value !== undefined)
      )

      const isEmpty = !searchParams.toString()

      window.history.pushState(
        {},
        '',
        `${window.location.pathname}${isEmpty ? '' : '?'}${searchParams}`
      )

      updateQueryParams()
    },
    [updateQueryParams]
  )

  return { queryParams, setQueryParams }
}

export default useQueryParams
