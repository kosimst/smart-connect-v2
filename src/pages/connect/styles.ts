import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 16px;
  margin: auto;
  max-width: 500px;

  @media (min-width: 500px) {
    margin-top: 4vw;

    & > *:first-child {
      margin-bottom: 1vw;
    }
  }
`

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
`
