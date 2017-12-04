/**
 * Reusable Button
 *
 */

/* @flow */

import React from 'react'
import Link from '../Link'
import styled from 'styled-components'
import Arrow from '../svg/Arrow'

const Blank = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Primary = styled(Blank)`
  border: 1px solid #e6e6e6;
  min-width: 190px;
  background: transparent;
  justify-content: center;
  width: 100%;
  height: 42px;
`

const Menu = styled(Blank)`
  justify-content: space-between;
`

const Caption = styled.span`
  font-family: 'Gotham', sans-serif;
  text-transform: uppercase;
  font-size: 1em;
  color: black;
  font-weight: bold;
  line-height: ${props => props.primary ? '3em' : '1em'};
`

const RotateRight = styled.span`
  transform: rotate(180deg);
  display: flex;
`

class Button extends React.Component {
  props: {
    type: 'primary' | 'menu' | 'back',
    caption: string,
    href: string,
    onPress: () => mixed,
  }
  render() {
    const {type, caption, href, onPress} = this.props
    if (type === 'primary') {
      return (
        <Primary
          href={href}
          onClick={onPress}>
          <Caption primary>{caption}</Caption>
        </Primary>
      )
    } else if (type === 'menu') {
      return (
        <Menu
          href={href}
          onClick={onPress}>
          <Caption>{caption}</Caption>
          <RotateRight>
            <Arrow
              size="10px"
              color="#000"/>
          </RotateRight>
        </Menu>
      )
    } else if (type === 'back') {
      return (
        <Menu
          href={href}
          onClick={onPress}>
          <Arrow
            size="10px"
            color="#000"/>
        </Menu>
      )
    }
  }
}

export default Button
