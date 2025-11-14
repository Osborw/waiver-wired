import React from 'react'
import { CalculatedPlayer, SearchPosition, TempRoster } from '../../../../shared/types'
import { createTempRoster } from '../../logic/roster-logic'
import s from './PlayerTile.module.scss'
import { TradeRoster } from '../../logic/trade/base-trade-roster'

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
  userTradeRoster: TradeRoster 
  partnerTradeRoster: TradeRoster
  leagueRosterSpots: SearchPosition[]
  inOffer: boolean
  onClick: () => void 
}

interface GetTradeValueProps {
  player: CalculatedPlayer
  userPostTradeRoster: TempRoster
  partnerPostTradeRoster: TempRoster
  leagueRosterSpots: SearchPosition[]
}

const getTradeValue = ({ player, userPostTradeRoster, partnerPostTradeRoster, leagueRosterSpots }: GetTradeValueProps) => {
  //create two new temp rosters
  const newOwnerRoster = userPostTradeRoster.fullRoster.filter((p) => p.id !== player.id)
  const newOppRoster = [...partnerPostTradeRoster.fullRoster, player]

  const ownerTempRoster = createTempRoster(userPostTradeRoster.ownerId, newOwnerRoster, leagueRosterSpots)
  const oppTempRoster = createTempRoster(partnerPostTradeRoster.ownerId, newOppRoster, leagueRosterSpots)

  //subtract old values from new values
  const userGain = ownerTempRoster.avgPoints - userPostTradeRoster.avgPoints
  const oppGain = oppTempRoster.avgPoints - partnerPostTradeRoster.avgPoints

  //return those two numbers
  return { userGain, oppGain }
}

export const PlayerTile = ({ player, userTradeRoster, partnerTradeRoster, leagueRosterSpots, inOffer, onClick}: PlayerTileProps) => {
  const tradeValue = getTradeValue({
    player,
    userPostTradeRoster: userTradeRoster.postTradeRoster,
    partnerPostTradeRoster: partnerTradeRoster.postTradeRoster,
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
        <button onClick={onClick}>{buttonText}</button>
      </div>
    </div>
  )
}