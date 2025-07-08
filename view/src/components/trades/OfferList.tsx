import React from 'react'
import { CalculatedPlayer, SearchPosition } from '../../../../shared/types'
import { TradeRoster } from '../../pages/trades'
import { PlayerTile } from './PlayerTile'
import './OfferList.scss'


interface TradesProps {
  offeredPlayers: CalculatedPlayer[]
  ownerTradeRoster: TradeRoster
  oppTradeRoster: TradeRoster
  removePlayerFromOfferList: (player: CalculatedPlayer) => void
  leagueRosterSpots: SearchPosition[]
}

export const OfferList = ({
  offeredPlayers,
  ownerTradeRoster,
  oppTradeRoster,
  removePlayerFromOfferList,
  leagueRosterSpots,
}: TradesProps) => {
  return (
    <div className='roster'>
      <div className='players'>
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