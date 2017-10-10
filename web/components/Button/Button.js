import React, {Component} from 'react'
import s from './styles.css'
import Link from './../Link/Link'

class PButton extends Component {
  render() {
    const caption = this.props.caption
    const style = this.props.style
    let content
    if (this.props.type === 'primary') {
      content = (
        <div
          className={s.primaryButton}>
          <span className={s.primaryCaption}>
            {caption}
          </span>
        </div>
      )
    }
    return (
      <Link to={this.props.target}>
        {content}
      </Link>
    )
  }
}

export default PButton
