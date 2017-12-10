/* @flow */

import React from 'react'
import styled from 'styled-components'
// TODO: use fragment container for better data handling
//import {graphql, createFragmentContainer} from 'react-relay'

import Description from './Description'
import OrderBook from './OrderBook'

const Title = styled.h2`
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
  color: black;
  padding: 0.5em 0;
`

// const Description = styled.p`
//   font-family: 'Gotham', sans-serif;
//   font-size: 0.7em;
//   line-height: 1.6em;
//   color: black;
// `

const MetricsContainer = styled.div`
  display: flex;
  flex: 8;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`

const Row = styled.div`
  font-family: 'Gotham', sans-serif;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: solid #e6e6e6 1px;
  height: 52px;
  & :last-child {
    border-bottom: solid #e6e6e6 1px;
  }
`

const Color = styled.p`
  padding-left: 0.5em;
  color: ${props => props.positive ? 'lightGreen' : 'red'};
`

const Label = styled.p`
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: 500;
  line-height: 0;
  color: #5A5A5A;
`

const Value = styled.p`
  font-size: 1em;
  color: black;
`
const List = styled.div`
  width: 100%;
`

class MetricsMenu extends React.Component {
  state = {
    description: false,
    orderBook: false,
  }
  toggleText = (item) => {
    this.setState(prevState => ({
      [item]: !prevState[item]
    }))
  }
  render() {
    const {metrics, fiat, books} = this.props
    return (
      <MetricsContainer>
        <Title>{metrics.name}</Title>
        <Description
          text={metrics.description}
          isOpen={this.state.description}
          handleClick={this.toggleText}/>
        {!this.state.description &&
          <OrderBook
            books={books}
            isOpen={this.state.orderBook}
            handleClick={this.toggleText}/>}
        {!this.state.description && !this.state.orderBook &&
          <List>
            <Row>
              <Label>mkt cap</Label>
              <Value>{new Intl.NumberFormat('en-US', { style: 'currency', currency: fiat }).format(metrics.marketCap)}</Value>
            </Row>
            <Row>
              <Label>vol 24h</Label>
              <Value>{new Intl.NumberFormat('en-US', { style: 'currency', currency: fiat }).format(metrics.volume24H)}</Value>
            </Row>
            <Row>
              <Label>supply</Label>
              <Value>{Number(metrics.availableSupply).toLocaleString()}</Value>
            </Row>
            <Row>
              <Label>change 7d</Label>
              {Number(metrics.percentChange24H) > 0 ? (
                <Color positive>{metrics.percentChange7D}%</Color>
              ) : (
                <Color>{metrics.percentChange7D}%</Color>
              )}
            </Row>
            <Row>
              <Label>change 24h</Label>
              {Number(metrics.percentChange24H) > 0 ? (
                <Color positive>{metrics.percentChange24H}%</Color>
              ) : (
                <Color>{metrics.percentChange24H}%</Color>
              )}
            </Row>
            <Row>
              <Label>change 1h</Label>
              {Number(metrics.percentChange24H) > 0 ? (
                <Color positive>{metrics.percentChange1H}%</Color>
              ) : (
                <Color>{metrics.percentChange1H}%</Color>
              )}
            </Row>
          </List>
        }
      </MetricsContainer>
    )
  }
}

export default MetricsMenu
