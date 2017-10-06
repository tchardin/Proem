import React, { Component} from 'react'
import history from '../../core/history'
import s from './styles.css'

class Link extends Component {
  handleClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (event.button !== 0 /* left click */) {
      return
    }

    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return
    }

    if (event.defaultPrevented === true) {
      return
    }

    event.preventDefault()

    if (this.props.to) {
      history.push(this.props.to)
    } else {
      history.push({
        pathname: event.currentTarget.pathname,
        search: event.currentTarget.search,
      })
    }
  }

  render() {
    const { to, ...props } = this.props
    return <a
      className={s.link}
      href={history.createHref(to)} {...props}
      onClick={(event) => { this.handleClick(event) }} />
  }
}

export default Link
