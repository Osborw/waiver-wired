import { Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart } from 'recharts'
import { IndividualGraphTooltip } from './GraphTooltip'
import { TimeFrame } from './TimeFrameSelector'

const weekExists = (weeks, i) => {
  const matchingWeek = weeks.filter(week => week.weekNumber === i)
  if (matchingWeek[0]) return matchingWeek[0].ptsPPR
  else return null
}

const IndividualGraph = ({ weeks, avg, stdDev, position, timeFrame }) => {

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
  const xDomain = timeFrame === TimeFrame.fiveWeeks ? [8, 14] : [1, 17]

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
    </ComposedChart>
  )
}

export default IndividualGraph
// export default ({ weeks }) => {

//   return (
//     <div style={{ width: '20%' }}>
//       <VictoryChart
//         domain={{ x: [0, 17], y: [-2, 50] }}
//         style={{
//           data: { strokeWidth: 3, fillOpacity: 0.4 }
//         }}
//       >
//         <VictoryArea
//           labelComponent={<VictoryTooltip />}
//           style={{
//             data: { fill: "pink", stroke: "red" }
//             // labels: {
//             //   fontSize: 15,
//             //   fill: ({ datum }) => datum.color,
//             // }
//           }}
//           size={2.5}
//           data={weeks.map((week, idx) => {
//             return {
//               x: week.weekNumber,
//               y: week.ptsPPR,
//             }
//           })}
//         />
//       </VictoryChart>
//     </div>
//   )
// }
