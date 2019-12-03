const linkStyle = {
  marginRight: 15,
  cursor: 'pointer',
  color: 'blue',
  textDecoration: 'underline'
};

export const TimeFrame = {
  allSeason: 0,
  fiveWeeks: 1
}

export const TimeFrameSelector = ({onClick}) => (
  <div style={{marginBottom: '16px', marginLeft: '16px'}}>
      <a style={linkStyle} onClick={() => onClick(TimeFrame.allSeason)}>All Season</a>
      <a style={linkStyle} onClick={() => onClick(TimeFrame.fiveWeeks)}>Last 5 Weeks</a>
  </div>
)