import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  Cell,
  Dot,
} from 'recharts'
import { TopPlayersGraphTooltip } from './GraphTooltip'
import { TieredPlayer, SearchPosition } from '../../shared/types'
import { ScatterCustomizedShape } from 'recharts/types/cartesian/Scatter'
import { styled } from 'styled-components'

const GraphDiv = styled.div`
  max-width: 850px;
  overflow-x: scroll;
  overflow-y: hidden;
`

interface PlayerGraphProps {
  players: TieredPlayer[]
  position: SearchPosition
  myOwnerId?: string
}

const determineWidth = (players: TieredPlayer[]) => {
  const width = 650
  const playersWidth = players.length * 8

  return width < playersWidth ? playersWidth : width
}

export default ({ players, position, myOwnerId }: PlayerGraphProps) => {

  const isFlexPosition = () => {
    return position === SearchPosition.FLEX 
  }

  const determineColor = (ownerId: string | null) => {
    if (ownerId === myOwnerId) return 'green'
    else if (ownerId) return 'black'
    else return 'blue'
  }

  const datum = players.map((p, idx) => {
    return {
      x: idx + 1,
      y: p.avgPoints,
      label: p.fullName,
      color: determineColor(p.ownerId),
    }
  })

  return (
    <GraphDiv>
      <ScatterChart
        width={determineWidth(players)}
        height={400}
        margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
      >
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis dataKey='x' name='rank' domain={isFlexPosition() ? [0, 100] : [0,50]}/>
        <YAxis dataKey='y' name='avgPoints' interval={'preserveStartEnd'}/>
        <Tooltip
          content={TopPlayersGraphTooltip}
        />
        <Scatter name='Players' data={datum} fill='#8884d8' shape={RenderDot}></Scatter>
      </ScatterChart>
    </GraphDiv>
  )
}

const RenderDot: ScatterCustomizedShape = ({ cx, cy, payload }) => {
  return (
    <Dot cx={cx} cy={cy} fill={payload.color} r={4} />
  )
}