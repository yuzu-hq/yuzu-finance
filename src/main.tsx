import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/index.css";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";

const link = new HttpLink({
  // TODO: change me
  uri: "https://graph.yuzu.dev/graphql", //"http://localhost:4000/graphql",
  headers: {
    Authorization: "Bearer demo",
  },
});

export default function createClient(): ApolloClient {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={createClient()}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
