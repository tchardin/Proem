
/* @flow */

import React from 'react'
import {connect} from 'react-redux'
import styled, {keyframes} from 'styled-components'

import Link from '../Link'
import {toggleLeft} from '../store/ui'

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
`
const Section = styled.section`
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: 'flex-start';
  margin: 1.5em 0 0 1.5em;
`;

const TitleLink = styled(Link)`
  display: inline-flex;
  padding: 0;
  margin: 0;
  margin-left: 24px;
  font-family: 'Gotham', sans-serif;
  font-weight: bold;
  font-size: 3.5em;
  line-height: 1.5rem;
  color: white;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  align-self: center;
  align-items: center;

  @media (max-width: 599px) {
    margin-left: 16px;
  }

  &.title:active,
  &.title:hover,
  &.title:visited {
    color: #00d8ff;
  }
`;

const Burger = styled.div`
  height: 40px;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`

const StripeA = styled.span`
  height: 8px;
  width: 100%;
  background-color: white;
  transform: ${props => props.open ? 'rotate(45deg) translateY(12px) translateX(10px)' : 'rotate(0deg)'};
  transition: all .12s linear;
`
const StripeB = styled.span`
  height: 8px;
  width: 100%;
  background-color: white;
  opacity: ${props => props.open ? 0 : 1};
  transition: all .12s linear;
`
const StripeC = styled.span`
  height: 8px;
  width: 100%;
  background-color: white;
  transform: ${props => props.open ? 'rotate(-45deg) translateY(-12px) translateX(10px)' : 'rotate(0deg)'};
  transition: all .12s linear;
`

class AppToolbar extends React.Component {
  render() {
    const {open, toggleLeft} = this.props
    return (
      <Header>
          <Section start>
            <Burger onClick={() => toggleLeft()}>
              <StripeA open={open}/>
              <StripeB open={open}/>
              <StripeC open={open}/>
            </Burger>
            <TitleLink href="/">
              PROEM
            </TitleLink>
          </Section>
      </Header>
    );
  }
}

const mapStateToProps = state => {
  return {
    open: !!state.ui.left > 0
  }
}

export default connect(mapStateToProps, {
  toggleLeft
})(AppToolbar)
