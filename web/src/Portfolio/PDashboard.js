import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import moment from 'moment'
import {VictoryPie} from 'victory'
import {updateSelected} from '../store/ui'

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

const List = styled.div`
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

const Title = styled.h2`
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
  color: black;
  padding: 0.5em 0;
`

class PDashboard extends React.Component {
  render() {
    const {
      allIds,
      assets,
      metrics,
      selectedTxs,
      updateSelected
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

    let txs = selectedTxs ? assets[selectedTxs].transactions.map((t, i) => (
      <Row key={i}>
        <Label>{moment(t.date).format("MMM Do, YYYY")}</Label>
        <Value>{t.amount}</Value>
      </Row>
    )) : null

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
        <div>
          {pie}
        </div>
        <Title>{selectedTxs || "Click on chart to see transaction details"}</Title>
        <List>
          {txs}
        </List>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    allIds: state.portfolio.allIds,
    assets: state.portfolio.assets,
    selectedTxs: state.ui.selectedTxs,
  }
}

export default connect(mapStateToProps, {
  updateSelected
})(PDashboard)
