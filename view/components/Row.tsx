import IndividualGraph from './IndividualGraph'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { SearchPosition, SleeperPosition, WeeklyStats } from '../../shared/types'
import { TimeFrame } from './TimeFrameSelector'
import { View } from './ViewSelector'

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

const Cells = styled.div<{ color?: string }>`
  display: flex;
  flex-direction: row;
  border-bottom: 0.5px solid #c7c7c7;
  margin-top: 0.5px;
  margin-bottom: 0.5px;
  background: ${props => props.color || 'white'}
`
const Graph = styled.div`
  display: flex;
  flex-direction: column;
`

const Cell = styled.div<{ inputsize?: string, inputcolor?: string }>`
  margintop: 2px;
  marginbottom: 2px;
  marginleft: 10px;
  marginright: 10px;
  width: ${props => props.inputsize || SmallNumberFieldLength};
  color: ${props => props.inputcolor || 'black'};
  text-align: center;
`

interface TitleRowProps {
  position: SearchPosition
  timeFrame: TimeFrame
  view: View
  toggleAllVisible: () => void
}

export const TitleRow = ({ position, timeFrame, view, toggleAllVisible }: TitleRowProps) => {
  return (
    <TitleRowComponent>
      <Cell>{'Rank'}</Cell>
      {position === 'FLEX' && <Cell>{'Position'}</Cell>}
      <Cell inputsize={NameFieldLength}>{'Name'}</Cell>
      <Cell>{'Games Played'}</Cell>
      <Cell inputsize={AvgPPRFieldLength}>{'Average PPR'}</Cell>
      <Cell inputsize={AvgPPRFieldLength}>{'Standard Deviation'}</Cell>
      <Cell inputsize={AvgPPRFieldLength}>{'Tier'}</Cell>
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

const ownedButNotByMe = (ownerId: string | null, myOwnerId?: string) => {
  return ownerId && ownerId !== myOwnerId
}

interface NameFieldProps {
  name: string
  ownerId: string | null
  myOwnerId?: string
}

const NameField = ({ name, ownerId, myOwnerId }: NameFieldProps) => {
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

const determineTierColor = (tier: number) => {
  if(tier % 2 === 0) return 'white'
  if(tier % 2 === 1) return '#f2f2f2'
}

interface RowProps {
  selectedPosition: SearchPosition
  rank: number
  name: string
  position: SleeperPosition
  gamesPlayed: number
  avg: number
  ownerId: string | null
  weeks: WeeklyStats[]
  stdDev: number
  allVisible: boolean
  timeFrame: TimeFrame
  myOwnerId?: string
  tier: number
  tierDiff?: number
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
  tier,
  tierDiff
}: RowProps) => {
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
      <Cells 
        color={determineTierColor(tier)} 
      >
        <Cell>{rank}</Cell>
        {selectedPosition === SearchPosition.FLEX && <Cell>{position}</Cell>}
        <NameField name={name} ownerId={ownerId} myOwnerId={myOwnerId} />
        <Cell>{gamesPlayed}</Cell>
        <Cell inputsize={AvgPPRFieldLength}>{avg ? avg.toFixed(2) : 0}</Cell>
        <Cell inputsize={AvgPPRFieldLength}>
          {(gamesPlayed > 1 && stdDev) ? stdDev.toFixed(2) : '------'}
        </Cell>
        <Cell inputsize={AvgPPRFieldLength}> {tierDiff ? -tierDiff.toFixed(0): ''} </Cell>
        <Cell>{individualGraphVisible ? ' ˄ ' : ' ˅ '}</Cell>
      </Cells>
      {individualGraphVisible && (
        <Graph>
          {
            <IndividualGraph
              weeks={weeks}
              avg={avg}
              stdDev={stdDev}
              position={selectedPosition}
              timeFrame={timeFrame}
            />
          }
        </Graph>
      )}
    </RowComponent>
  )
}
