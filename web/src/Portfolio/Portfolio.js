import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'

import PDashboard from './PDashboard'
import PForm from './PForm'

const PContainer = styled.div`
  display: flex;
  flex: 8;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

class Portfolio extends React.Component {
  render() {
    const {
      display,
      allAssets,
      pfAssets
    } = this.props
    return (
      <PContainer>
        {display ? (
          <PForm
            options={allAssets}/>
        ) : (
          <PDashboard
            metrics={pfAssets}/>
        )}
      </PContainer>
    )
  }
}

const mapStateToProps = state => ({
  display: state.form.portfolio.display
})

export default connect(mapStateToProps)(Portfolio)
