const linkStyle = {
  marginRight: 15,
  cursor: 'pointer',
  color: 'blue',
  textDecoration: 'underline'
};

export const View = {
  table: 0,
  graph: 1,
}

export const ViewSelector = ({onClick}) => (
  <div style={{marginBottom: '16px',}}>
      <a style={linkStyle} onClick={() => onClick(View.table)}>Table</a>
      <a style={linkStyle} onClick={() => onClick(View.graph)}>Graph</a>
  </div>
)