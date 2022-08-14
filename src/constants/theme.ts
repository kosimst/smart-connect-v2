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
  },
  shadows: Array(10).fill('none') as Shadows,
})

export default baseTheme

export const lightTheme = {
  palette: {
    background: '#fff',
    chip: '#616161',
  },
}

export const darkTheme = { ...lightTheme }
