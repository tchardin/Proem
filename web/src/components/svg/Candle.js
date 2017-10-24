import React from 'react'

const CandleComponent = ({color, hoverColor}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="10479 8339.5 25 65" width="30" height="30">
      <g data-name="Group 65" transform="translate(10340 7484)" fill="none" stroke={color} strokeWidth="4px">
        <line y2="65" transform="translate(151.5 855.5)"/>
        <rect width="25" height="30" transform="translate(139 875)" fill={color}/>
      </g>
    </svg>
  )
}

export default CandleComponent
