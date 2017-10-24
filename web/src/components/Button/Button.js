import React, {Component} from 'react'
import './Button.css'

class PButton extends Component {
  handleClick(event) {
    this.props.onClick(event)
  }
  render() {
    const {caption, type} = this.props
    let content
    if (type === 'primary') {
      content = (
        <div
          className="primaryButton">
          <span className="primaryCaption">
            {caption.toUpperCase()}
          </span>
        </div>
      )
    } else {
      content = (
        <div
          className="primaryButton">
          <span className="secondCaption">
            {caption.toUpperCase()}
          </span>
        </div>
      )
    }
    return (
      <a onClick={event => this.handleClick(event)}>
        {content}
      </a>
    )
  }
}

export default PButton
