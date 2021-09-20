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
  width: ${props => props.inputSize || SmallNumberFieldLength};
  color: ${props => props.inputColor || 'black'};
  text-align: center;
`

export const TitleRow = ({ position, timeFrame, view, toggleAllVisible }) => {
  return (
    <TitleRowComponent>
      <Cell>{'Rank'}</Cell>
      {position === 'FLEX' && <Cell>{'Position'}</Cell>}
      <Cell inputSize={NameFieldLength}>{'Name'}</Cell>
      <Cell>{'Games Played'}</Cell>
      <Cell inputSize={AvgPPRFieldLength}>{'Average PPR'}</Cell>
      <Cell inputSize={AvgPPRFieldLength}>{'Standard Deviation'}</Cell>
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

const ownedButNotByMe = ownerId => {
  return ownerId && ownerId !== '471674442926256128'
}

const NameField = ({ name, ownerId }) => {
  return (
    <div>
      {ownerId === '471674442926256128' && (
        <Cell inputColor='green' inputSize={NameFieldLength}>
          {name}
        </Cell>
      )}
      {ownedButNotByMe(ownerId) && (
        <Cell inputSize={NameFieldLength}>{name}</Cell>
      )}
      {!ownerId && (
        <Cell inputColor='blue' inputSize={NameFieldLength}>
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
        <NameField name={name} ownerId={ownerId} />
        {gamesPlayed && <Cell>{gamesPlayed}</Cell>}
        <Cell inputSize={AvgPPRFieldLength}>{avg ? avg.toFixed(2) : 0}</Cell>
        <Cell inputSize={AvgPPRFieldLength}>
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
