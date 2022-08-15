import styled from '@emotion/styled'

export const Container = styled.div`
  width: 100%;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 16px;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 32px auto;
`

export const StatusText = styled.span`
  box-sizing: border-box;
  padding: 0 8px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: space-between;

  & > * {
    color: rgba(0, 0, 0, 0.54);

    &:first-child {
      justify-self: start;
    }

    &:nth-child(2) {
      display: grid;
      width: 100%;
      text-align: center;

      & > * {
        grid-area: 1 / 1;
      }
    }
  }
`
