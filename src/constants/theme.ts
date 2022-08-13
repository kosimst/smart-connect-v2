import { createTheme, Shadows } from '@mui/material'
import { blueGrey } from '@mui/material/colors'

const baseTheme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Google Sans',
      lineHeight: 1,
    },
    h1: {
      fontSize: '2.5rem',
    },
    h2: {
      fontSize: 24,
      fontWeight: 600,
      marginBottom: 8,
    },
    h3: {
      fontSize: 20,
      fontWeight: 600,
    },
  },
  palette: {
    primary: blueGrey,
  },
  shadows: Array(25).fill('none') as Shadows,
})

export default baseTheme

export const lightTheme = {
  palette: {
    background: '#fff',
    chip: '#616161',
  },
}

export const darkTheme = { ...lightTheme }
