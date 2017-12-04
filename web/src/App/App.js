/**
 * Everything happens here...
 *
 */

/* @flow */

import React from 'react';
// import isEqual from 'lodash/isEqual';
import {QueryRenderer } from 'react-relay';

import relay from '../relay';
import history from '../history';
import AppRenderer from './AppRenderer';
import {connect} from 'react-redux'
import {resolveRoute, findPortfolio} from '../store/routing.js'
import {loadUser} from '../store/user.js'

import {injectGlobal} from 'styled-components'
import GothamBold from '../fonts/Gotham-Bold.ttf'
import GothamBook from '../fonts/Gotham-Book.ttf'
import GothamMedium from '../fonts/Gotham-Medium.ttf'

injectGlobal`
  @font-face {
    font-family: Gotham;
    src: url('${GothamBold}') format('truetype');
    font-weight: bold;
  }
  @font-face {
    font-family: Gotham;
    src: url('${GothamBook}') format('truetype');
    font-weight: normal;
  }
  @font-face {
    font-family: Gotham;
    src: url('${GothamMedium}') format('truetype');
    font-weight: 500;
  }
`

type ReadyState = {
  error: ?Error,
  props: ?Object,
  retry: ?() => void,
};

class App extends React.Component<any, any, State> {
  unlisten: () => void;

  componentDidMount() {
    // Start watching for changes in the URL (window.location)
    this.props.loadUser()
    this.props.findPortfolio()
    this.unlisten = history.listen(this.props.resolveRoute)
    this.props.resolveRoute(history.location)
  }

  componentWillUnmount() {
    this.unlisten();
  }

  renderState = ({ error, props, retry }: ReadyState) => (
    <AppRenderer
      error={error}
      data={props}
      retry={retry}
      query={this.props.query}
      location={this.props.location}
      params={this.props.params}
      components={this.props.components}
      render={this.props.render}
    />
  );

  render() {
    return (
      <QueryRenderer
        environment={relay}
        query={this.props.query}
        variables={this.props.variables}
        render={this.renderState}
      />
    );
  }
}

const mapStateToProps = state => ({
  ...state.routing
})

export default connect(mapStateToProps, {
  loadUser,
  resolveRoute,
  findPortfolio
})(App)
