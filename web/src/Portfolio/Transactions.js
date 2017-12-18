import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {toggleEdit} from '../store/ui'
import {editPortfolio} from '../store/portfolio'
import Item from './PListItem'

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: solid black 1px;
`

const Title = styled.h2`
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
  color: black;
  padding: 0.5em 0;
`

const EditBtn = styled.span`
  font-family: 'Gotham', sans-serif;
  font-size: 0.8em;
  color: black;
`

class Transactions extends React.Component {
  render() {
    const {
      assets,
      selectedTxs,
      displayEdit,
      toggleEdit,
      editPortfolio
    } = this.props
    let txs = selectedTxs ? assets[selectedTxs].transactions.map((t, i) => (
      <Item
        key={i}
        displayEdit={displayEdit}
        tx={t}
        editPortfolio={editPortfolio}
        selectedTxs={selectedTxs}/>
    )) : null
    return (
      <React.Fragment>
        <Header>
          <Title>{selectedTxs || "Click on the chart to see transaction details."}</Title>
          {selectedTxs &&
          <EditBtn
            onClick={() => toggleEdit()}>
            {displayEdit ? 'Done' : 'Edit'}
          </EditBtn>}
        </Header>
        {txs}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  assets: state.portfolio.assets,
  selectedTxs: state.ui.selectedTxs,
  displayEdit: state.ui.edit
})

export default connect(mapStateToProps, {
  toggleEdit,
  editPortfolio
})(Transactions)
