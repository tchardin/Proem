/**
 * React Static Boilerplate
 * Copyright (c) 2015-present Kriasoft. All rights reserved.
 */

/* @flow */

import React from 'react';
import isEqual from 'lodash/isEqual';
import { graphql, QueryRenderer } from 'react-relay';

import relay from '../relay';
import router from '../router';
import history from '../history';
import AppRenderer from './AppRenderer';

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

type Render = (Array<React.Element<*>>, ?Object, ?Object) => any;

type State = {
  location: Location,
  params: Object,
  query: ?Object,
  variables: Object,
  components: ?Array<React.Element<*>> | Promise<Array<React.Element<*>>>,
  render: ?Render,
};

class App extends React.Component<any, any, State> {
  state = {
    location: history.location,
    params: {},
    query: null,
    variables: {},
    components: null,
    render: null,
  };

  unlisten: () => void;

  componentDidMount() {
    // Start watching for changes in the URL (window.location)
    this.unlisten = history.listen(this.resolveRoute);
    this.resolveRoute(history.location);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  resolveRoute = (location: Location) =>
    // Find the route that matches the provided URL path and query string
    router.resolve({ path: location.pathname }).then(route => {
      const variables = isEqual(this.state.variables, route.variables)
        ? this.state.variables
        : route.variables;
      this.setState({ ...route, location, variables });
    });

  renderState = ({ error, props, retry }: ReadyState) => (
    <AppRenderer
      error={error}
      data={props}
      retry={retry}
      query={this.state.query}
      location={this.state.location}
      params={this.state.params}
      components={this.state.components}
      render={this.state.render}
    />
  );

  render() {
    return (
      <QueryRenderer
        environment={relay}
        query={this.state.query}
        variables={this.state.variables}
        render={this.renderState}
      />
    );
  }
}

// A hook that makes it possible to pre-render the app during compilation.
// Fore more information visit https://github.com/kriasoft/pre-render
window.prerender = async path => {
  history.push(path);
  // TODO: Detect when client-side rendering is complete
  await new Promise(resolve => setTimeout(resolve, 500));
  return document.documentElement.outerHTML
    .replace(/<link type="text\/css" rel="stylesheet" href="blob:.*?>/g, '')
    .replace(/<script .*?<\/head>/g, '</head>');
};

export default App;
