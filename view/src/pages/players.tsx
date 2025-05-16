import React, { useState, useEffect } from 'react'
import PositionSelector from '../components/PositionSelector'
import { TimeFrameSelector } from '../components/TimeFrameSelector'
import { ViewSelector, View } from '../components/ViewSelector'
import PlayerTable from '../components/PlayerTable'
import PlayerGraph from '../components/PlayerGraph'
import { TieredPlayer, SearchPosition, TimeFrame, LeagueInfo } from '../../../shared/types'
import { TopPlayerReturn } from '../../../shared/api-types'

interface PlayersProps {
  players: TopPlayerReturn[]
  leagueInfo: LeagueInfo
  ownerId: string
}

export const Players = ({players, leagueInfo, ownerId}: PlayersProps) => {
  const [positionPlayers, setPositionPlayers] = useState<TieredPlayer[]>([])
  const [timeFrame, setTimeFrame] = useState(TimeFrame.Season)
  const [position, setPosition] = useState<SearchPosition>(leagueInfo.validRosterPositions[0])
  const [view, setView] = useState(View.table)

  useEffect(() => {
    const init = async () => {
      const initPositionPlayers = getPlayersByPosition(position)
      setPositionPlayers(initPositionPlayers)
    }
    init()
  }, [])

  useEffect(() => {
    setNewPosition(position)
  }, [timeFrame])

  const setNewTimeFrame = (newTimeFrame: TimeFrame) => {
    if (newTimeFrame !== timeFrame) {
      setTimeFrame(newTimeFrame)
    }
  }

  const setNewPosition = (newPosition: SearchPosition) => {
    setPosition(newPosition)
    const newPlayers = getPlayersByPosition(newPosition)
    setPositionPlayers(newPlayers)
  }

  const getPlayersByPosition = (position: SearchPosition) => {
    const newPositionPlayers = players.find(p => p.position === position)
    if (!newPositionPlayers) {
      console.error('cannot find any players for position!', position)
      return []
    }
    if (timeFrame === TimeFrame.FiveWeek) return newPositionPlayers.top5WeekPlayers
    else return newPositionPlayers.topPlayers
  }
  
  return (
    <div>
      <TimeFrameSelector onClick={setNewTimeFrame} />
      <PositionSelector validSearchPositions={leagueInfo?.validRosterPositions} onClick={setNewPosition} />
      <h2 >
        {`${position} - ${
          timeFrame === TimeFrame.Season ? 'All Season' : 'Over Five Weeks'
        }`}
      </h2>
      <ViewSelector onClick={setView} />
      {(view === View.table && players.length > 0) && <PlayerTable players={positionPlayers} position={position} timeFrame={timeFrame} view={view} myOwnerId={ownerId} />}
      {view === View.graph && <PlayerGraph players={positionPlayers} position={position} timeFrame={timeFrame} myOwnerId={ownerId}/>}
    </div>
  )
}