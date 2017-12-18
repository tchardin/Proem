import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import CrossSvg from '../svg/Cross'

const Row = styled.div`
  font-family: 'Gotham', sans-serif;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: solid #e6e6e6 1px;
  height: 52px;
  & :last-child {
    border-bottom: solid #e6e6e6 1px;
  }
`

const Label = styled.p`
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: 500;
  line-height: 0;
  color: #5A5A5A;
  margin-left: ${props => props.margin === true ? '24px' : 0};
`

const Value = styled.p`
  font-size: 1em;
  color: black;
  font-weight: bold;
`

const DeleteBtn = styled.span`
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
`

const PListItem = ({displayEdit, tx, editPortfolio, selectedTxs, i}) => {
  return (
    <Row>
      <Label
        margin={displayEdit}>
        {moment(tx.date).format("MMM Do, YYYY")}
      </Label>
      <Value>
        {tx.amount}
      </Value>
      {displayEdit &&
        <DeleteBtn
          onClick={() => editPortfolio(tx, selectedTxs, i)}>
          <CrossSvg
            direction="cancel"
            size="16px"
            color="black"/>
        </DeleteBtn>}
    </Row>
  )
}

export default PListItem
