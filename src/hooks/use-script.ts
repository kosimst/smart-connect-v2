import { useEffect, useMemo, useState } from 'react'

const useScript = (src: string) => {
  const [loaded, setLoaded] = useState(false)

  const isAlreadyPresent = useMemo(
    () => !!document.querySelector(`script[src="${src}"]`),
    [src]
  )

  useEffect(() => {
    if (!src) {
      return
    }

    if (isAlreadyPresent) {
      setLoaded(true)
      return
    }

    const scriptElmnt = document.createElement('script')

    const onLoad = () => {
      setLoaded(true)

      scriptElmnt.removeEventListener('load', onLoad)
    }

    scriptElmnt.addEventListener('load', onLoad)

    scriptElmnt.src = src
    document.body.appendChild(scriptElmnt)
  }, [src])

  return loaded
}

export default useScript
