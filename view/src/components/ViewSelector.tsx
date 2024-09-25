import React from 'react'

const linkStyle = {
  marginRight: 15,
  cursor: 'pointer',
  color: 'blue',
  textDecoration: 'underline'
};

export enum View {
  table,
  graph
}

interface ViewSelectorProps {
  onClick: React.Dispatch<React.SetStateAction<View>>
}

export const ViewSelector = ({onClick}: ViewSelectorProps) => (
  <div style={{marginBottom: '16px',}}>
      <a style={linkStyle} onClick={() => onClick(View.table)}>Table</a>
      <a style={linkStyle} onClick={() => onClick(View.graph)}>Graph</a>
  </div>
)