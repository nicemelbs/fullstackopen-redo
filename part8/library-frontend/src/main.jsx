import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import {
  ApolloLink,
  HttpLink,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client'

const split = ApolloLink.split

import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context'

import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })
const wsLink = new GraphQLWsLink(createClient({ url: 'ws:localhost:4000' }))

const authLink = new SetContextLink(({ headers }) => {
  const token = window.localStorage.getItem('library-user-token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
