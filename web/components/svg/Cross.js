import React from 'react'

const CrossComponent = ({color, direction, size}) => {
  let transform
  if (direction === 'cancel') {
    transform = 'rotate(45)'
  } else {
    transform = 'rotate(0)'
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={size} height={size} viewBox="0 0 357 357" transform={transform}>
    	<path d="M357,204H204v153h-51V204H0v-51h153V0h51v153h153V204z" fill={color}/>
    </svg>
  )
}

export default CrossComponent
