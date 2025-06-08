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
  min-height: 500px;
`

const SortContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px black solid;
  height: 10%;
`

const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px black solid;
  height: 90%;
`

interface TradesProps {
  ownerTradeRoster: TradeRoster
  oppTradeRoster: TradeRoster
  addPlayerToOfferList: (player: CalculatedPlayer) => void
  leagueRosterSpots: SearchPosition[]
}

export const RosterList = ({
  ownerTradeRoster,
  oppTradeRoster,
  addPlayerToOfferList,
  leagueRosterSpots,
}: TradesProps) => {
  return (
    <RosterContainer>
      <SortContainer>{ownerTradeRoster.ownerName}</SortContainer>
      <PlayersContainer>
        {ownerTradeRoster.remainingRoster.fullRoster.map((player) => (
          <PlayerTile
            player={player}
            ownerTradeRoster={ownerTradeRoster}
            oppTradeRoster={oppTradeRoster}
            leagueRosterSpots={leagueRosterSpots}
            onClick={addPlayerToOfferList}
          />
        ))}
      </PlayersContainer>
    </RosterContainer>
  )
}

