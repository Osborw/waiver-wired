const linkStyle = {
  marginRight: 15,
  cursor: 'pointer',
  color: 'blue',
  textDecoration: 'underline'
};

export enum TimeFrame {
  allSeason,
  fiveWeeks
}

interface TimeFrameSelectorProps {
  onClick: (newTimeFrame: TimeFrame) => Promise<void>
}

export const TimeFrameSelector = ({ onClick }: TimeFrameSelectorProps) => (
  <div style={{ marginBottom: '16px', }}>
    <a style={linkStyle} onClick={() => onClick(TimeFrame.allSeason)}>All Season</a>
    <a style={linkStyle} onClick={() => onClick(TimeFrame.fiveWeeks)}>Last 5 Weeks</a>
  </div>
)