import Device from '../../../types/device'

export type DataText = {
  text: string
  id: string
}

type DataHook = (device: Device) => {
  texts?: DataText[]
  sliderValue?: number
  toggleValue?: boolean
  onSliderChange?: (value: number) => void
  onToggleChange?: (value: boolean) => void
}

export default DataHook
