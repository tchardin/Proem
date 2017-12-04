/* @flow */

import React from 'react'
import styled from 'styled-components'


const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  width: 300px;
  padding: 1.5em;
  box-sizing: border-box;
`

class AppMenu extends React.Component {
  render() {
    return (
      <MenuContainer>
        {this.props.header &&
        React.cloneElement(this.props.header)}
        {this.props.body &&
        React.cloneElement(this.props.body)}
        {this.props.footer &&
        React.cloneElement(this.props.footer)}
      </MenuContainer>
    )
  }
}

export default AppMenu
