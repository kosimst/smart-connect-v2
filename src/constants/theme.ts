import { createTheme } from '@mui/material'
import { teal } from '@mui/material/colors'

const baseTheme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Google Sans',
    },
    h1: {
      fontSize: '2.5rem',
    },
    h2: {
      fontSize: '1.75rem',
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
