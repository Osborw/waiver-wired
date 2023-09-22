import IndividualGraph from './IndividualGraph'
import styled from 'styled-components'
import { useState, useEffect } from 'react'

const NameFieldLength = '200px'
const AvgPPRFieldLength = '120px'
const SmallNumberFieldLength = '80px'

const TitleRowComponent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  fontweight: bold;
`

const RowComponent = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`

const Cells = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 0.5px solid #c7c7c7;
  margin-top: 0.5px;
  margin-bottom: 0.5px;
`
const Graph = styled.div`
  display: flex;
  flex-direction: column;
`

const Cell = styled.div`
  margintop: 2px;
  marginbottom: 2px;
  marginleft: 10px;
  marginright: 10px;
  width: ${props => props.inputsize || SmallNumberFieldLength};
  color: ${props => props.inputcolor || 'black'};
  text-align: center;
`

export const TitleRow = ({ position, timeFrame, view, toggleAllVisible }) => {
  return (
    <TitleRowComponent>
      <Cell>{'Rank'}</Cell>
      {position === 'FLEX' && <Cell>{'Position'}</Cell>}
      <Cell inputsize={NameFieldLength}>{'Name'}</Cell>
      <Cell>{'Games Played'}</Cell>
      <Cell inputsize={AvgPPRFieldLength}>{'Average PPR'}</Cell>
      <Cell inputsize={AvgPPRFieldLength}>{'Standard Deviation'}</Cell>
      <Cell>
        <button
          onClick={() => toggleAllVisible()}
        >
          ^ Close All ^
        </button>
      </Cell>
    </TitleRowComponent>
  )
}

const ownedButNotByMe = (ownerId, myOwnerId) => {
  return ownerId && ownerId !== myOwnerId 
}

const NameField = ({ name, ownerId, myOwnerId }) => {
  return (
    <div>
      {ownerId === myOwnerId && (
        <Cell inputcolor='green' inputsize={NameFieldLength}>
          {name}
        </Cell>
      )}
      {ownedButNotByMe(ownerId, myOwnerId) && (
        <Cell inputsize={NameFieldLength}>{name}</Cell>
      )}
      {!ownerId && (
        <Cell inputcolor='blue' inputsize={NameFieldLength}>
          {name}
        </Cell>
      )}
    </div>
  )
}

export const Row = ({
  selectedPosition,
  rank,
  name,
  position,
  gamesPlayed,
  avg,
  ownerId,
  weeks,
  stdDev,
  allVisible,
  timeFrame,
  myOwnerId,
}) => {
  const [individualGraphVisible, toggleIndividualGraphVisibility] = useState(
    false,
  )

  //all Visible changes when someone click the close all button
  useEffect(() => {
    toggleIndividualGraphVisibility(false)
  }, [allVisible])

  return (
    <RowComponent
      onClick={() => toggleIndividualGraphVisibility(!individualGraphVisible)}
    >
      <Cells>
        <Cell>{rank}</Cell>
        {selectedPosition === 'FLEX' && <Cell>{position}</Cell>}
        <NameField name={name} ownerId={ownerId} myOwnerId={myOwnerId} />
        {gamesPlayed && <Cell>{gamesPlayed}</Cell>}
        <Cell inputsize={AvgPPRFieldLength}>{avg ? avg.toFixed(2) : 0}</Cell>
        <Cell inputsize={AvgPPRFieldLength}>
          {(gamesPlayed > 1 && stdDev) ? stdDev.toFixed(2) : '------'}
        </Cell>
        <Cell>{individualGraphVisible ? ' ˄ ' : ' ˅ '}</Cell>
      </Cells>
      {individualGraphVisible && (
        <Graph>
          {
            <IndividualGraph
              weeks={weeks}
              avg={avg}
              stdDev={gamesPlayed > 1 ? stdDev : null}
              position={selectedPosition}
              timeFrame={timeFrame}
            />
          }
        </Graph>
      )}
    </RowComponent>
  )
}
