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

class PFooter extends React.PureComponent {
  render() {
    const {display, displayForm} = this.props
    return (
      <Container>
        {display &&
          <Button
            type="primary"
            caption="Input new asset"
            onPress={() => displayForm('portfolio')}/>}
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
