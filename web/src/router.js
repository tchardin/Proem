/**
 * Declarative Routing
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
    query: graphql`query routerInitialQuery($coin: [String], $fiat: String) {
      history(coins: $coin, fiat: $fiat) {
        values {
          date
          last
        }
      }
      assets(fiat: $fiat) {
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
      import('./App/UserGreetings'),
      import('./App/MenuList'),
      import('./App/ToolBox'),
    ],
    render: ([Chart, AppFooter, UserGreetings, MenuList, ToolBox], data) => ({
      title: 'Home',
      chart: <Chart
              data={data.history[0].values}
              view="HISTORY"/>,
      footer: <AppFooter
                assets={data.assets}
                fiats={data.supported[0].fiats}
                view="HISTORY"/>,
      menuHeader: <UserGreetings />,
      menuBody: <MenuList
                  view="HISTORY"/>,
      menuFooter: <ToolBox />
    }),
  },
  {
    path: '/about',
    query: graphql`query routerAboutQuery($coin: [String], $fiat: String) {
      history(coins: $coin, fiat: $fiat) {
        values {
          date
          last
        }
      }
      assets(fiat: $fiat) {
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
      import('./App/MenuHeader'),
      import('./App/AboutMenu'),
      import('./App/ToolBox'),
    ],
    render: ([Chart, AppFooter, MenuHeader, AboutMenu, ToolBox], data) => ({
      title: 'Home',
      chart: <Chart
              data={data.history[0].values}
              view="HISTORY"/>,
      footer: <AppFooter
                assets={data.assets}
                fiats={data.supported[0].fiats}
                view="HISTORY"/>,
      menuHeader: <MenuHeader
                    title="About"
                    href={`/`}/>,
      menuBody: <AboutMenu />,
      menuFooter: <ToolBox />
    }),
  },
  {
    path: '/candles',
    children: [
      {
        path: '/:coin/:fiat',
        children: [
          {
            path: '/',
            query: graphql`query routerCandlesQuery($coin: [String], $fiat: String) {
              candles(coins: $coin, fiat: $fiat) {
                exchange
                url
                values {
                  date
                  open
                  close
                  high
                  low
                }
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
              import('./App/UserGreetings'),
              import('./App/MenuList'),
              import('./App/ToolBox'),
            ],
            render: ([Chart, AppFooter, UserGreetings, MenuList, ToolBox], data, params) => ({
              title: 'Home page',
              chart: <Chart
                        data={data.candles[0].values}
                        view="CANDLES"/>,
              footer: <AppFooter
                        assets={data.assets}
                        fiats={data.supported[0].fiats}
                        view="CANDLES"/>,
              menuHeader: <UserGreetings />,
              menuBody: <MenuList
                          view="CANDLES"/>,
              menuFooter: <ToolBox />
            }),
          },
          {
            path: '/metrics',
            query: graphql`query routerMetricsCandlesQuery($coin: [String], $fiat: String) {
              candles(coins: $coin, fiat: $fiat) {
                exchange
                url
                values {
                  date
                  open
                  close
                  high
                  low
                }
              }
              metrics(coins: $coin, fiat: $fiat) {
                name
                description
                marketCap
                volume24H
                availableSupply
                totalSupply
                percentChange7D
                percentChange24H
                percentChange1H
              }
              assets(fiat: $fiat) {
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
              import('./App/MenuHeader'),
              import('./App/MetricsMenu'),
              import('./App/ToolBox')
            ],
            render: ([Chart, AppFooter, MenuHeader, MetricsMenu, ToolBox], data, params) => ({
              title: 'Metrics',
              chart: <Chart
                        data={data.candles[0].values}
                        view="CANDLES"/>,
              footer: <AppFooter
                        assets={data.assets}
                        fiats={data.supported[0].fiats}
                        view="CANDLES"
                        metrics={true}/>,
              menuHeader: <MenuHeader
                            title="Metrics"
                            href={`/history/${params.coin}/${params.fiat}`}/>,
              menuBody: <MetricsMenu
                          metrics={data.metrics[0]}
                          fiat={params.fiat}/>,
              menuFooter: <ToolBox />
            }),
          }
        ]
      }
    ]
  },
  {
    path: '/history',
    children: [
      {
        path: '/:coin/:fiat',
        children: [
          {
            path: '/',
            query: graphql`query routerHistoryQuery($coin: [String], $fiat: String) {
              history(coins: $coin, fiat: $fiat) {
                values {
                  date
                  last
                }
              }
              assets(fiat: $fiat) {
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
              import('./App/UserGreetings'),
              import('./App/MenuList'),
              import('./App/ToolBox'),
            ],
            render: ([Chart, AppFooter, UserGreetings, MenuList, ToolBox], data, params) => ({
              title: 'Home',
              chart: <Chart
                        data={data.history[0].values}
                        view="HISTORY"/>,
              footer: <AppFooter
                        assets={data.assets}
                        fiats={data.supported[0].fiats}
                        view="HISTORY"/>,
              menuHeader: <UserGreetings />,
              menuBody: <MenuList
                          view="HISTORY"/>,
              menuFooter: <ToolBox />
            }),
          },
          {
            path: '/metrics',
            query: graphql`query routerMetricsHistoryQuery($coin: [String], $fiat: String) {
              history(coins: $coin, fiat: $fiat) {
                values {
                  date
                  last
                }
              }
              metrics(coins: $coin, fiat: $fiat) {
                name
                description
                marketCap
                volume24H
                availableSupply
                totalSupply
                percentChange7D
                percentChange24H
                percentChange1H
              }
              assets(fiat: $fiat) {
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
              import('./App/MenuHeader'),
              import('./App/MetricsMenu'),
              import('./App/ToolBox')
            ],
            render: ([Chart, AppFooter, MenuHeader, MetricsMenu, ToolBox], data, params) => ({
              title: 'Metrics',
              chart: <Chart
                        data={data.history[0].values}
                        view="HISTORY"/>,
              footer: <AppFooter
                        assets={data.assets}
                        fiats={data.supported[0].fiats}
                        view="HISTORY"
                        metrics={true}/>,
              menuHeader: <MenuHeader
                            title="Metrics"
                            href={`/history/${params.coin}/${params.fiat}`}/>,
              menuBody: <MetricsMenu
                          metrics={data.metrics[0]}
                          fiat={params.fiat}/>,
              menuFooter: <ToolBox />
            }),
          }
        ]
      }
    ]
  },
  {
    path: '/portfolio',
    children: [
      {
        path: '/:fiat',
        query: graphql`query routerPortfolioQuery($group: [String], $fiat: String, $date: String) {
          history(coins: $group, fiat: $fiat, dateFrom: $date) {
            coin
            values {
              date
              last
            }
          }
          metrics(coins: $group, fiat: $fiat) {
            symbol
            price
            percentChange24H
          }
          assets(coins: $group, fiat: $fiat) {
            metrics {
              ...ListItem_item
            }
          }
          supported {
            fiats
            coins
          }
        }`,
        components: () => [
          import('./Portfolio/PChart'),
          import('./Home/AppFooter'),
          import('./App/MenuHeader'),
          import('./Portfolio/Portfolio'),
          import('./Portfolio/PFooter')
        ],
        render: ([PChart, AppFooter, MenuHeader, Portfolio, PFooter], data, params) => ({
          title: 'Portfolio',
          chart: <PChart
                    data={data.history}
                    />,
          footer: <AppFooter
                    assets={data.assets}
                    fiats={data.supported[0].fiats}
                    portfolio={true}
                    view="PORTFOLIO"/>,
          menuHeader: <MenuHeader
                        title="Portfolio"
                        href={'/'} />,
          menuBody: <Portfolio
                        allAssets={data.supported[0].coins}
                        fiats={data.supported[0].fiats}
                        pfAssets={data.metrics}/>,
          menuFooter: <PFooter />
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
  console.log(route)
  // Shape the result to be passed into the top-level React component (App)
  return {
    params,
    query: route.query,
    variables:
      typeof route.variables === 'function'
        ? route.variables(params)
        : { ...params},
    components:
      typeof route.components === 'function'
        ? Promise.all(
            route.components().map(promise => promise.then(x => x.default)),
          ).then(components => (route.components = components))
        : route.components,
    render: route.render,
  }
}

export default new Router(routes, { resolveRoute });
