import React, { useState, useEffect } from 'react'
import Layout from '../components/MyLayout'
import { RosterTable } from '../components/PlayerTable'
import * as Get from '../server/getIndex'
import { Roster, RosterStat } from '../../../shared/types'
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
  return <StatDiv color={determineRankColor(stat.rank)}>{`${name} - ${stat.totalPoints.toFixed(2)}(${niceRank(stat.rank)})`}</StatDiv>
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
      {roster.positionRanks.map(pos => (
        <Stat stat={pos} name={pos.position} />
      ))}
    </RosterStatsDiv>
  )
}

const RosterDiv = styled.div`
  margin-bottom: 20px;
`

interface RostersProps {
  rosters: Roster[]
  ownerId: string
}

export const Rosters = ({rosters, ownerId}: RostersProps) => {

  return (
    <div>
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
    </div>
  )
}