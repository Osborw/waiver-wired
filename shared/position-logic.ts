import { Player, SearchPosition, SleeperPosition } from "./types"

const playerPlaysPosition = (p: Player, position: SearchPosition) => {
  if(position === SearchPosition.FLEX){
    if(p.fantasyPositions?.includes(SleeperPosition.RB)) return true
    if(p.fantasyPositions?.includes(SleeperPosition.WR)) return true
    if(p.fantasyPositions?.includes(SleeperPosition.TE)) return true
    return false
  }
  else if(position === SearchPosition.DEF) return p.fantasyPositions?.includes(SleeperPosition.DEF)
  else if(position === SearchPosition.QB) return p.fantasyPositions?.includes(SleeperPosition.QB)
  else if(position === SearchPosition.RB) return p.fantasyPositions?.includes(SleeperPosition.RB)
  else if(position === SearchPosition.WR) return p.fantasyPositions?.includes(SleeperPosition.WR)
  else if(position === SearchPosition.TE) return p.fantasyPositions?.includes(SleeperPosition.TE)
  else if(position === SearchPosition.K) return p.fantasyPositions?.includes(SleeperPosition.K)
}

export const getPlayersByPosition = (players: Record<string, Player>, position: SearchPosition) => {
  const allPlayers = Object.values(players)
  return allPlayers.filter(p => playerPlaysPosition(p, position))
}

export const convertSearchPositionToSleeperPosition = (pos: SearchPosition) => {
  if(pos === SearchPosition.QB) return SleeperPosition.QB
  if(pos === SearchPosition.RB) return SleeperPosition.RB
  if(pos === SearchPosition.WR) return SleeperPosition.WR
  if(pos === SearchPosition.TE) return SleeperPosition.TE
  if(pos === SearchPosition.K) return SleeperPosition.K
  if(pos === SearchPosition.DEF) return SleeperPosition.DEF
  return SleeperPosition.QB
}