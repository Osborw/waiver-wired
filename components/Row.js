const RowStyle = {
  display: 'flex',
  flexDirection: 'row',
}

const SmallCellStyle = {
  marginLeft: '10px',
  marginRight: '10px',
  width: '50px',
}

const CellStyle = {
  marginLeft: '10px',
  marginRight: '10px',
  width: '150px',
}

const NotOwnedCellStyle = {
  marginLeft: '10px',
  marginRight: '10px',
  width: '150px', 
  color: 'blue'
}

const OwnedCellStyle = {
  marginLeft: '10px',
  marginRight: '10px',
  width: '150px', 
  color: 'green'
}

const ownedButNotByMe = (ownerId) => {
  return ownerId && ownerId !== '471674442926256128' 
}

export default ({ rank, name, position, gamesPlayed, avg, ownerId }) => {
  return (
    <div style={RowStyle}>
      <div style={SmallCellStyle}>{rank}</div>
      {ownerId === '471674442926256128' && <div style={OwnedCellStyle}>{name}</div>}
      {ownedButNotByMe(ownerId) && <div style={CellStyle}>{name}</div>}
      {!ownerId && <div style={NotOwnedCellStyle}>{name}</div>}
      {position && <div style={SmallCellStyle}>{position}</div>}
      {gamesPlayed && <div style={SmallCellStyle}>{gamesPlayed}</div>}
      <div style={CellStyle}>{avg}</div>
    </div>
  )
}
