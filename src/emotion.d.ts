import '@emotion/react'
import { Theme as CustomTheme } from './constants/theme'

declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}
