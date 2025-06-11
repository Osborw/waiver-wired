import React from 'react'
import { CalculatedPlayer, SearchPosition, SleeperPosition } from '../../../../shared/types'
import { styled } from 'styled-components'
import { TradeRoster } from '../../pages/trades'
import { PlayerTile } from './PlayerTile'

const RosterContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px black solid;
  width: 20%;
`

const SortContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px black solid;
`

const PointsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const PlayersContainer = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  border: 1px black solid;
`

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

  const originalPoints = ownerTradeRoster.originalRoster.avgPoints.totalPoints
  const newPoints = ownerTradeRoster.postTradeRoster.avgPoints
  const pointDifference = newPoints - originalPoints 
  const sortedRoster = ownerTradeRoster.remainingRoster.fullRoster.sort(sortRosterByPosition)

  return (
    <RosterContainer>
      <SortContainer>
        <h3>{ownerTradeRoster.ownerName}</h3>
        <PointsContainer>
          <h3>{originalPoints.toFixed(2)}</h3>
          <h4>{newPoints.toFixed(2)}</h4>
          <h5>{pointDifference.toFixed(2)}</h5>
        </PointsContainer>
      </SortContainer>
      <PlayersContainer>
        {sortedRoster.map((player) => (
          <PlayerTile
            player={player}
            ownerTradeRoster={ownerTradeRoster}
            oppTradeRoster={oppTradeRoster}
            leagueRosterSpots={leagueRosterSpots}
            inOffer={false}
            onClick={addPlayerToOfferList}
          />
        ))}
      </PlayersContainer>
    </RosterContainer>
  )
}
