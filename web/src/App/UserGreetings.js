/* @flow */

import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'

import imgLink from '../img/logo_large.png'

type Props = {
  user: Object,
}

const Margin = styled.div`
  width: 100%;
  margin: 0 0 1.5em 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Title = styled.div`
  font-family: 'Gotham', sans-serif;
  font-weight: bold;
  font-size: 3.5em;
  line-height: 0.7em;
  color: black;
  align-self: flex-start;
`

const User = styled.div`
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
  color: black;
  padding: 0.5em 0;
  align-self: flex-start;
`

const Image = styled.figure`
  height: 148px;
  width: 148px;
  margin: 0;
`

const Logo = styled.img`
  display: block;
  height: auto;
  width: 100%;
`

const UserGreetings = ({user}: Props) => {
  if (typeof user.profile === 'undefined') {
    return (
      <Margin>
        <Image>
          <Logo
            src={imgLink}/>
        </Image>
      </Margin>
    )
  }
  return (
    <Margin>
      <Title>HELLO,</Title>
      <User>{user.profile.givenName || 'Anonymous'}.</User>
    </Margin>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user.info || {}
  }
}

export default connect(mapStateToProps)(UserGreetings)
