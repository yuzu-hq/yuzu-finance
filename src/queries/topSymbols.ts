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

export const usEquities = gql`
  query SecuritiesQuery($input: SecurityFilterInput, $aggregatesInput: SecurityAggregateFilterInput) {
    securities(input: $input) {
      id
      symbol
      name
      issuer {
        name
      }
      lastTrade {
        price
        time
      }
      aggregates(input: $aggregatesInput) {
        time
        close
      }
    }
  }
`;

export const crypto = gql`
  query CryptoQuery($input: CryptoTradingPairFilterInput, $aggregatesInput: CryptoTradingPairAggregateFilterInput) {
    cryptoTradingPairs(input: $input) {
      id
      symbol
      lastTrade {
        price
        time
      }
      aggregates(input: $aggregatesInput) {
        time
        close
      }
    }
  }
`;

export const forex = gql`
  query ForexQuery($input: ForexTradingPairFilterInput, $aggregatesInput: ForexTradingPairAggregateFilterInput) {
    forexTradingPairs(input: $input) {
      id
      symbol
      currentRate
      aggregates(input: $aggregatesInput) {
        time
        close
      }
    }
  }
`;
