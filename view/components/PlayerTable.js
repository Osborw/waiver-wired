import { Row, TitleRow } from './Row'
import { useState, useEffect } from 'react'

export default ({ players, position, timeFrame, view, myOwnerId }) => {
  const [allVisible, toggleAllVisible] = useState(true)

  //Resets visibility of indv graphs when players change
  useEffect(() => {
    toggleAllVisible(!allVisible)
  }, [players])


  return (
    <div>
      <TitleRow position={position} timeFrame={timeFrame} view={view} toggleAllVisible={() => toggleAllVisible(!allVisible)} />
      {players.map((p, idx) => {
        const displayPosition = position === 'FLEX' ? p.fantasyPositions[0] : position
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
