import React from 'react'
import './Spinner.scss'

export const Spinner = () => {
  return (
    <div className='spinner'>
      <div className='animation'> </div>
      <p>Loading Information for your League...</p>
    </div>
  )
}