import React from 'react'
import { CalculatedPlayer, SearchPosition, TempRoster } from '../../../../shared/types'
import { styled } from 'styled-components'
import { createTempRoster } from '../../logic/roster-logic'
import { TradeRoster } from '../../pages/trades'

/**
 *
 * PlayerTile will likely have to do it's own calculation for what a roster would lose avgPoints wise if it lost this player.
 * It will also have to do a calculation for what the other team would gain avgPoints wise if it gained this player
 *
 * So for each player, that's two calculations that each take O(n^2) I think. not great, but not horrible. We'll see what happens.
 *
 */
const PlayerTileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid gray;
  margin: 2px;
  padding: 4px;
`

const PlayerInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const PlayerInfoLine = styled.div`
  display: flex;
  flex-direction: row;
`

const PlayerInfo = styled.p`
  margin-top: 0px;
  margin-bottom: 0px;
  margin-right: 2px;
  margin-left: 2px;
`

const TradeActionContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const TradeInfo = styled.p`
  margin-top: 0px;
  margin-bottom: 0px;
  margin-right: 2px;
  margin-left: 2px;
  display: flex;
  align-items: center;
`

interface PlayerTileProps {
  player: CalculatedPlayer
  ownerTradeRoster: TradeRoster
  oppTradeRoster: TradeRoster
  leagueRosterSpots: SearchPosition[]
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

export const PlayerTile = ({ player, ownerTradeRoster, oppTradeRoster, leagueRosterSpots, onClick}: PlayerTileProps) => {
  const tradeValue = getTradeValue({
    player,
    ownerPostTradeRoster: ownerTradeRoster.postTradeRoster,
    oppPostTradeRoster: oppTradeRoster.postTradeRoster,
    leagueRosterSpots,
  })

  return (
    <PlayerTileContainer>
      <PlayerInfoContainer>
        <PlayerInfoLine>
          <PlayerInfo>{player.fullName}</PlayerInfo>
          <PlayerInfo>{player.fantasyPositions[0]}</PlayerInfo>
        </PlayerInfoLine>
        <PlayerInfoLine>
          <PlayerInfo>{player.fiveWeekMetrics.avgPoints.toFixed(2)}</PlayerInfo>
        </PlayerInfoLine>
      </PlayerInfoContainer>
      <TradeActionContainer>
        <TradeInfo>
          {tradeValue.userGain.toFixed(0)} | {tradeValue.oppGain.toFixed(0)}
        </TradeInfo>
        <button onClick={() => onClick(player)}>+</button>
      </TradeActionContainer>
    </PlayerTileContainer>
  )
}