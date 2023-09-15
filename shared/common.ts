import { EligiblePositions } from './types'

export const isEligiblePosition = (pos: string) => {
    return Object.keys(EligiblePositions).includes(pos)
}

export const isFlexPosition = (pos: string | null) => {
    return pos === EligiblePositions[EligiblePositions.RB] || pos === EligiblePositions[EligiblePositions.WR] || pos === EligiblePositions[EligiblePositions.TE]
}

export const isDefense = (pos: string | null) => {
    return pos === EligiblePositions[EligiblePositions.DEF]
}

export const getPositionFromEnum = (position: string) => {
  const keyName = Object.keys(EligiblePositions).find(key => key === position);
  if(!keyName) return EligiblePositions.NA
  return EligiblePositions[keyName as keyof typeof EligiblePositions] 
}