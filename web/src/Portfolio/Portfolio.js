import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'

import PDashboard from './PDashboard'
import PForm from './PForm'

const PContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
        <PDashboard
          metrics={pfAssets}/>
        {display &&
          <PForm
            options={allAssets}/>}
      </PContainer>
    )
  }
}

const mapStateToProps = state => ({
  display: state.form.portfolio.display
})

export default connect(mapStateToProps)(Portfolio)
