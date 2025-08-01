import React from 'react'
import { RosterTable } from '../components/PlayerTable'
import { Roster, RosterStat } from '../../../shared/types'
import s from './rosters.module.scss'

const niceRank = (rank: number) => {
  if (rank === 1) return `1st`
  if (rank === 2) return `2nd`
  if (rank === 3) return `3rd`
  else return `${rank}th`
}

const determineRankColor = (rank: number, numRosters: number) => {
  if(rank <= numRosters * .2) return s.stat_color_blue
  if(rank <= numRosters * .5) return s.stat_color_green
  if(rank <= numRosters * .8) return s.stat_color_orange
  return s.stat_color_red
}

interface StatProps {
  stat: RosterStat
  numRosters: number
  name: string
}

const Stat = ({ stat, numRosters, name }: StatProps) => {
  return <div className={`stat ${determineRankColor(stat.rank, numRosters)}`}>{`${name} - ${stat.totalPoints.toFixed(2)}(${niceRank(stat.rank)})`}</div>
}

interface RosterStatsProps {
  roster: Roster
  numRosters: number
}

const RosterStats = ({ roster, numRosters }: RosterStatsProps) => {
  return (
    <div className={s.roster_stats}>
      <Stat stat={roster.avgPoints} numRosters={numRosters} name={'Avg'} />
      <Stat stat={roster.stdDev} numRosters={numRosters} name={'StdDev'} />
      {roster.positionRanks.map(pos => (
        <Stat stat={pos} numRosters={numRosters} name={pos.position} />
      ))}
    </div>
  )
}

interface RostersProps {
  rosters: Roster[]
}

export const Rosters = ({rosters}: RostersProps) => {

  const numRosters = rosters.length

  return (
    <div className={s.rosters}>
      <h2> Rosters </h2>
      <div className={s.rosters}>
        {rosters.map((r) => {
          return (
            <div className={s.roster}>
              <h3>{r.ownerName}</h3>
              <RosterTable roster={r} key={`roster-${r.ownerId}`} />
              <RosterStats roster={r} numRosters={numRosters} key={`stats-${r.ownerId}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}