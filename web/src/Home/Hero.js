/**
 * React Static Boilerplate
 * Copyright (c) 2015-present Kriasoft. All rights reserved.
 */

/* @flow */

import React from 'react';
import styled from 'styled-components';

import Link from '../Link';

const Container = styled.div`
padding: 1em 1em 2em;
`

const Title = styled.h2`
  font-family: 'Gotham', sans-serif;
  font-weight: bold;
  font-size: 3em;
`

const Description = styled.p`
  font-family: 'Gotham', sans-serif;
  font-size: 3em;
`

const Button = styled(Link)`
  display: inline-block;
  padding: 0.5em 2em;
  margin-top: 1em;
  font-family: 'Roboto', sans-serif;
  color: #333;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  background-color: #fff;
  border-radius: 2px;

  &:active,
  &:hover,
  &:visited {
    color: #333;
  }
`;

class Hero extends React.Component {
  render() {
    return (
      <Container {...this.props}>
        <Title>PROEM</Title>
        <Description>
          Grow your cryptocurrency portfolio securely with our metric tools.
        </Description>
        <p>
          <Button href="/getting-started">Get Started</Button>
        </p>
      </Container>
    );
  }
}

export default Hero;
