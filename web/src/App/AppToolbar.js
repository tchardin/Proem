
/* @flow */

import React from 'react'
import styled from 'styled-components'

import Link from '../Link'
import AppLogo from './AppLogo'

const Header = styled.header`
  position: absolute;
  top: 20px;
  left: 0;
  z-index: 777;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  align-items: center;
  @media (max-width: 959px) and (orientation: landscape) {
    min-height: 48px;
  }
  @media (max-width: 599px) {
    min-height: 56px;
  }
`;

const Section = styled.section`
  display: inline-flex;
  min-width: 0;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: ${props =>
    props.start ? 'flex-start' : props.end ? 'flex-end' : 'center'};
  order: ${props => (props.start ? -1 : props.end ? 1 : null)};
`;

const TitleLink = styled(Link)`
  display: inline-flex;
  padding: 16px 0;
  margin: 0;
  margin-left: 24px;
  overflow: hidden;
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
  
`

class AppToolbar extends React.Component {
  props: {
    hero: React.Element<*>,
  };

  render() {
    return (
      <Header>
        <Row>
          <Section start>
            <TitleLink href="/">
              PROEM
            </TitleLink>
          </Section>
        </Row>
      </Header>
    );
  }
}

export default AppToolbar
