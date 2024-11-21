import React from 'react'
import { RosterTable } from '../components/PlayerTable'
import { Roster, RosterStat } from '../../../shared/types'
import { styled } from 'styled-components'

const niceRank = (rank: number) => {
  if (rank === 1) return `1st`
  if (rank === 2) return `2nd`
  if (rank === 3) return `3rd`
  else return `${rank}th`
}

const determineRankColor = (rank: number, numRosters: number) => {
  if(rank <= numRosters * .2) return 'blue'
  if(rank <= numRosters * .5) return 'green'
  if(rank <= numRosters * .8) return 'orange'
  return 'red'
}

const StatDiv = styled.div`
  margin-left: 20px;
  color: ${props => props.color || 'black'};
`

interface StatProps {
  stat: RosterStat
  numRosters: number
  name: string
}

const Stat = ({ stat, numRosters, name }: StatProps) => {
  return <StatDiv color={determineRankColor(stat.rank, numRosters)}>{`${name} - ${stat.totalPoints.toFixed(2)}(${niceRank(stat.rank)})`}</StatDiv>
}

const RosterStatsDiv = styled.div`
  display: flex;
  flex-direction: row;
`

interface RosterStatsProps {
  roster: Roster
  numRosters: number
}

const RosterStats = ({ roster, numRosters }: RosterStatsProps) => {
  return (
    <RosterStatsDiv>
      <Stat stat={roster.avgPoints} numRosters={numRosters} name={'Avg'} />
      <Stat stat={roster.stdDev} numRosters={numRosters} name={'StdDev'} />
      {roster.positionRanks.map(pos => (
        <Stat stat={pos} numRosters={numRosters} name={pos.position} />
      ))}
    </RosterStatsDiv>
  )
}

const RosterDiv = styled.div`
  margin-bottom: 20px;
`

interface RostersProps {
  rosters: Roster[]
}

export const Rosters = ({rosters}: RostersProps) => {

  const numRosters = rosters.length

  return (
    <div>
      <h2> Rosters </h2>
      <div>
        {rosters.map((r) => {
          return (
            <RosterDiv>
              <h3>{r.ownerName}</h3>
              <RosterTable roster={r} key={`roster-${r.ownerId}`} />
              <RosterStats roster={r} numRosters={numRosters} key={`stats-${r.ownerId}`} />
            </RosterDiv>
          )
        })}
      </div>
    </div>
  )
}