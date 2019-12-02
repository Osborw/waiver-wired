const RowStyle = {
  display: 'flex',
  flexDirection: 'row',
};

const SmallCellStyle = {
  marginLeft: '10px',
  marginRight: '10px',
  width: '50px',
  color: 'green'
}

const CellStyle = {
  marginLeft: '10px',
  marginRight: '10px',
  width: '150px',
}

export default ({ rank, name, position, avg }) => {
  return (
    <div style={RowStyle}>
      <div style={CellStyle}>{rank}</div>
      <div style={CellStyle}>{name}</div>
      {position && <div style={SmallCellStyle}>{position}</div>}
      <div style={CellStyle}>{avg}</div>
    </div>
  )
}
