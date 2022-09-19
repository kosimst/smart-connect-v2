import { createTheme, Shadows } from '@mui/material'
import { blueGrey } from '@mui/material/colors'

export const lightTheme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Google Sans',
      lineHeight: 1,
    },
    h1: {
      fontSize: '2.25rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: 22,
      fontWeight: 500,
      marginBottom: 8,
    },
    h3: {
      fontSize: 19,
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: 15,
    },
  },

  palette: {
    primary: blueGrey,
    mode: 'light',
    text: {
      primary: '#000',
      secondary: 'rgba(0, 0, 0, 0.9)',
      disabled: 'rgba(0, 0, 0, 0.5)',
    },
  },
  // shadows: Array(10).fill('none') as Shadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px',
          boxShadow: 'none',
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1f1f1f',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.9)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
})

export type Theme = typeof lightTheme
