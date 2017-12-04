/* @flow */

import React from 'react'
import styled from 'styled-components'

const AboutContainer = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`

const Description = styled.p`
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
  line-height: 1.8em;
  color: black;
`

class AboutMenu extends React.Component {
  render() {
    return (
      <AboutContainer>
        <Description>
          <strong>Proem</strong> is a graphic facilitator for crypto assets. We make managing tokens easy and accessible by bringing together
          market visualizations for a seamless portfolio experience.
          The app is secure and decentralized. The data you input stays between your browser and your encrypted Blockstack storage.
          Stay tuned as more features roll out!
        </Description>
      </AboutContainer>
    )
  }
}

export default AboutMenu
