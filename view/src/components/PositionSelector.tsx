import React from 'react'
import { SearchPosition } from "../../../shared/types";
import s from './PositionSelector.module.scss'

interface HeaderProps {
  validSearchPositions: SearchPosition[]
  onClick: (newPosition: SearchPosition) => void
}

const Header = ({validSearchPositions, onClick}: HeaderProps) => (
  <div className={s.pos_header}>
    {validSearchPositions.map(pos => {
      return (
        <a key={`${pos}-link`} onClick={() => onClick(pos)}>{pos}</a>
      ) 
    })}
  </div>
)

export default Header;