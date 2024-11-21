import React from 'react'
import { ContentType } from 'recharts/types/component/Tooltip'
import styled from 'styled-components'

const Tooltip = styled.div`
  background-color: #f7f7f7;
  border: 2px solid;
  border-radius: 15px;
`
const Words = styled.div`
  padding: 10px;
`

export const IndividualGraphTooltip = (props: any) => {
  if (!props.active) {
    return null
  }
  const { payload } = props
  return (
    <Tooltip>
      <Words>
        {payload[0] ? (
          <>
            <div>{`Week ${payload[0].payload.x}`}</div>
            <div>{payload[0].payload.y != undefined ? `${payload[0].payload.y.toFixed(2)}` : 'Not Active'}</div>
          </>
        ) : (
          <div>{`Not Active`}</div>
        )}
      </Words>
    </Tooltip>
  )
}

export const TopPlayersGraphTooltip = (props: any) => {
  if (!props.active) {
    return null
  }
  const { payload } = props
  return (
    <Tooltip>
      <Words>
          <>
            <div>{`${payload[0].payload.label}`}</div>
            <div>{`${payload[0].payload.y.toFixed(2)}`}</div>
          </>
      </Words>
    </Tooltip>
  ) 
}
