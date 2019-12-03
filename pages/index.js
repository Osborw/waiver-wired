import React, { useState, useEffect } from 'react'
import Layout from '../components/MyLayout'
import PositionSelector from '../components/PositionSelector'
import { TimeFrameSelector, TimeFrame } from '../components/TimeFrameSelector'
import { ViewSelector, View } from '../components/ViewSelector'
import PlayerTable from '../components/PlayerTable'
import PlayerGraph from '../components/PlayerGraph'
import * as Get from '../server/getStuff'

const Index = () => {
  const [players, setPlayers] = useState([])
  const [timeFrame, setTimeFrame] = useState(TimeFrame.allSeason)
  const [position, setPosition] = useState('QB')
  const [view, setView] = useState(View.table)

  useEffect(() => {
    const init = async () => {
      setPlayers(await setInitialList())
    }
    init()
  }, [])

  useEffect(() => {
    setNewPosition(position)
  }, [timeFrame])

  const getAllSeasonTop50 = async position => {
    const ret = await Get.top50(position)
    setPlayers(ret)
  }

  const getFiveWeeksTop50 = async position => {
    const ret = await Get.fiveWeekTop50(position)
    setPlayers(ret)
  }

  const setNewTimeFrame = async newTimeFrame => {
    if (newTimeFrame !== timeFrame) {
      setTimeFrame(newTimeFrame)
    }
  }

  const setNewPosition = async newPosition => {
    setPosition(newPosition)
    timeFrame === TimeFrame.fiveWeeks
      ? getFiveWeeksTop50(newPosition)
      : getAllSeasonTop50(newPosition)
  }

  
  return (
    <Layout>
      <TimeFrameSelector onClick={setNewTimeFrame} />
      <PositionSelector onClick={setNewPosition} />
      <h2 style={{ marginLeft: '16px' }}>
        {`${position} - ${
          timeFrame === TimeFrame.allSeason ? 'All Season' : 'Over Five Weeks'
        }`}
      </h2>
      <ViewSelector onClick={setView} />
      {view === View.table && <PlayerTable players={players}/>}
      {view === View.graph && <PlayerGraph players={players}/>}
    </Layout>
  )
}

const setInitialList = async () => {
  const initialPos = 'QB'
  const ret = await Get.top50(initialPos)
  return ret
}

export default Index
