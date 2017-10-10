import React from 'react'

const RadioBtnComponent = ({isActive}) => {
  if (isActive) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 510 510" style={radioStyle}>
        <path d="M255,127.5c-71.4,0-127.5,56.1-127.5,127.5c0,71.4,56.1,127.5,127.5,127.5c71.4,0,127.5-56.1,127.5-127.5 C382.5,183.6,326.4,127.5,255,127.5z M255,0C114.75,0,0,114.75,0,255s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z M255,459c-112.2,0-204-91.8-204-204S142.8,51,255,51s204,91.8,204,204S367.2,459,255,459z" fill="#fff"/>
      </svg>
    )
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 510 510" style={radioStyle}>
        <path d="M255,0 C114.75,0 0,114.75 0,255 C0,395.25 114.75,510 255,510 C395.25,510 510,395.25 510,255 C510,114.75 395.25,0 255,0 Z M255,459 C142.8,459 51,367.2 51,255 C51,142.8 142.8,51 255,51 C367.2,51 459,142.8 459,255 C459,367.2 367.2,459 255,459 Z" fill="#fff" />
      </svg>
    )
  }
}

export default RadioBtnComponent

const radioStyle = {
  cursor: 'pointer'
}
