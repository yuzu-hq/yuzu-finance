import { gql } from "@apollo/client";

export const marketNewsQuery = gql`
  query MarketNews {
    marketNews {
      title
      url
      time
      publisher
      imageUrl
      subjects {
        symbol
      }
    }
  }
`;
