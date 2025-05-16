import React from 'react'
import { Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart } from 'recharts'
import { IndividualGraphTooltip } from './GraphTooltip'
import { SearchPosition, TimeFrame, WeeklyStats } from '../../../shared/types'

const weekExists = (weeks: WeeklyStats[], weekNumber: number) => {
  const matchingWeek = weeks.find(week => week.weekNumber === weekNumber)
  if (matchingWeek) return matchingWeek.weekStats.weekScore
  else return null
}

interface IndividualGraphProps {
  weeks: WeeklyStats[]
  avg: number
  stdDev: number
  position: SearchPosition 
  timeFrame: TimeFrame 

}

const IndividualGraph = ({ weeks, avg, stdDev, position, timeFrame }: IndividualGraphProps) => {

  const datum = []
  let i
  for (i = 1; i <= 17; i++) {
    const yVal = weekExists(weeks, i)
    datum.push({
      x: i,
      y: yVal,
      avg: avg,
      floor: avg-stdDev,
      ceil: avg+stdDev,
    })
  }

  const yDomain = position === 'K' ? [0, 25] : [0, 50]
  //this isnt working for some reason vvvvvv
  const xDomain = timeFrame === TimeFrame.FiveWeek ? [1, 17] : [1, 17]

  return (
    <ComposedChart
      width={400}
      height={100}
      data={datum}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='x' type="number" domain={xDomain} interval={0}/>
      <YAxis dataKey='y' type="number" domain={yDomain} interval={0}/>
      <Tooltip content={IndividualGraphTooltip} position={{x:380, y:10}}/>
      <Area type='linear' dataKey='y' stroke='#8884d8' fill='#8884d8' />
      <Line type='monotone' dataKey='avg' stroke='#ff7300' dot={false} activeDot={false} />
      {stdDev && <Line type='monotone' dataKey='ceil' stroke='#12732c' dot={false} activeDot={false} />}
      {stdDev && <Line type='monotone' dataKey='floor' stroke='#bd1515' dot={false} activeDot={false} />}
    </ComposedChart>
  )
}

export default IndividualGraph