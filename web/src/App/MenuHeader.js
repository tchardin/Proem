/* @flow */
import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import history from '../history'
import Button from '../Button'

const Title = styled.div`
  font-family: 'Gotham', sans-serif;
  font-weight: bold;
  font-size: 2em;
  line-height: 1.5em;
  color: black;
  width: 100%;
  padding-left: 0.5em;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  border-bottom: solid black 2px;
`

const MenuHeader = ({title, href}) => {
  return (
    <Header>
      <Button
        type="back"
        href={href}/>
      <Title>
        {title}
      </Title>
    </Header>
  )
}

export default MenuHeader
