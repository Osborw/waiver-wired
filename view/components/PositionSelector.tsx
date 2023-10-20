import { SearchPosition } from "../../shared/types";

const linkStyle = {
  marginRight: 15,
  cursor: 'pointer',
  color: 'blue',
  textDecoration: 'underline'
};

interface HeaderProps {
  onClick: (newPosition: SearchPosition) => Promise<void>
}

const Header = ({onClick}: HeaderProps) => (
  <div style={{marginBottom: '16px', }}>
      <a style={linkStyle} onClick={() => onClick(SearchPosition.QB)}>QB</a>
      <a style={linkStyle} onClick={() => onClick(SearchPosition.RB)}>RB</a>
      <a style={linkStyle} onClick={() => onClick(SearchPosition.WR)}>WR</a>
      <a style={linkStyle} onClick={() => onClick(SearchPosition.TE)}>TE</a>
      <a style={linkStyle} onClick={() => onClick(SearchPosition.FLEX)}>FLEX</a>
      <a style={linkStyle} onClick={() => onClick(SearchPosition.K)}>K</a>
      <a style={linkStyle} onClick={() => onClick(SearchPosition.DEF)}>DEF</a>
  </div>
)

export default Header;