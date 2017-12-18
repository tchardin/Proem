import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import isEqual from 'lodash/isEqual'
import {VictoryPie} from 'victory'
import {updateSelected} from '../store/ui'
import Transactions from './Transactions'

const Container = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2em;
  justify-content: flex-start;
`
const Message = styled.div`
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
  padding: 1em 0;
`

const Total = styled.h2`
  font-family: 'Gotham', sans-serif;
  font-weight: bold;
  font-size: 1.5em;
`

const Change = styled.h3`
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
  color: ${props => props.positive ?
  '#0AFE00' : '#FF0000'};
  margin: 0;
`

class PDashboard extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(this.props.metrics, nextProps.metrics) ||
      this.props.selectedTxs !== nextProps.selectedTxs ||
      this.props.displayEdit !== nextProps.displayEdit
    )
  }
  render() {
    const {
      allIds,
      assets,
      metrics,
      updateSelected,
    } = this.props
    if (!allIds.length || !allIds.includes(metrics[0].symbol)) {
      return (
        <Container>
          <Message>
            Add assets to get started.
          </Message>
        </Container>
      )
    }
    console.log('PDashboard renders')
    // Calculate totals for each asset
    // let allBalances = allIds.map(id => {
    //   let item = metrics.find(e => e.symbol === id)
    //   return assets[id].balance * Number(item.price)
    // })
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

    return (
      <Container>
          <Total>
            {new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(total)}
          </Total>
          <Change
            positive={totalPercentChange > 0}>
              {Math.round(totalPercentChange*100)/100}%
          </Change>
        <div>
          <VictoryPie
                      data={sharesById}
                      padding={0}
                      colorScale={["#FFF500", "#FF00C4", "#FFA700", "#0089FF", "#B100FF"]}
                      innerRadius={100}
                      labelRadius={130}
                      style={{
                        data: {cursor: 'pointer'},
                        labels: { fill: "#00CEFF", fontSize: 30, fontWeight: "bold", fontFamily: 'Gotham', cursor: 'pointer'}}}
                      events={[
                        {
                          target: 'data',
                          eventHandlers: {
                            onClick: () => {
                              return [{
                                target: 'data',
                                mutation: props => updateSelected('selectedTxs', props.datum.x)
                              }]
                            }
                          }
                        },{
                          target: 'labels',
                          eventHandlers: {
                            onClick: () => {
                              return [{
                                target: 'labels',
                                mutation: props => updateSelected('selectedTxs', props.datum.x)
                              }]
                            }
                          }
                        }
                      ]}/>
        </div>
        <Transactions />
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

export default connect(mapStateToProps, {
  updateSelected
})(PDashboard)
