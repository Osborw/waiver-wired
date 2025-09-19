import React from 'react'
import { CalculatedPlayer, SearchPosition, SleeperPosition } from '../../../../shared/types'
import { TradeRoster } from '../../pages/trades'
import { PlayerTile } from './PlayerTile'
import s from './RosterList.module.scss'
import { TradeRoom } from '../../logic/trade/trade-room'

const sortRosterByPosition = (a: CalculatedPlayer, b: CalculatedPlayer) => {
  //TODO: This might have to change depending on what other positions there are
  const positionOrder = {
    [SleeperPosition.QB]: 0,
    [SleeperPosition.RB]: 1,
    [SleeperPosition.WR]: 2,
    [SleeperPosition.TE]: 3,
    [SleeperPosition.K]: 4,
    [SleeperPosition.DEF]: 5,
  }

  const positionDifference = positionOrder[a.fantasyPositions[0]] - positionOrder[b.fantasyPositions[0]]

  if(positionDifference === 0){
    return b.fiveWeekMetrics.avgPoints - a.fiveWeekMetrics.avgPoints
  }
  else return positionDifference
}

const determinePointColor = (value: number) => {
  if(value > 0) return s.green_value
  else if(value < 0) return s.red_value
  return s.black_value
}

interface TradesProps {
  ownerId: string
  tradeRoom?: TradeRoom
  changeTradeRooms?: (ownerId: string) => void
  addPlayerToOfferList: (player: CalculatedPlayer) => void
  leagueRosterSpots: SearchPosition[]
}

export const RosterList = ({
  ownerId,
  tradeRoom,
  changeTradeRooms,
  addPlayerToOffer  List,
  leagueRosterSpots,
}: TradesProps) => {

  if (!tradeRoom) return <div>Error! Empty trade room!</div>

  const originalPoints = ownerTradeRoster.originalRoster.avgPoints.totalPoints
  const newPoints = ownerTradeRoster.postTradeRoster.avgPoints
  const pointDifference = newPoints - originalPoints 
  const sortedRoster = ownerTradeRoster.remainingRoster.fullRoster.sort(sortRosterByPosition)

  return (
    <div className={s.roster}>
      <div className={s.sort}>
        <h3 className={s.name_header}>{ownerTradeRoster.ownerName}</h3>
        <p>Original Points: {originalPoints.toFixed(2)}</p>
        <p>New Points:    {newPoints.toFixed(2)}</p>
        <p>Point Difference: <span className={determinePointColor(pointDifference)}>{pointDifference.toFixed(2)}</span></p>
      </div>
      <div className={s.players}>
        {sortedRoster.map((player) => (
          <PlayerTile
            key={`${player.id}-tile`}
            player={player}
            ownerTradeRoster={ownerTradeRoster}
            oppTradeRoster={oppTradeRoster}
            leagueRosterSpots={leagueRosterSpots}
            inOffer={false}
            onClick={addPlayerToOfferList}
          />
        ))}
      </div>
    </div>
  )
}
