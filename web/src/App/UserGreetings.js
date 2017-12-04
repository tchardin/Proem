/* @flow */

import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'

type Props = {
  user: Object,
}

const Margin = styled.div`
  width: 100%;
`

const Title = styled.div`
  font-family: 'Gotham', sans-serif;
  font-weight: bold;
  font-size: 3.5em;
  line-height: 0.7em;
  color: black;
`

const User = styled.div`
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
  color: black;
`

const UserGreetings = ({user}: Props) => {
  if (typeof user.profile === 'undefined') {
    return (
      <Margin>
        <Title>HELLO,</Title>
        <User>Anonymous.</User>
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
