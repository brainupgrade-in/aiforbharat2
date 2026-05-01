import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || '/api/graphql'

const httpLink = new HttpLink({ uri: GRAPHQL_URL })

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('nazarai.token')
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
})

// On expired/invalid JWT, dispatch a window event the AuthProvider listens for,
// so the user is bounced back to sign-in instead of seeing opaque GraphQL errors.
function isAuthError(error) {
  if (!error) return false
  if (error.statusCode === 401) return true
  const code = error.extensions?.code
  if (code === 'invalid-jwt' || code === 'invalid-headers') return true
  return /JWT.*(expired|invalid)|Bearer.*expired/i.test(error.message || '')
}

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (isAuthError(networkError)) {
    window.dispatchEvent(new Event('nazarai:session-expired'))
    return
  }
  if (graphQLErrors?.some(isAuthError)) {
    window.dispatchEvent(new Event('nazarai:session-expired'))
  }
})

export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
})
