import React, { useState, useEffect } from 'react'
import Layout from '../components/MyLayout'
import PositionSelector from '../components/PositionSelector'
import { TimeFrameSelector, TimeFrame } from '../components/TimeFrameSelector'
import { ViewSelector, View } from '../components/ViewSelector'
import PlayerTable from '../components/PlayerTable'
import PlayerGraph from '../components/PlayerGraph'
import * as Get from '../server/getIndex'
import { CalculatedPlayer, SearchPosition } from '../../shared/types'

const Index = () => {
  const [players, setPlayers] = useState<CalculatedPlayer[]>([])
  const [ownerId, setOwnerId] = useState<string | undefined>()
  const [timeFrame, setTimeFrame] = useState(TimeFrame.allSeason)
  const [position, setPosition] = useState(SearchPosition.QB)
  const [view, setView] = useState(View.table)

  useEffect(() => {
    const init = async () => {
      await getAllSeasonTopPlayers(SearchPosition.QB)
    }
    init()
  }, [])

  useEffect(() => {
    setNewPosition(position)
  }, [timeFrame])

  const getAllSeasonTopPlayers = async (position: SearchPosition) => {
    const ret = await Get.topPlayers(position)
    setPlayers(ret.players)
    setOwnerId(ret.ownerId)
  }

  const getFiveWeeksTopPlayers = async (position: SearchPosition) => {
    const ret = await Get.fiveWeekTopPlayers(position)
    setPlayers(ret.players)
    setOwnerId(ret.ownerId)
  }

  const setNewTimeFrame = async (newTimeFrame: TimeFrame) => {
    if (newTimeFrame !== timeFrame) {
      setTimeFrame(newTimeFrame)
    }
  }

  const setNewPosition = async (newPosition: SearchPosition) => {
    setPosition(newPosition)
    timeFrame === TimeFrame.fiveWeeks
      ? getFiveWeeksTopPlayers(newPosition)
      : getAllSeasonTopPlayers(newPosition)
  }

  
  return (
    <Layout>
      <TimeFrameSelector onClick={setNewTimeFrame} />
      <PositionSelector onClick={setNewPosition} />
      <h2 >
        {`${position} - ${
          timeFrame === TimeFrame.allSeason ? 'All Season' : 'Over Five Weeks'
        }`}
      </h2>
      <ViewSelector onClick={setView} />
      {(view === View.table && players.length > 0) && <PlayerTable players={players} position={position} timeFrame={timeFrame} view={view} myOwnerId={ownerId} />}
      {view === View.graph && <PlayerGraph players={players} position={position} myOwnerId={ownerId}/>}
    </Layout>
  )
}

export default Index
