import React from 'react'
import { CalculatedPlayer, SearchPosition } from '../../../../shared/types'
import { PlayerTile } from './PlayerTile'
import s from './OfferList.module.scss'
import { TradeRoom } from '../../logic/trade/trade-room'


interface TradesProps {
  ownerId: string
  tradeRoom?: TradeRoom
  removePlayerFromOfferList: (player: CalculatedPlayer) => void
  leagueRosterSpots: SearchPosition[]
}

export const OfferList = ({
  removePlayerFromOfferList,
  leagueRosterSpots,
}: TradesProps) => {
  return (
    <div className={s.roster}>
      <div className={s.players}>
        {offeredPlayers.map((player) => (
          <PlayerTile
            player={player}
            ownerTradeRoster={ownerTradeRoster}
            oppTradeRoster={oppTradeRoster}
            leagueRosterSpots={leagueRosterSpots}
            inOffer={true}
            onClick={removePlayerFromOfferList}
          />
        ))}
      </div>
    </div>
  )
}