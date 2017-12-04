/* @flow */

import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {signUserIn, signUserOut} from '../store/user'
import Arrow from '../svg/Arrow'
import Link from '../Link'
import Button from '../Button'
import Input from '../Form/Input'
import DatePicker from '../Form/DatePicker'

const List = styled.ul`
  display: flex;
  flex: 2;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
`

const Option = styled.li`
  border-top: solid #e6e6e6 1px;
  padding: 1.5em 0.5em 1.5em 0.5em;
  width: 100%;
  box-sizing: border-box;
`

const RotateRight = styled.span`
  transform: rotate(180deg);
  display: flex;
`


class MenuList extends React.Component {
  render() {
    const {
      view,
      coin,
      fiat,
      user,
      signUserIn,
      signUserOut
    } = this.props
    return (
      <List>
        <Option>
          <Button
            caption="Portfolio"
            type="menu"
            href={`/portfolio/${fiat}`}/>
        </Option>
        <Option>
          <Button
            caption="Metrics"
            type="menu"
            href={`/${view.toLowerCase()}/${coin}/${fiat}/metrics`}/>
        </Option>
        <Option>
          <Button
            caption="About"
            type="menu"/>
        </Option>
        <Option>
          {user.info ? (
            <Button
              caption="Sign Out"
              type="primary"
              onPress={() => signUserOut()}/>
          ) : (
            <Button
              caption="Sign in"
              type="primary"
              onPress={() => signUserIn()}/>
          )}
        </Option>
      </List>
    )
  }
}

const mapStateToProps = state => ({
  coin: state.routing.variables.coin,
  fiat: state.routing.variables.fiat,
  user: state.user,
})

export default connect(mapStateToProps,{
  signUserIn,
  signUserOut
})(MenuList)
