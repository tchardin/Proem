/* @flow */

import React from 'react'
import styled from 'styled-components'
// TODO: use fragment container for better data handling
//import {graphql, createFragmentContainer} from 'react-relay'

const Title = styled.h2`
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
  color: black;
`

const Description = styled.p`
  font-family: 'Gotham', sans-serif;
  font-size: 0.7em;
  line-height: 1.6em;
  color: black;
`

const MetricsContainer = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`

const Row = styled.div`
  font-family: 'Gotham', sans-serif;
  font-size: 0.7em;
  line-height: 1.5em;
  color: black;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-top: solid #e6e6e6 1px;
`

const Color = styled.p`
  padding-left: 0.5em;
  color: ${props => props.positive ? 'lightGreen' : 'red'};
`

class MetricsMenu extends React.Component {
  render() {
    const {metrics, fiat} = this.props
    return (
      <MetricsContainer>
        <Title>{metrics.name}</Title>
        <Description>{metrics.description}</Description>
        <Row>
          <p>Market Cap: {new Intl.NumberFormat('en-US', { style: 'currency', currency: fiat }).format(metrics.marketCap)}</p>
          <p></p>
        </Row>
        <Row>
          <p>Volume (24h): {new Intl.NumberFormat('en-US', { style: 'currency', currency: fiat }).format(metrics.volume24H)}</p>
          <p></p>
        </Row>
        <Row>
          <p>Available Supply: {metrics.availableSupply.toLocaleString()}</p>
          <p></p>
        </Row>
        <Row>
          <p>Change (7D): </p>
          {metrics.percentChange24H > 0 ? (
            <Color positive>{metrics.percentChange7D}%</Color>
          ) : (
            <Color>{metrics.percentChange7D}%</Color>
          )}
        </Row>
        <Row>
          <p>Change (24h): </p>
          {metrics.percentChange24H > 0 ? (
            <Color positive>{metrics.percentChange24H}%</Color>
          ) : (
            <Color>{metrics.percentChange24H}%</Color>
          )}
        </Row>
        <Row>
          <p>Change (1h): </p>
          {metrics.percentChange24H > 0 ? (
            <Color positive>{metrics.percentChange1H}%</Color>
          ) : (
            <Color>{metrics.percentChange1H}%</Color>
          )}
        </Row>
      </MetricsContainer>
    )
  }
}

export default MetricsMenu
