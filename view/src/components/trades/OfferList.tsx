import React from 'react'
import { CalculatedPlayer, SearchPosition } from '../../../../shared/types'
import { styled } from 'styled-components'
import { TradeRoster } from '../../pages/trades'
import { PlayerTile } from './PlayerTile'

const RosterContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px black solid;
  width: 20%;
`

const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px black solid;
`

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
    <RosterContainer>
      <PlayersContainer>
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
      </PlayersContainer>
    </RosterContainer>
  )
}