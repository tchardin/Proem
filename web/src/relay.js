/**
 *
 *
 */

/* @flow */

import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import RelayQueryResponseCache from 'relay-runtime/lib/RelayQueryResponseCache'

const oneMinute = 60*1000
const oneHour = 60*oneMinute
const cache = new RelayQueryResponseCache({size: 1000, ttl: oneHour})

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns the result as a Promise:
function fetchQuery(
  operation,
  variables,
  cacheConfig,
  // uploadables,
) {
  const queryID = operation.text
  const forceFetch = cacheConfig && cacheConfig.force

  const fromCache = cache.get(queryID, variables)
  if (
    fromCache !== null &&
    !forceFetch
  ) {
    return fromCache
  }
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
  ).then(response => response.json())
  .then(json => {
    if (json) {
      cache.set(queryID, variables, json)
    }
    return json
  })
}

export default new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});
