/**
 * React Static Boilerplate
 * Copyright (c) 2015-present Kriasoft. All rights reserved.
 */

/* @flow */

import { Environment, Network, RecordSource, Store } from 'relay-runtime';

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns the result as a Promise:
function fetchQuery(
  operation,
  variables,
  // cacheConfig,
  // uploadables,
) {
  return fetch(
    'http://proemgsql-dev.us-east-1.elasticbeanstalk.com/graphql/',
    {
      method: 'POST',
      headers: {
        // Add authentication and other headers here
        'content-type': 'application/json',
      },
      credentials: 'omit',
      body: JSON.stringify({
        query: operation.text, // GraphQL text from input
        variables,
      }),
    },
  ).then(response => response.json());
}

export default new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});