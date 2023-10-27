import React, { useState, useEffect } from 'react'
import Layout from '../components/MyLayout'
import PositionSelector from '../components/PositionSelector'
import { TimeFrameSelector, TimeFrame } from '../components/TimeFrameSelector'
import { ViewSelector, View } from '../components/ViewSelector'
import PlayerTable from '../components/PlayerTable'
import PlayerGraph from '../components/PlayerGraph'
import * as Get from '../server/getIndex'
import { SearchPosition, Roster } from '../../shared/types'

const Index = () => {
  const [rosters, setRosters] = useState<Roster[]>([])
  const [ownerId, setOwnerId] = useState<string | undefined>()

  useEffect(() => {
    const init = async () => {
      await getRosters()
    }
    init()
  }, [])

  const getRosters = async () => {
    const ret = await Get.getRosters()
    setRosters(ret.rosters)
    console.log(ret.rosters)
    console.log(ret.trades)
    setOwnerId(ret.ownerId)
  }
  
  return (
    <Layout>
      <h2 > Rosters </h2>
      {/* <PlayerTable players={players} position={position} timeFrame={timeFrame} view={view} myOwnerId={ownerId} />} */}
    </Layout>
  )
}

export default Index
