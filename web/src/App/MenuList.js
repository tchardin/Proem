/* @flow */

import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {signUserIn, signUserOut} from '../store/user'
import Button from '../Button'

const List = styled.ul`
  display: flex;
  flex: 2;
  flex-direction: column;
  justify-content: flex-start;
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
            type="menu"
            href={'/about'}/>
        </Option>
        <Option>
          {user.info ? (
            <Button
              caption="Sign Out"
              type="secondary"
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
