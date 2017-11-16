/**
 * Permanent footer throughout the app
 *
 */

/* @flow */

import React from 'react'
import styled from 'styled-components'

import ListItem from './ListItem'
import Arrow from '../svg/Arrow'
import Curve from '../svg/Curve'
import Candle from '../svg/Candle'

  const Footer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    background color: transparent;
    padding: 1em 0 1em 0;
  `

  const LeftControls = styled.div`
    font-family: 'Gotham';
    font-weight: bold;
    font-size: 3em;
    color: white;
    padding: 0 1em 0 1em;
    user-select: none;
    display: flex;
    flex-direction: row;
  `

  const RightControls = styled.div`
    font-family: 'Gotham';
    font-weight: bold;
    font-size: 3em;
    color: white;
    padding: 0 1em 0 1em;
    user-select: none;
  `
  const CenterControls = styled.div`
    display: flex;
    align-items: center;
  `

  const LeftBtn = styled.div`
    cursor: pointer;
    padding: 0.5em;
  `

  const RightBtn = styled.div`
    transform: rotate(180deg) translateY(4px);
    cursor: pointer;
    padding: 0.5em;
  `

  const ControlList = styled.div`
    max-width: 500px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
    white-space: nowrap;
    font-family: 'Gotham';
    font-size: 1em;
    line-height: 1.35em;
  `

  const FiatSelector = styled.div`
    display: inline-block;
  	max-width: 100%;
  	position: relative;
  	vertical-align: top;
  `

  const Selector = styled.select`
    moz-appearance: none;
    -webkit-appearance: none;
    align-items: center;
    border: 1px solid transparent;
    box-shadow: none;
    display: inline-flex;
    justify-content: flex-start;
    position: relative;
    vertical-align: top;
    background-color: transparent;
    color: white;
    cursor: pointer;
    display: block;
    font-size: 1em;
    font-weight: bold;
    max-width: 100%;
    outline: none;
  `

class AppFooter extends React.Component {
  render() {
    return (
      <Footer>
        <LeftControls>
          <Curve color="#FFFFFF" />
          <Candle color="#FFFFFF" />
        </LeftControls>
        <CenterControls>
          <LeftBtn>
            <Arrow
              color="#fff"
              size="25px" />
          </LeftBtn>
          <ControlList>
            {
              this.props.assets.map((a, i) => (
                <ListItem
                  item={a.metrics[0]}
                  key={i}/>
              ))
            }
          </ControlList>
          <RightBtn>
            <Arrow
              color="#fff"
              size="25px" />
          </RightBtn>
        </CenterControls>
        <RightControls>
          <FiatSelector>
            <Selector>
              {this.props.fiats.map(
                f => <option value={f} key={f}>{f}</option>)}
            </Selector>
          </FiatSelector>
        </RightControls>
      </Footer>
    );
  }
}

export default AppFooter
