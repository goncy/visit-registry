import ApolloClient, { createNetworkInterface } from 'apollo-client'

export default function configureApolloClient () {
  const networkInterface = createNetworkInterface({
    uri: 'https://api.graph.cool/simple/v1/cj2d8t5lenpkp0104eljjrghu'
  })

  networkInterface.use([{
    applyMiddleware (req, next) {
      if (!req.options.headers) {
        req.options.headers = {}
      }

      const token = localStorage.getItem('token')
      req.options.headers.authorization = token ? `Bearer ${token}` : null
      next()
    }
  }])

  return new ApolloClient({
    dataIdFromObject: o => o.id,
    networkInterface
  })
}
