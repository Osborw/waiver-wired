const RowStyle = {
  display: 'flex',
  flexDirection: 'row',
};

const CellStyle = {
  marginLeft: '10px',
  marginRight: '10px',
  width: '150px'
}

export default ({ rank, name, avg }) => {
  return (
    <div style={RowStyle}>
      <div style={CellStyle}>{rank}</div>
      <div style={CellStyle}>{name}</div>
      <div style={CellStyle}>{avg}</div>
    </div>
  )
}
