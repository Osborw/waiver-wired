import React from 'react'
import { TieredPlayer, SearchPosition, Roster, TimeFrame } from '../../../shared/types'
import { convertSearchPositionToSleeperPosition, isFlexPosition } from '../../../shared/position-logic'
import { RosterRow, RosterTitleRow, Row, TitleRow } from './Row'
import { useState, useEffect } from 'react'
import { View } from './ViewSelector'

interface PlayerTableProps {
  players: TieredPlayer[]
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
      <TitleRow
        position={position}
        timeFrame={timeFrame}
        view={view}
        toggleAllVisible={() => toggleAllVisible(!allVisible)}
      />
      {players.map((p, idx) => {
        const displayPosition =
          isFlexPosition(position) ? p.fantasyPositions[0] : convertSearchPositionToSleeperPosition(position)
        const metrics = timeFrame === TimeFrame.FiveWeek ? p.fiveWeekMetrics : p.seasonMetrics

        return (
          <Row
            selectedPosition={position}
            key={idx + 1}
            rank={idx + 1}
            name={p.fullName}
            position={displayPosition}
            gamesPlayed={metrics.gp}
            avg={metrics.avgPoints}
            ownerId={p.ownerId}
            weeks={p.weeklyStats}
            stdDev={metrics.stdDev}
            allVisible={allVisible}
            timeFrame={timeFrame}
            myOwnerId={myOwnerId}
            tier={p.tier}
            tierDiff={p.tierDiff}
          />
        )
      })}
    </div>
  )
}

interface RosterTableProps {
  roster: Roster
}

export const RosterTable = ({ roster }: RosterTableProps) => {
  const [allVisible, toggleAllVisible] = useState(true)

  //Resets visibility of indv graphs when players change
  useEffect(() => {
    toggleAllVisible(!allVisible)
  }, [roster])

  return (
    <div>
      <RosterTitleRow toggleAllVisible={() => toggleAllVisible(!allVisible)} />
      {Object.values(roster.starters).map(slot => {
        return <RosterRow rosterSlot={slot} allVisible={allVisible} />
      })}
    </div>
  )
}
