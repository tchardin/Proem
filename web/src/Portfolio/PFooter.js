/* @flow */

import React from 'react'
import {connect} from 'react-redux'
import {displayForm} from '../store/form'
import styled from 'styled-components'
import Button from '../Button'

const Container = styled.div`
  display: flex;
  flex: 1;
  /* min-height: 100px; */
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  font-family: 'Gotham', sans-serif;
  color: black;
  width: 100%;
`

class PFooter extends React.Component {
  render() {
    const {display, displayForm} = this.props
    return (
      <Container>
        {display &&
          <Button
            type="primary"
            caption="Import manually"
            onPress={() => displayForm('portfolio')}/>}
        <Button
          type="primary"
          caption="Import from exchange"
          onPress={() => alert('Coming soon!')}/>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  display: !state.form.portfolio.display
})

export default connect(mapStateToProps, {
  displayForm
})(PFooter)
