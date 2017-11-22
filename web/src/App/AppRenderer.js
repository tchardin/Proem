
/* @flow */

import React from 'react'
import styled from 'styled-components'
import isEqual from 'lodash/isEqual'

import AppToolbar from './AppToolbar'
import ErrorPage from '../ErrorPage'
import Chart from '../Home/Chart'
import AppMain from './AppMain'

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
`

const Main = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0 auto;
`

const Right = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction:  column;
  justify-content: flex-end;
  align-items: flex-end;
  background: black;
`

const Left = styled.div`
  display: none;
`

type Props = {
  error: ?Error,
  data: ?Object,
  retry: () => void,
  query: Function,
  location: Location,
  params: Object,
  components: Array<React.Element<*>> | Promise<Array<React.Element<*>>>,
  render: ?(Array<React.Element<*>>, ?Object, ?Object) => any,
}

type State = {
  error: ?Error,
  title: ?string,
  description: ?string,
  chart: ?React.Element<*>,
  footer: ?React.Element<*>
}

const defaults = {
  error: null,
  title: 'PROEM',
  description: '',
  chart: null,
  footer: null
}

class AppRenderer extends React.Component<any, Props, State> {
  state = { ...defaults };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.error && this.props.error !== nextProps.error) {
      this.setState({ error: nextProps.error });
    } else if (
      ((nextProps.query && nextProps.data) ||
        (!nextProps.query && !nextProps.data)) &&
      (this.props.data !== nextProps.data ||
        this.props.location !== nextProps.location ||
        !isEqual(this.props.params, nextProps.params) ||
        this.props.components !== nextProps.components ||
        this.props.render !== nextProps.render)
    ) {
      const promise = Promise.resolve(nextProps.components);

      if (nextProps.render && nextProps.components === promise) {
        promise.then(components => {
          if (
            this.props.components === nextProps.components &&
            nextProps.render
          ) {
            this.setState({
              ...defaults,
              ...nextProps.render(
                components,
                this.props.data,
                this.props.params,
              ),
            });
          }
        });
      } else if (nextProps.render) {
        this.setState({
          ...defaults,
          ...nextProps.render(
            nextProps.components,
            nextProps.data,
            nextProps.params,
          ),
        });
      } else {
        this.setState({ error: new Error('The .render() method is missing.') });
      }
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      this.props.error !== nextState.error ||
      this.state.title !== nextState.title ||
      this.state.description !== nextState.description ||
      this.state.footer !== nextState.footer ||
      this.state.chart !== nextState.chart
    );
  }

  render() {
    console.log(this.props.data)
    return this.state.error ? (
      <ErrorPage error={this.state.error} />
    ) : (
      <AppContainer>
        <AppMain
          chart={this.state.chart}
          footer={this.state.footer}/>
      </AppContainer>
    )
  }
}

export default AppRenderer
