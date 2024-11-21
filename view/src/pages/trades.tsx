import React, { useState } from 'react'
import { SleeperPosition, Trade } from '../../../shared/types'
import { styled } from 'styled-components'

const TradeDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  border-style: solid;
  border-width: 1px;
  width: 70%;
`

const PlayerDiv = styled.div`
  display: flex;
  flex-direction: column;
  border-style: solid;
  border-width: 1px;
  width: 55%;
`

const PlayerListDiv = styled.div`
  margin: 5px;
`

const IconDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 10%;
`

const ImprovementDiv = styled.div`
  display: flex;
  justify-content: center;
  border-style: solid;
  border-width: 1px;
`

const NameDiv = styled.div`
  margin: 2px;
`

const OwnerIdDiv = styled.div`
  display: flex;
  flex-direction: row;
`

const PositionColor = styled.span<{ color?: string }>`
  color: ${(props) => props.color || 'black'};
`

const colorByPosition = (position: SleeperPosition) => {
  if (position === SleeperPosition.QB) return 'red'
  if (position === SleeperPosition.RB) return 'green'
  if (position === SleeperPosition.WR) return 'blue'
  if (position === SleeperPosition.TE) return 'orange'
  if (position === SleeperPosition.K) return 'purple'
  if (position === SleeperPosition.DEF) return 'brown'
}

const getOwners = (trades: Trade[]) => {
  const owners = trades.map((t) => t.team2Owner)
  return Array.from(new Set(owners))
}

interface TradesProps {
  trades: Trade[]
}

export const Trades = ({trades}: TradesProps) => {
  const filteredTrades = trades.filter(t => !t.team2Players.find(p => p.fantasyPositions[0] === SleeperPosition.DEF))
  const owners = getOwners(filteredTrades)
  const [expanded, setExpanded] = useState<string[]>([])

  const toggleExpanded = (ownerId: string) => {
    if (expanded.includes(ownerId)) {
      const copyExpanded = [...expanded]
      const idx = expanded.findIndex((id) => id === ownerId)
      copyExpanded.splice(idx, 1)
      setExpanded(copyExpanded)
    } else {
      setExpanded([...expanded, ownerId])
    }
  }

  return (
    <div>
      <h2> Trades </h2>
      <div>
        {owners.map((ownerId) => {
          const isExpanded = expanded.includes(ownerId)
          const size = isExpanded ? 100 : 1
          return (
            <div>
              <OwnerIdDiv>
                <h3>{ownerId}</h3>
                <div style={{ display: 'flex', alignItems: 'center', margin: '5px' }}>
                  <button onClick={() => toggleExpanded(ownerId)}>{isExpanded ? '-' : '+'}</button>
                </div>
              </OwnerIdDiv>
              {filteredTrades
                .filter((t) => t.team2Owner === ownerId)
                .slice(0, size)
                .map((t) => {
                  return (
                    <TradeDiv>
                      <PlayerDiv>
                        <ImprovementDiv>{t.team1Improvement.toFixed(1)}</ImprovementDiv>
                        <PlayerListDiv>
                          {t.team1Players.map((p) => (
                            <NameDiv>
                              <PositionColor
                                color={colorByPosition(p.fantasyPositions[0])}
                              >{`${p.fantasyPositions[0]}`}</PositionColor>
                              {` - ${p.fullName} - ${p.fiveWeekMetrics.avgPoints.toFixed(2)}`}
                            </NameDiv>
                          ))}
                        </PlayerListDiv>
                      </PlayerDiv>
                      <IconDiv>
                        <ImprovementDiv>{`<--->`}</ImprovementDiv>
                      </IconDiv>
                      <PlayerDiv>
                        <ImprovementDiv>{t.team2Improvement.toFixed(1)}</ImprovementDiv>
                        <PlayerListDiv>
                          {t.team2Players.map((p) => (
                            <NameDiv>
                              <PositionColor
                                color={colorByPosition(p.fantasyPositions[0])}
                              >{`${p.fantasyPositions[0]}`}</PositionColor>
                              {` - ${p.fullName} - ${p.fiveWeekMetrics.avgPoints.toFixed(2)}`}
                            </NameDiv>
                          ))}
                        </PlayerListDiv>
                      </PlayerDiv>
                    </TradeDiv>
                  )
                })}
            </div>
          )
        })}
      </div>
    </div>
  )
}