import React, { useState, useEffect } from 'react'
import Layout from '../components/MyLayout'
import { RosterTable } from '../components/PlayerTable'
import * as Get from '../server/getIndex'
import { Roster, RosterStat } from '../../shared/types'
import { styled } from 'styled-components'

const niceRank = (rank: number) => {
  if (rank === 1) return `1st`
  if (rank === 2) return `2nd`
  if (rank === 3) return `3rd`
  else return `${rank}th`
}

const determineRankColor = (rank: number) => {
  if(rank === 1) return 'blue'
  if(rank >= 2 && rank <= 6) return 'green'
  if(rank >= 7 && rank <= 11) return 'orange'
  if(rank === 12) return 'red'
}

const StatDiv = styled.div`
  margin-left: 20px;
  color: ${props => props.color || 'black'};
`

interface StatProps {
  stat: RosterStat
  name: string
}

const Stat = ({ stat, name }: StatProps) => {
  return <StatDiv color={determineRankColor(stat.rank)}>{`${name} - ${stat.startingStatSum.toFixed(2)}(${niceRank(stat.rank)})`}</StatDiv>
}

const RosterStatsDiv = styled.div`
  display: flex;
  flex-direction: row;
`

interface RosterStatsProps {
  roster: Roster
}

const RosterStats = ({ roster }: RosterStatsProps) => {
  return (
    <RosterStatsDiv>
      <Stat stat={roster.avgPoints} name={'Avg'} />
      <Stat stat={roster.stdDev} name={'StdDev'} />
      <Stat stat={roster.QB} name={'QB'} />
      <Stat stat={roster.RB} name={'RB'} />
      <Stat stat={roster.WR} name={'WR'} />
      <Stat stat={roster.TE} name={'TE'} />
      <Stat stat={roster.FLEX} name={'FLEX'} />
      <Stat stat={roster.K} name={'K'} />
      <Stat stat={roster.DEF} name={'DEF'} />
    </RosterStatsDiv>
  )
}

const RosterDiv = styled.div`
  margin-bottom: 20px;
`

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
    setOwnerId(ret.ownerId)
  }

  return (
    <Layout>
      <h2> Rosters </h2>
      <div>
        {rosters.map((r) => {
          return (
            <RosterDiv>
              <h3>{r.ownerName}</h3>
              <RosterTable roster={r} key={`roster-${r.ownerId}`} />
              <RosterStats roster={r} key={`stats-${r.ownerId}`} />
            </RosterDiv>
          )
        })}
      </div>
    </Layout>
  )
}

export default Index
