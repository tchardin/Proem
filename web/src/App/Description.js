
import React from 'react'
import styled from 'styled-components'

import Arrow from '../svg/Arrow'

const Container = styled.div`
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
  cursor: pointer;
`

const Label = styled.p`
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: 500;
  line-height: 0;
  color: #5A5A5A;
`

const Value = styled.p`
  font-size: 5em;
  color: black;
`

const Paragraph = styled.p`
  font-family: 'Gotham', sans-serif;
  font-size: 0.7em;
  line-height: 1.6em;
  color: black;
  border-bottom: solid #e6e6e6 1px;
  padding-bottom: 1em;
`

const Sign = styled.span`
  transform: ${props => props.down === true ? 'rotate(90deg)' : 'rotate(-90deg)'};
`

const Description = ({isOpen, handleClick, text}) => {
    return (
      <Container>
        <Row
          onClick={() => handleClick()}>
          <Label>info</Label>
          <Sign
            down={isOpen}>
            <Arrow
              color="#000"
              size="12px" />
          </Sign>
        </Row>
        {isOpen &&
          <Paragraph>{text}</Paragraph>
        }
      </Container>
    )
}

export default Description
