import { ThemeProvider } from '@emotion/react'
import { useMediaQuery } from '@mui/material'
import { createContext, FC, ReactNode, useContext } from 'react'
import { darkTheme, lightTheme } from '../../constants/theme'
import useLocalStorage from '../../hooks/use-local-storage'

export const ThemeSwitcherContext = createContext({
  theme: 'light',
  setTheme: (theme: 'light' | 'dark') => {},
})

export const ThemeSwitcherProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const isSystemDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const [theme, setTheme] = useLocalStorage(
    'theme',
    isSystemDarkMode ? 'dark' : ('light' as 'light' | 'dark')
  )

  const usedTheme = theme === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeSwitcherContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={usedTheme}>{children}</ThemeProvider>
    </ThemeSwitcherContext.Provider>
  )
}

const useThemeSwitcher = () => useContext(ThemeSwitcherContext)

export default useThemeSwitcher
