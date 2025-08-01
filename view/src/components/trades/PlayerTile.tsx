import React from 'react'
import { CalculatedPlayer, SearchPosition, TempRoster } from '../../../../shared/types'
import { createTempRoster } from '../../logic/roster-logic'
import { TradeRoster } from '../../pages/trades'
import s from './PlayerTile.module.scss'

/**
 *
 * PlayerTile will likely have to do it's own calculation for what a roster would lose avgPoints wise if it lost this player.
 * It will also have to do a calculation for what the other team would gain avgPoints wise if it gained this player
 *
 * So for each player, that's two calculations that each take O(n^2) I think. not great, but not horrible. We'll see what happens.
 *
 */

interface PlayerTileProps {
  player: CalculatedPlayer
  ownerTradeRoster: TradeRoster
  oppTradeRoster: TradeRoster
  leagueRosterSpots: SearchPosition[]
  inOffer: boolean
  onClick: (player: CalculatedPlayer) => void 
}

interface GetTradeValueProps {
  player: CalculatedPlayer
  ownerPostTradeRoster: TempRoster
  oppPostTradeRoster: TempRoster
  leagueRosterSpots: SearchPosition[]
}

const getTradeValue = ({ player, ownerPostTradeRoster, oppPostTradeRoster, leagueRosterSpots }: GetTradeValueProps) => {
  //create two new temp rosters
  const newOwnerRoster = ownerPostTradeRoster.fullRoster.filter((p) => p.id !== player.id)
  const newOppRoster = [...oppPostTradeRoster.fullRoster, player]

  const ownerTempRoster = createTempRoster(ownerPostTradeRoster.ownerId, newOwnerRoster, leagueRosterSpots)
  const oppTempRoster = createTempRoster(oppPostTradeRoster.ownerId, newOppRoster, leagueRosterSpots)

  //subtract old values from new values
  const userGain = ownerTempRoster.avgPoints - ownerPostTradeRoster.avgPoints
  const oppGain = oppTempRoster.avgPoints - oppPostTradeRoster.avgPoints

  //return those two numbers
  return { userGain, oppGain }
}

export const PlayerTile = ({ player, ownerTradeRoster, oppTradeRoster, leagueRosterSpots, inOffer, onClick}: PlayerTileProps) => {
  const tradeValue = getTradeValue({
    player,
    ownerPostTradeRoster: ownerTradeRoster.postTradeRoster,
    oppPostTradeRoster: oppTradeRoster.postTradeRoster,
    leagueRosterSpots,
  })

  const buttonText = inOffer ? '-' : '+'

  return (
    <div className={s.player_tile}>
      <div className={s.player_info}>
        <div className={s.player_info_line}>
          <p>{player.fullName}</p>
          <p>{player.fantasyPositions[0]}</p>
        </div>
        <div className={s.player_info_line}>
          <p>{player.fiveWeekMetrics.avgPoints.toFixed(2)}</p>
        </div>
      </div>
      <div className={s.trade_action}>
        <p className={s.trade_info}>
          {tradeValue.userGain.toFixed(0)} | {tradeValue.oppGain.toFixed(0)}
        </p>
        <button onClick={() => onClick(player)}>{buttonText}</button>
      </div>
    </div>
  )
}