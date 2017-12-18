
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

const Sign = styled.span`
  transform: ${props => props.down === true ? 'rotate(90deg)' : 'rotate(-90deg)'};
`
const List = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 0;
`

const Item = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: 'Gotham', sans-serif;
  font-size: 0.7em;
  width: 100%;
`

const OrderBook = ({isOpen, handleClick, books}) => {
  let list = books.asks.map((a, i) => (
    <Item
      key={i}>
      <div>{a.price}</div>
      <div>{books.bids[i].price}</div>
    </Item>
  ))
  return (
    <Container>
      <Row
        onClick={() => handleClick('orderBook')}>
        <Label>order book</Label>
        <Sign
          down={isOpen}>
          <Arrow
            color="#000"
            size="12px"/>
        </Sign>
      </Row>
      {isOpen &&
        <List>
          {list}
        </List>
      }
    </Container>
  )
}

export default OrderBook
