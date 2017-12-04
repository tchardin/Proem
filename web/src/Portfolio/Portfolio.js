import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'

import PDashboard from './PDashboard'
import PForm from './PForm'

const PContainer = styled.div`
`

class Portfolio extends React.Component {
  render() {
    const {
      displayForm,
      allAssets,
      pfAssets
    } = this.props
    return (
      <PContainer>
        <PDashboard
          metrics={pfAssets}/>
        <PForm
          options={allAssets}/>
      </PContainer>
    )
  }
}

const mapStateToProps = state => ({
  displayForm: state.form.portfolio.display
})

export default connect(mapStateToProps)(Portfolio)
