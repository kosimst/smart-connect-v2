import { createTheme } from '@mui/material'
import { blueGrey } from '@mui/material/colors'

export const lightTheme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Google Sans',
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
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 99,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none !important',
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
      default: '#1E2022',
      paper: '#303134',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.9)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#303134',
          border: 'none',
        },
      },
    },
  },
})

export type Theme = typeof lightTheme
