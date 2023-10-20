import { CalculatedPlayer, SearchPosition } from '../../shared/types'
import { convertSearchPositionToSleeperPosition } from '../../shared/position-logic'
import { Row, TitleRow } from './Row'
import { useState, useEffect } from 'react'
import { TimeFrame } from './TimeFrameSelector'
import { View } from './ViewSelector'

interface PlayerTableProps {
  players: CalculatedPlayer[]
  position: SearchPosition
  timeFrame: TimeFrame
  view: View
  myOwnerId?: string
}

export default ({ players, position, timeFrame, view, myOwnerId }: PlayerTableProps) => {
  const [allVisible, toggleAllVisible] = useState(true)

  //Resets visibility of indv graphs when players change
  useEffect(() => {
    toggleAllVisible(!allVisible)
  }, [players])


  return (
    <div>
      <TitleRow position={position} timeFrame={timeFrame} view={view} toggleAllVisible={() => toggleAllVisible(!allVisible)} />
      {players.map((p, idx) => {
        const displayPosition = position === SearchPosition.FLEX ? p.fantasyPositions[0] : convertSearchPositionToSleeperPosition(position)
        return (
          <Row
            selectedPosition={position}
            key={idx + 1}
            rank={idx + 1}
            name={p.fullName}
            position={displayPosition}
            gamesPlayed={p.gp}
            avg={p.avgPoints}
            ownerId={p.ownerId}
            weeks={p.weeklyStats}
            stdDev={p.stdDev}
            allVisible={allVisible}
            timeFrame={timeFrame}
            myOwnerId={myOwnerId}
          />
        )
      })}
    </div>
  )
}
