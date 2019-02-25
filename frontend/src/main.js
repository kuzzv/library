import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";

Vue.config.productionTip = false;

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_GRAPHQL_HOST
});

import { ApolloLink } from "apollo-link";
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem("token");
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  });

  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: "loading"
  }
});

new Vue({
  render: h => h(App),
  apolloProvider
}).$mount("#app");
