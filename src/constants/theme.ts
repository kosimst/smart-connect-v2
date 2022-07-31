export type Theme = typeof lightTheme

export const lightTheme = {
  palette: {
    background: '#fff',
    chip: '#616161',
  },
}

export const darkTheme: Theme = { ...lightTheme }
