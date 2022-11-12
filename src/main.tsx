import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";

import React from "react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./styles/index.css";
import ReactDOM from "react-dom/client";

//import { BatchHttpLink } from "@apollo/client/link/batch-http";

const link = new HttpLink({
  uri: "https://graph.yuzu.dev/graphql",
  headers: {
    Authorization: "Bearer demo",
  },
});

export default function createClient(): ApolloClient<unknown> {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={createClient()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
