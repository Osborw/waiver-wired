import { Player, SearchPosition, SleeperPosition } from "../../shared/types"
const playerPlaysPosition = (p: Player, position: SearchPosition) => {
  if(position === SearchPosition.FLEX){
    if(p.fantasyPositions.includes(SleeperPosition.RB)) return true
    if(p.fantasyPositions.includes(SleeperPosition.WR)) return true
    if(p.fantasyPositions.includes(SleeperPosition.TE)) return true
    return false
  }
  else if(position === SearchPosition.DEF) return p.fantasyPositions.includes(SleeperPosition.DEF)
  else if(position === SearchPosition.RB) return p.fantasyPositions.includes(SleeperPosition.RB)
  else if(position === SearchPosition.WR) return p.fantasyPositions.includes(SleeperPosition.WR)
  else if(position === SearchPosition.TE) return p.fantasyPositions.includes(SleeperPosition.TE)
  else if(position === SearchPosition.K) return p.fantasyPositions.includes(SleeperPosition.K)
}

export const getPlayersByPosition = (players: Record<string, Player>, position: SearchPosition) => {
  const allPlayers = Object.values(players)
  return allPlayers.filter(p => playerPlaysPosition(p, position))
}