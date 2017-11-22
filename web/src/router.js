/**
 * React Static Boilerplate
 *
 */

/* @flow */

import React from 'react';
import Router from 'universal-router';
import { graphql } from 'relay-runtime';

// The list of all application routes where each route contains a URL path string (pattern),
// the list of components to load asynchronously (chunks), data requirements (GraphQL query),
// and a render() function which shapes the result to be passed into the top-level (App) component.
// For more information visit https://github.com/kriasoft/universal-router
const routes = [
  {
    path: '/',
    query: graphql`query routerHomeQuery {
      history(coin: "BTC", fiat: "USD") {
        date
        last
      }
      assets(fiat: "USD") {
        metrics {
          ...ListItem_item
        }
      }
      supported {
        fiats
      }
    }`, // prettier-ignore
    components: () => [
      import(/* webpackChunkName: 'home' */ './Home/Chart'),
      import('./Home/AppFooter'),
    ],
    render: ([Chart, AppFooter], data) => ({
      title: 'Home page',
      chart: <Chart data={data.history} />,
      footer: <AppFooter
                assets={data.assets}
                fiats={data.supported[0].fiats}/>,
    }),
  },
  {
    path: '/history',
    children: [
      {
        path: '/:coin/:fiat',
        query: graphql`query routerHistoryQuery($coin: String!, $fiat: String!) {
          history(coin: $coin, fiat: $fiat) {
            date
            last
          }
          assets(fiat: "USD") {
            metrics {
              ...ListItem_item
            }
          }
          supported {
            fiats
          }
        }`,
        components: () => [
          import(/* webpackChunkName: 'home' */ './Home/Chart'),
          import('./Home/AppFooter'),
        ],
        render: ([Chart, AppFooter], data, params) => ({
          title: 'Home page',
          chart: <Chart data={data.history} />,
          footer: <AppFooter
                    selected={params.coin}
                    assets={data.assets}
                    fiats={data.supported[0].fiats}/>,
        }),
      }
    ]
  },
  {
    path: '/error',
    components: () => [import(/* webpackChunkName: 'main' */ './ErrorPage')],
    render: ([ErrorPage]) => ({
      title: 'Error',
      body: <ErrorPage />,
    }),
  }
];

function resolveRoute({ route, fetch, next }, params) {
  // Skip routes that have no .render() method
  if (!route.render) return next();

  // Shape the result to be passed into the top-level React component (App)
  return {
    params,
    query: route.query,
    variables:
      typeof route.variables === 'function'
        ? route.variables(params)
        : { ...params },
    components:
      typeof route.components === 'function'
        ? Promise.all(
            route.components().map(promise => promise.then(x => x.default)),
          ).then(components => (route.components = components))
        : route.components,
    render: route.render,
  };
}

export default new Router(routes, { resolveRoute });
