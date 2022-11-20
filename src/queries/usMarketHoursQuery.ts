import { gql } from "@apollo/client";

export const usMarketHours = gql`
  query usMarketHours {
    usMarketHours {
      openNow
      previousTradingDay {
        openTime
        closeTime
      }
      nextTradingDay {
        openTime
        closeTime
      }
    }
  }
`;
