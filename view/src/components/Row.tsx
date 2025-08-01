import React from 'react'
import IndividualGraph from './IndividualGraph'
import { useState, useEffect } from 'react'
import { SearchPosition, SleeperPosition, TimeFrame, WeeklyStats } from '../../../shared/types'
import { View } from './ViewSelector'
import { LineupSlot } from '../../../shared/types'
import { isFlexPosition } from '../../../shared/position-logic'
import s from './Row.module.scss'

interface TitleRowProps {
  position: SearchPosition
  timeFrame: TimeFrame
  view: View
  toggleAllVisible: () => void
}

export const TitleRow = ({ position, toggleAllVisible }: TitleRowProps) => {
  return (
    <div className={s.title_row}>
      <div className={s.cell}>{'Rank'}</div>
      {position === 'FLEX' && <div className={s.cell}>{'Position'}</div>}
      <div className={`${s.cell} ${s.cell_width_large}`}>{'Name'}</div>
      <div className={s.cell}>{'Games Played'}</div>
      <div className={`${s.cell} ${s.cell_width_med}`}>{'Average PPR'}</div>
      <div className={`${s.cell} ${s.cell_width_med}`}>{'Standard Deviation'}</div>
      <div className={`${s.cell} ${s.cell_width_med}`}>{'Tier'}</div>
      <div className={s.cell}>
        <button
          onClick={() => toggleAllVisible()}
        >
          ^ Close All ^
        </button>
      </div>
    </div>
  )
}

const ownedButNotByMe = (ownerId: string | null, myOwnerId?: string) => {
  return ownerId && ownerId !== myOwnerId
}

interface NameFieldProps {
  name: string
  ownerId: string | null
  myOwnerId?: string
}

const NameField = ({ name, ownerId, myOwnerId }: NameFieldProps) => {
  return (
    <div>
      {ownerId === myOwnerId && (
        <div className={`${s.cell} ${s.cell_width_large} ${s.cell_color_green}`}>
          {name}
        </div>
      )}
      {ownedButNotByMe(ownerId, myOwnerId) && (
        <div className={`${s.cell} ${s.cell_width_large}`}>{name}</div>
      )}
      {!ownerId && (
        <div className={`${s.cell} ${s.cell_color_blue} ${s.cell_width_large}`}>
          {name}
        </div>
      )}
    </div>
  )
}

const determineTierColor = (tier: number) => {
  if(tier % 2 === 0) return s.cells_color_white 
  if(tier % 2 === 1) return s.cells_color_gray
}

interface RowProps {
  selectedPosition: SearchPosition
  rank: number
  name: string
  position: SleeperPosition
  gamesPlayed: number
  avg: number
  ownerId: string | null
  weeks: WeeklyStats[]
  stdDev: number
  allVisible: boolean
  timeFrame: TimeFrame
  myOwnerId?: string
  tier: number
  tierDiff?: number
}

export const Row = ({
  selectedPosition,
  rank,
  name,
  position,
  gamesPlayed,
  avg,
  ownerId,
  weeks,
  stdDev,
  allVisible,
  timeFrame,
  myOwnerId,
  tier,
  tierDiff
}: RowProps) => {
  const [individualGraphVisible, toggleIndividualGraphVisibility] = useState(
    false,
  )

  //all Visible changes when someone click the close all button
  useEffect(() => {
    toggleIndividualGraphVisibility(false)
  }, [allVisible])

  return (
    <div className={s.row}
      onClick={() => toggleIndividualGraphVisibility(!individualGraphVisible)}
    >
      <div className={`${s.cells} ${determineTierColor(tier)}`}>
        <div className={s.cell}>{rank}</div>
        {isFlexPosition(selectedPosition) && <div className={s.cell}>{position}</div>}
        <NameField name={name} ownerId={ownerId} myOwnerId={myOwnerId} />
        <div className={s.cell}>{gamesPlayed}</div>
        <div className={`${s.cell} ${s.cell_width_med}`}>{avg ? avg.toFixed(2) : 0}</div>
        <div className={`${s.cell} ${s.cell_width_med}`}>
          {(gamesPlayed > 1 && stdDev) ? stdDev.toFixed(2) : '------'}
        </div>
        <div className={`${s.cell} ${s.cell_width_med}`}> {tierDiff ? -tierDiff.toFixed(0): ''} </div>
        <div className={s.cell}>{individualGraphVisible ? ' ˄ ' : ' ˅ '}</div>
      </div>
      {individualGraphVisible && (
        <div className={s.graph}>
          {
            <IndividualGraph
              weeks={weeks}
              avg={avg}
              stdDev={stdDev}
              position={selectedPosition}
              timeFrame={timeFrame}
            />
          }
        </div>
      )}
    </div>
  )
}


interface RosterTitleRowProps {
  toggleAllVisible: () => void
}

export const RosterTitleRow = ({ toggleAllVisible }: RosterTitleRowProps) => {
  return (
    <div className={s.title_row}>
      <div className={s.cell}>{'Position'}</div>
      <div className={`${s.cell} ${s.cell_width_large}`}>{'Name'}</div>
      <div className={s.cell}>{'Games Played'}</div>
      <div className={`${s.cell} ${s.cell_width_med}`}>{'Average PPR'}</div>
      <div className={`${s.cell} ${s.cell_width_med}`}>{'Standard Deviation'}</div>
      <div className={s.cell}>
        <button
          onClick={() => toggleAllVisible()}
        >
          ^ Close All ^
        </button>
      </div>
    </div>
  )
}

interface RosterRowProps {
  rosterSlot: LineupSlot
  allVisible: boolean
}

export const RosterRow = ({
  rosterSlot,
  allVisible,
}: RosterRowProps) => {
  const [individualGraphVisible, toggleIndividualGraphVisibility] = useState(
    false,
  )

  const position = rosterSlot.position
  const player = rosterSlot.player

  if(!player) return <div>Error</div>

  const metrics = player.fiveWeekMetrics

  //all Visible changes when someone click the close all button
  useEffect(() => {
    toggleIndividualGraphVisibility(false)
  }, [allVisible])

  return (
    <div className={s.row}
      onClick={() => toggleIndividualGraphVisibility(!individualGraphVisible)}
    >
      <div className={`${s.cells} ${s.cell_color_white}`} >
        <div className={s.cell}>{position}</div>
        <div className={`${s.cell} ${s.cell_width_large}`}>{player.fullName}</div>
        <div className={s.cell}>{metrics.gp}</div>
        <div className={`${s.cell} ${s.cell_width_med}`}>{metrics.avgPoints ? metrics.avgPoints.toFixed(2) : 0}</div>
        <div className={`${s.cell} ${s.cell_width_med}`}>
          {(metrics.gp > 1 && metrics.stdDev) ? metrics.stdDev.toFixed(2) : '------'}
        </div>
        <div className={s.cell}>{individualGraphVisible ? ' ˄ ' : ' ˅ '}</div>
      </div>
      {individualGraphVisible && (
        <div className={s.graph}>
          {
            <IndividualGraph
              weeks={player.weeklyStats}
              avg={metrics.avgPoints}
              stdDev={metrics.stdDev}
              position={position}
              timeFrame={TimeFrame.FiveWeek}
            />
          }
        </div>
      )}
    </div>
  )
}