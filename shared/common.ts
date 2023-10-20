import { SleeperPosition } from './types'

export const isFlexPosition = (position: SleeperPosition) => {
    return position === SleeperPosition.RB || position === SleeperPosition.WR || position === SleeperPosition.TE
}