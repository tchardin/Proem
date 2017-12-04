import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'

import {VictoryPie} from 'victory'

const Container = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1em;
`
const Message = styled.div`
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
`

const Header = styled.div`
  font-family: 'Gotham', sans-serif;
`

const Total = styled.h2`
  font-weight: bold;
  font-size: 1.5em;
`

const Change = styled.h3`
  font-size: 1em;
  color: ${props => props.positive ?
  '#0AFE00' : '#FF0000'};
`

class PDashboard extends React.Component {
  render() {
    const {
      allIds,
      assets,
      metrics
    } = this.props
    if (!allIds.length) {
      return (
        <Container>
          <Message>
            Add assets to get started.
          </Message>
        </Container>
      )
    }
    // Calculate totals for each asset
    console.log(`Metrics: ${JSON.stringify(metrics)}, Assets: ${JSON.stringify(assets)}`)
    let allBalances = metrics.map(m =>
      assets[m.symbol].balance * m.price)

    // Calculate the total value of the portfolio

    let total = allBalances.reduce((a, b) => a + b, 0)

    // Calculate the percent share of total portfolio for each asset

    let allPercentShares = allBalances.map(balance => balance/total)

    let sharesById = metrics.map(m => {
      return {
        x: m.symbol, y: assets[m.symbol].balance*m.price/total
      }
    })

    // Calculate how much percent change for each asset
    // let allPercentChanges = metrics.map(m =>
    //   Number(metrics[id][selectedFiat].items.percent_change_24h))

    // Calculate weighted average for total 24h change of portfolio
    let totalPercentChange = 0
    for (let i = 0; i < metrics.length; i++) {
      totalPercentChange += allPercentShares[i]*metrics[i].percentChange24H
    }

    let pie = <VictoryPie
                data={sharesById}
                padding={0}
                colorScale={["#FFF500", "#FF00C4", "#FFA700", "#0089FF", "#B100FF"]}
                innerRadius={100}
                labelRadius={130}
                style={{ labels: { fill: "#00CEFF", fontSize: 30, fontWeight: "bold", fontFamily: 'Gotham' } }}
                />

    return (
      <Container>
        <Header>
          <Total>
            {new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(total)}
          </Total>
          <Change
            positive={totalPercentChange > 0}>
              {Math.round(totalPercentChange*100)/100}%
          </Change>
        </Header>
        {pie}
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    allIds: state.portfolio.allIds,
    assets: state.portfolio.assets,
  }
}

export default connect(mapStateToProps)(PDashboard)
