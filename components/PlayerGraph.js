import {
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
} from 'victory'

export default ({ players }) => {
  
  const determineColor = ownerId => {
    if (ownerId === '471674442926256128') return 'green'
    else if (ownerId) return 'black'
    else return 'blue'
  }

  return (
    <div style={{ width: '60%' }}>
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ x: [0, 50], y: [-2, 30] }}
      >
        <VictoryScatter
          labelComponent={<VictoryTooltip />}
          style={{
            data: {
              fill: ({ datum }) => datum.color,
            },
            labels: {
              fontSize: 15,
              fill: ({ datum }) => datum.color,
            },
          }}
          size={2.5}
          data={players.map((p, idx) => {
            return {
              x: idx,
              y: p.avgPoints,
              label: p.name,
              color: determineColor(p.ownerId),
            }
          })}
        />
      </VictoryChart>
    </div>
  )
}
