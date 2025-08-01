import React from 'react'
import s from './GraphTooltip.module.scss'

export const IndividualGraphTooltip = (props: any) => {
  if (!props.active) {
    return null
  }
  const { payload } = props
  return (
    <div className={s.tooltip}>
      <div className={s.words}>
        {payload[0] ? (
          <>
            <div>{`Week ${payload[0].payload.x}`}</div>
            <div>{payload[0].payload.y != undefined ? `${payload[0].payload.y.toFixed(2)}` : 'Not Active'}</div>
          </>
        ) : (
          <div>{`Not Active`}</div>
        )}
      </div>
    </div>
  )
}

export const TopPlayersGraphTooltip = (props: any) => {
  if (!props.active) {
    return null
  }
  const { payload } = props
  return (
    <div className={s.tooltip}>
      <div className={s.words}>
          <>
            <div>{`${payload[0].payload.label}`}</div>
            <div>{`${payload[0].payload.y.toFixed(2)}`}</div>
          </>
      </div>
    </div>
  ) 
}
