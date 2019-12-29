const linkStyle = {
  marginRight: 15,
  cursor: 'pointer',
  color: 'blue',
  textDecoration: 'underline'
};

const Header = ({onClick}) => (
  <div style={{marginBottom: '16px', }}>
      <a style={linkStyle} onClick={() => onClick('QB')}>QB</a>
      <a style={linkStyle} onClick={() => onClick('RB')}>RB</a>
      <a style={linkStyle} onClick={() => onClick('WR')}>WR</a>
      <a style={linkStyle} onClick={() => onClick('TE')}>TE</a>
      <a style={linkStyle} onClick={() => onClick('FLEX')}>FLEX</a>
      <a style={linkStyle} onClick={() => onClick('K')}>K</a>
      <a style={linkStyle} onClick={() => onClick('DEF')}>DEF</a>
  </div>
)

export default Header;