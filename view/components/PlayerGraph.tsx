import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  Cell,
} from 'recharts'
import { TopPlayersGraphTooltip } from './GraphTooltip'
import { CalculatedPlayer, SearchPosition } from '../../shared/types'

interface PlayerGraphProps {
  players: CalculatedPlayer[]
  position: SearchPosition
  myOwnerId?: string
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
    <div>
      <ScatterChart
        width={isFlexPosition() ? 1300 : 650}
        height={400}
        margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
      >
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis dataKey='x' name='rank' domain={isFlexPosition() ? [0, 100] : [0,50]}/>
        <YAxis dataKey='y' name='avgPoints' interval={'preserveStartEnd'}/>
        <Tooltip
          content={TopPlayersGraphTooltip}
        />
        <Scatter name='Players' data={datum} fill='#8884d8'>
          {datum.map((entry, index) => {
            return (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            )
          })}
        </Scatter>
      </ScatterChart>
    </div>
  )
}