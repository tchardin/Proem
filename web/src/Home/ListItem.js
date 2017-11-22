/* @flow */

import React, {Component} from 'react'
import styled from 'styled-components'
import { graphql, createFragmentContainer } from 'react-relay'
import Link from '../Link'

const Container = styled(Link)`
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  opacity: ${props => props.selected ?
  1 : 0.5};
`

const Label = styled.label`
  margin: 0.5em;
  cursor: pointer;
  user-select: none;
`

const Title = styled.h3`
  font-size: 1em;
  font-family: 'Gotham';
  margin: 0;
`

const Price = styled.p`
  font-size: 1em;
  font-family: 'Gotham';
  margin: 0;
`

const Change = styled.p`
  font-size: 1em;
  font-family: 'Gotham';
  margin: 0;
  color: ${props => props.positive ?
  '#0AFE00' : '#FF0000'};
`

class ListItem extends Component {
  render() {
    const item = this.props.item || {}
    return (
      <Container
        href={`/history/${item.symbol}/USD`}
        selected={item.symbol === this.props.selected}>
          <Label>
            <Title>{item.symbol}</Title>
            <Price>{new Intl.NumberFormat('en-US', {
              style: 'currency', currency: 'USD' }).format(item.price)}</Price>
            <Change
              positive={item.percentChange24H > 0}>
              {item.percentChange24H}%
            </Change>
          </Label>
      </Container>
    )
  }
}

export default createFragmentContainer(
  ListItem,
  graphql`
    fragment ListItem_item on MetricsType {
      symbol
      price
      percentChange24H
    }
  `,
)
