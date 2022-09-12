import { gql } from "@apollo/client";
import djs from "dayjs";

const today = djs().format("YYYY-MM-DD");

export const WatchListQuery = gql`
  query AtAGlanceQuery(
    $sec: SecurityFilterInput
    $cry: CryptoTradingPairFilterInput
  ) {
    securities(input: $sec) {
      id
      symbol
      name
      lastTrade {
        price
      }
      aggregates(input: { limit: 2, before: "${today}" }) {
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
      aggregates(input: { limit: 1, before: "${today}" }) {
        time
        close
      }
    }
  }
`;