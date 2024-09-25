import React from 'react'
import { TimeFrame } from "../../../shared/types";

const linkStyle = {
  marginRight: 15,
  cursor: 'pointer',
  color: 'blue',
  textDecoration: 'underline'
};

interface TimeFrameSelectorProps {
  onClick: (newTimeFrame: TimeFrame) => void
}

export const TimeFrameSelector = ({ onClick }: TimeFrameSelectorProps) => (
  <div style={{ marginBottom: '16px', }}>
    <a style={linkStyle} onClick={() => onClick(TimeFrame.Season)}>All Season</a>
    <a style={linkStyle} onClick={() => onClick(TimeFrame.FiveWeek)}>Last 5 Weeks</a>
  </div>
)