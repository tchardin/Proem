import React, {Component} from 'react'
import s from './styles.css'
import Link from './../Link/Link'

class PButton extends Component {
  handleClick(event) {
    this.props.onClick(event)
  }
  render() {
    const {caption, type, target} = this.props
    let content
    if (this.props.type === 'primary') {
      content = (
        <div
          className={s.primaryButton}>
          <span className={s.primaryCaption}>
            {caption.toUpperCase()}
          </span>
        </div>
      )
    } else {
      content = (
        <div
          className={s.primaryButton}>
          <span className={s.secondCaption}>
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
