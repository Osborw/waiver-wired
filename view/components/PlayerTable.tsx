import { TieredPlayer, SearchPosition, Roster, Lineup } from '../../shared/types'
import { convertSearchPositionToSleeperPosition } from '../../shared/position-logic'
import { RosterRow, RosterTitleRow, Row, TitleRow } from './Row'
import { useState, useEffect } from 'react'
import { TimeFrame } from './TimeFrameSelector'
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
          position === SearchPosition.FLEX ? p.fantasyPositions[0] : convertSearchPositionToSleeperPosition(position)
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
      {roster.startingLineup.QB.map((player) => {
        return <RosterRow key={player.id} player={player} position={SearchPosition.QB} allVisible={allVisible} />
      })}
      {roster.startingLineup.RB.map((player) => {
        return <RosterRow key={player.id} player={player} position={SearchPosition.RB} allVisible={allVisible} />
      })}
      {roster.startingLineup.WR.map((player) => {
        return <RosterRow key={player.id} player={player} position={SearchPosition.WR} allVisible={allVisible} />
      })}
      {roster.startingLineup.TE.map((player) => {
        return <RosterRow key={player.id} player={player} position={SearchPosition.TE} allVisible={allVisible} />
      })}
      {roster.startingLineup.FLEX.map((player) => {
        return <RosterRow key={player.id} player={player} position={SearchPosition.FLEX} allVisible={allVisible} />
      })}
      {roster.startingLineup.K.map((player) => {
        return <RosterRow key={player.id} player={player} position={SearchPosition.K} allVisible={allVisible} />
      })}
      {roster.startingLineup.DEF.map((player) => {
        return <RosterRow key={player.id} player={player} position={SearchPosition.DEF} allVisible={allVisible} />
      })}
    </div>
  )
}
