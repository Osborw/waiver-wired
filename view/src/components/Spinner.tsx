import React from 'react'
import s from './Spinner.module.scss'

export const Spinner = () => {
  return (
    <div className={s.spinner}>
      <div className={s.animation}> </div>
      <p>Loading Information for your League...</p>
    </div>
  )
}