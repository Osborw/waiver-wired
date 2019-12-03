import Row from './Row'

export default ({players}) => {
  return (
    <div>
  {players.map((p, idx) => {
    return <Row
      key={idx + 1}
      rank={idx + 1}
      name={p.name}
      position={p.position}
      gamesPlayed={p.gamesPlayed}
      avg={p.avgPoints}
      ownerId={p.ownerId}
    />
})}
</div>
  )
}