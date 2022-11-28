import { Row, TitleRow } from './Row'
import { useState, useEffect } from 'react'

export default ({ players, position, timeFrame, view }) => {
  const [allVisible, toggleAllVisible] = useState(true)

  //Resets visibility of indv graphs when players change
  useEffect(() => {
    toggleAllVisible(!allVisible)
  }, [players])


  return (
    <div>
      <TitleRow position={position} timeFrame={timeFrame} view={view} toggleAllVisible={() => toggleAllVisible(!allVisible)} />
      {players.map((p, idx) => {
        return (
          <Row
            selectedPosition={position}
            key={idx + 1}
            rank={idx + 1}
            name={p.name}
            position={p.position}
            gamesPlayed={p.gamesPlayed}
            avg={p.avgPoints}
            ownerId={p.ownerId}
            weeks={p.weeks}
            stdDev={p.stdDev}
            allVisible={allVisible}
            timeFrame={timeFrame}
          />
        )
      })}
    </div>
  )
}
