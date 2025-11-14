import React from 'react'
import { CalculatedPlayer, SearchPosition } from '../../../../shared/types'
import { PlayerTile } from './PlayerTile'
import s from './OfferList.module.scss'
import { TradeRoom } from '../../logic/trade/trade-room'


interface TradesProps {
  ownerId: string
  tradeRoom?: TradeRoom
  leagueRosterSpots: SearchPosition[]
  removePlayerFromOfferList: (tradeRoom: TradeRoom, player: CalculatedPlayer, ownerId: string) => void 
}

export const OfferList = ({
  ownerId,
  tradeRoom,
  leagueRosterSpots,
  removePlayerFromOfferList,
}: TradesProps) => {
  if (!tradeRoom) return <div>Error! Empty trade room!</div>

  const isUser = ownerId === tradeRoom.userOwnerId
  const tradeRoster = isUser ? tradeRoom.userTradeRoster : tradeRoom.partnerTradeRoster
  const oppTradeRoster = isUser ? tradeRoom.partnerTradeRoster : tradeRoom.userTradeRoster
  const offeredPlayers = isUser ? tradeRoom.userOfferedPlayers : tradeRoom.partnerOfferedPlayers

  return (
    <div className={s.roster}>
      <div className={s.players}>
        {offeredPlayers.map((player) => (
          <PlayerTile
            player={player}
            userTradeRoster={tradeRoster}
            partnerTradeRoster={oppTradeRoster}
            leagueRosterSpots={leagueRosterSpots}
            inOffer={true}
            onClick={() => removePlayerFromOfferList(tradeRoom, player, ownerId)}
          />
        ))}
      </div>
    </div>
  )
}