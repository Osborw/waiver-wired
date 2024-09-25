import React from 'react'
import { SearchPosition } from "../../../shared/types";

const linkStyle = {
  marginRight: 15,
  cursor: 'pointer',
  color: 'blue',
  textDecoration: 'underline'
};

interface HeaderProps {
  validSearchPositions: SearchPosition[]
  onClick: (newPosition: SearchPosition) => void
}

const Header = ({validSearchPositions, onClick}: HeaderProps) => (
  <div style={{marginBottom: '16px', }}>
    {validSearchPositions.map(pos => {
      return (
        <a style={linkStyle} onClick={() => onClick(pos)}>{pos}</a>
      ) 
    })}
  </div>
)

export default Header;