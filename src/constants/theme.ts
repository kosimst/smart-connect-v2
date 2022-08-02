import { createTheme } from '@mui/material'
import { teal } from '@mui/material/colors'

const baseTheme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Google Sans',
    },
    h1: {
      fontSize: '3rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
    },
  },
  palette: {
    primary: teal,
  },
})

export default baseTheme

export const lightTheme = {
  palette: {
    background: '#fff',
    chip: '#616161',
  },
}

export const darkTheme = { ...lightTheme }
