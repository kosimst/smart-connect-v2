import styled from '@emotion/styled'

export const SliderFlex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Fix = styled.div`
  display: inline-grid;

  & > * {
    grid-area: 1 / 1;
  }
`
