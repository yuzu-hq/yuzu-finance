import { gql } from "@apollo/client";

export const WatchListQuery = gql`
  query AtAGlanceQuery(
    $sec: SecurityFilterInput
    $secAggregates: SecurityAggregateFilterInput
    $cry: CryptoTradingPairFilterInput
    $cryAggregates: CryptoTradingPairAggregateFilterInput
  ) {
    securities(input: $sec) {
      id
      symbol
      name
      lastTrade {
        price
      }
      aggregates(input: $secAggregates) {
        time
        close
      }
    }
    cryptoTradingPairs(input: $cry) {
      id
      symbol
      lastTrade {
        price
      }
      aggregates(input: $cryAggregates) {
        time
        close
      }
    }
  }
`;