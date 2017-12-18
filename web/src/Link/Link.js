/**
 * Link
 *
 */

/* @flow */

import React from 'react'
import history from '../history'

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends React.PureComponent {
  static defaultProps = {
    onClick: null,
  };

  handleClick = (event: MouseEvent) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    history.push(this.props.href);
  };

  render() {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a {...this.props} onClick={this.handleClick} />;
  }
}

export default Link;
