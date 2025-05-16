import React from 'react'
import styled from 'styled-components'

const CenteredDiv = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const SpinnerAnimation = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 5px solid #D969E7;
  border-radius: 50%;
  border-top-color: #780087;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { -webkit-transform: rotate(360deg); }
  }
  @-webkit-keyframes spin {
    to { -webkit-transform: rotate(360deg); }
  }
`

export const Spinner = () => {
  return (
    <CenteredDiv>
      <SpinnerAnimation> </SpinnerAnimation>
      <p>Loading Information for your League...</p>
    </CenteredDiv>
  )
}