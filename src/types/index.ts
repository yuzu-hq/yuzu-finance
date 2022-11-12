export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  Decimal: any;
};

/** The types of assets that a fund invests in or focuses on. */
export enum AssetFocus {
  Bond = 'BOND',
  Equity = 'EQUITY',
  MoneyMarket = 'MONEY_MARKET'
}

/** `BestBidOffer` represents the current best bid and ask for an asset. Sometimes known as the 'top of book.' */
export type BestBidOffer = {
  __typename?: 'BestBidOffer';
  /** `Quote` representing the best current ask */
  ask: Quote;
  /** `Quote` representing the best current bid */
  bid: Quote;
  /** Time of this quote */
  time: Scalars['DateTime'];
};

/** `Company` represents a public company or fund issuer. */
export type Company = {
  __typename?: 'Company';
  /** Central Index Key of the company used by the SEC */
  cik?: Maybe<Scalars['String']>;
  /** Employer Identification Number of the company */
  ein?: Maybe<Scalars['String']>;
  /** End of the fiscal calendar for this company */
  fiscalYearEnd?: Maybe<Scalars['Date']>;
  /** Unique ID of the security. Same as `cik` */
  id: Scalars['ID'];
  /** Name of the company */
  name: Scalars['String'];
  /** Securities issued by this company or fund issuer */
  securities: Array<Security>;
  /** Standard Industrial Code of the company. See: https://www.osha.gov/data/sic-manual for more detail */
  sicCode?: Maybe<Scalars['String']>;
};


/** `Company` represents a public company or fund issuer. */
export type CompanySecuritiesArgs = {
  input?: InputMaybe<CompanySecuritiesFilterInput>;
};

/** Input to `companies` used to filter the results. */
export type CompanyFilterInput = {
  /** Use to filter the results to specfic CIKs */
  ciks?: InputMaybe<Array<Scalars['String']>>;
  /** Use to limit the number of returned companies. Default 100, max 500 */
  limit?: InputMaybe<Scalars['Int']>;
  /** Use to page through the results. Default: 0 */
  offset?: InputMaybe<Scalars['Int']>;
};

/** Input to `Company.securities` to filter the results. */
export type CompanySecuritiesFilterInput = {
  /** Use this to return specific figis. E.g., [BBG000B9XRY4, BBG000BPH459] */
  figiComposites?: InputMaybe<Array<Scalars['String']>>;
  /** Use to limit the number of returned securities. Default: 100 */
  limit?: InputMaybe<Scalars['Int']>;
  /** Use to page through the results. Default: 0 */
  offset?: InputMaybe<Scalars['Int']>;
  /** Use this to return specific symbols. E.g., [AAPL, MSFT] */
  symbols?: InputMaybe<Array<Scalars['String']>>;
};

/** `CryptoAggregate` represents a set of trading metrics for a period of time. Also known as a 'candle,' or 'OHLCV.' */
export type CryptoAggregate = {
  __typename?: 'CryptoAggregate';
  /** The price at which the last trade in this period occurred */
  close: Scalars['Decimal'];
  /** The highest price traded during the period */
  high: Scalars['Decimal'];
  /** The lowest price traded during the period */
  low: Scalars['Decimal'];
  /** The price at which the first trade in this period occurred */
  open: Scalars['Decimal'];
  /** The amount of time represented by this aggregate */
  period: CryptoAggregatePeriod;
  /** The beginning of the period represented by this aggregate */
  time: Scalars['DateTime'];
  /** Volume is the quantity of the asset traded during this period */
  volume: Scalars['Decimal'];
};

/** The granularity of a crypto aggregate, or the amount of time over which the aggregate applies. */
export enum CryptoAggregatePeriod {
  Day = 'DAY',
  Hour = 'HOUR',
  Minute = 'MINUTE'
}

/** `CryptoAsset` can be a cryptocurrency like Bitcoin or Ether, a digital token like `AAVE`, or a stablecoin like `USDC`. */
export type CryptoAsset = {
  __typename?: 'CryptoAsset';
  /** ID is the unique identifier of this asset, same as `symbol` */
  id: Scalars['ID'];
  /** Name is the colloquial name for this asset (e.g. `Bitcoin`) */
  name: Scalars['String'];
  /** Symbol is the colloquial symbol for this asset (e.g. `BTC`). These are unique in our system */
  symbol: Scalars['String'];
};

/**
 * `CryptoTradingPair` represents a pair of assets that can be purchased or sold on an exchange (e.g. `BTC-USD`).
 *
 * The first half of the pair is called the 'base asset,' and is what is being bought or sold in a trade. The second half
 * is called the 'quote asset' and is the currency in which the base asset is denominated.
 *
 * For example: `BTC-USD` is, 'the price of Bitcoin denominated in US Dollars.'
 */
export type CryptoTradingPair = {
  __typename?: 'CryptoTradingPair';
  /** Historical aggregates for this pair. */
  aggregates: Array<CryptoAggregate>;
  /** The asset in the pair that is being bought or sold (e.g. `BTC` in `BTC-USD`) */
  baseAsset: CryptoAsset;
  /** The most recent best bid and offer for this pair */
  bbo?: Maybe<BestBidOffer>;
  /** The unique identifier for this pair (e.g. `BTC-USD`) */
  id: Scalars['ID'];
  /** The most recent trade that occured for this asset. Commonly used as the 'current price' */
  lastTrade?: Maybe<Trade>;
  /**
   * The denominating asset in this pair (e.g. `USD` in `BTC-USD`).
   *
   * Note that this can be either a fiat `Currency` (`BTC-USD`), or another `CryptoAsset` (`BTC-ETH`)
   */
  quoteAsset: CryptoTradingPairQuoteAsset;
  /** The colloquial symbol for this pair (e.g. `BTC-USD`) */
  symbol: Scalars['String'];
};


/**
 * `CryptoTradingPair` represents a pair of assets that can be purchased or sold on an exchange (e.g. `BTC-USD`).
 *
 * The first half of the pair is called the 'base asset,' and is what is being bought or sold in a trade. The second half
 * is called the 'quote asset' and is the currency in which the base asset is denominated.
 *
 * For example: `BTC-USD` is, 'the price of Bitcoin denominated in US Dollars.'
 */
export type CryptoTradingPairAggregatesArgs = {
  input?: InputMaybe<CryptoTradingPairAggregateFilterInput>;
};

/** Input to `CryptoTradingPair.aggregates` used to filter the results. */
export type CryptoTradingPairAggregateFilterInput = {
  /** Time after which aggregates are returned */
  after?: InputMaybe<Scalars['DateTime']>;
  /** Time before which aggregates are returned. Default: `now()` */
  before?: InputMaybe<Scalars['DateTime']>;
  /** Number of aggregates returned: Default: 100, max: 500 */
  limit?: InputMaybe<Scalars['Int']>;
  /** Period in which to request the aggregate. Default: `DAY` */
  period?: InputMaybe<CryptoAggregatePeriod>;
};

/**
 * Used to search for specific crypto trading pairs, or groups of trading pairs.
 * If no individual filters are provided, all pairs will be returned, ordered by symbol.
 */
export type CryptoTradingPairFilterInput = {
  /** Use to limit the number of symbols in the response: Default: 100, max: 500 */
  limit?: InputMaybe<Scalars['Int']>;
  /** Use to page through results: Default: 0 */
  offset?: InputMaybe<Scalars['Int']>;
  /** Use to search for a crypto trading pair with a symbol or name matching the given input */
  search?: InputMaybe<Scalars['String']>;
  /** Provide symbols to get specific trading symbols, e.g. 'BTC-USD' */
  symbols?: InputMaybe<Array<Scalars['String']>>;
};

/** Represents either a fiat `Currency` or a `CryptoAsset`. */
export type CryptoTradingPairQuoteAsset = CryptoAsset | Currency;

/** `Currency` represents fiat currencies (e.g. `USD`, `GBP`, `JPY`) */
export type Currency = {
  __typename?: 'Currency';
  /** Country code of the originating country (e.g. `US`) */
  countryCode: Scalars['String'];
  /** Number of decimal places used to denominate this currency (e.g. `2`) */
  decimalPlaces: Scalars['Int'];
  /** 🐣 Returns the corresponding flag emoji for the associated country (e.g. 🇺🇦 🇺🇸) */
  flagEmoji: Scalars['String'];
  /** ID of the currency (same as symbol e.g. `USD`) */
  id: Scalars['ID'];
  /** Name of the currency (e.g. `US Dollar`) */
  name: Scalars['String'];
  /** 3 character ISO 4217 currency code (e.g. `USD`) */
  symbol: Scalars['String'];
  /** Symbol representing one unit of the currency (e.g. $ for USD) */
  unitSymbol?: Maybe<Scalars['String']>;
};

/** `ForexAggregate` represents a set of trading metrics for a period of time. Also known as a 'candle,' or 'OHLCV.' */
export type ForexAggregate = {
  __typename?: 'ForexAggregate';
  /** The price at which the last trade in this period occurred */
  close: Scalars['Decimal'];
  /** The highest price traded during the period. */
  high: Scalars['Decimal'];
  /** The lowest price traded during the period. */
  low: Scalars['Decimal'];
  /** The price at which the first trade in this period occurred */
  open: Scalars['Decimal'];
  /** The beginning of the period represented by this aggregate */
  time: Scalars['DateTime'];
};

/**
 * `ForexTradingPair` represents a pair of currencies that can be exchanged for one another (e.g. `GBP-USD`).
 *
 * The first half of the pair is called the 'base currency,' and is what is being bought or sold in a trade. The second half
 * is called the 'quote currency' and is the currency in which the base asset is denominated.
 *
 * For example: `GBP-USD` is, 'the exchange rate for Pound Sterling in US Dollars'
 */
export type ForexTradingPair = {
  __typename?: 'ForexTradingPair';
  /** Historical price metrics for this pair */
  aggregates: Array<ForexAggregate>;
  /** The currency in the pair that is being bought or sold (e.g. `GBP` in `GBP-USD`) */
  baseCurrency: Currency;
  /**
   * The current conversion rate from the base to the quote
   *
   * E.g. a `currentRate` of 1.5 for GBP-USD means that 1 GBP is worth 1.50 USD at the current market rate
   */
  currentRate: Scalars['Decimal'];
  /** The unique identifier of this pair (e.g. 'GBP-USD') */
  id: Scalars['ID'];
  /** The denominating asset in this pair (e.g. `USD` in `GBP-USD`) */
  quoteCurrency: Currency;
  /** The colloquial symbol of this pair (e.g. 'GBP-USD') */
  symbol: Scalars['String'];
};


/**
 * `ForexTradingPair` represents a pair of currencies that can be exchanged for one another (e.g. `GBP-USD`).
 *
 * The first half of the pair is called the 'base currency,' and is what is being bought or sold in a trade. The second half
 * is called the 'quote currency' and is the currency in which the base asset is denominated.
 *
 * For example: `GBP-USD` is, 'the exchange rate for Pound Sterling in US Dollars'
 */
export type ForexTradingPairAggregatesArgs = {
  input?: InputMaybe<ForexTradingPairAggregateFilterInput>;
};

/** Input to `ForexTradingPair.aggregates` used to filter the results. */
export type ForexTradingPairAggregateFilterInput = {
  /** Time after which aggregates are returned */
  after?: InputMaybe<Scalars['DateTime']>;
  /** Time before which aggregates are returned. Default: `now()` */
  before?: InputMaybe<Scalars['DateTime']>;
  /** Number of aggregates returned: Default: 100, max: 500 */
  limit?: InputMaybe<Scalars['Int']>;
};

/** Used to request info on forex trading pairs (e.g. `EUR-USD`) */
export type ForexTradingPairFilterInput = {
  /** Use to limit the number of returned objects. Default: 100, max: 500 */
  limit?: InputMaybe<Scalars['Int']>;
  /** Used to page through results. Default: 0 */
  offset?: InputMaybe<Scalars['Int']>;
  /** Use to request specific trading symbols [EUR-USD, GBP-USD] */
  symbols?: InputMaybe<Array<Scalars['String']>>;
};

/** `FundDetail` contains characteristics of an ETF or Mutual Fund. */
export type FundDetail = {
  __typename?: 'FundDetail';
  /** The asset type that this fund focuses on, or null if it has no particular focus */
  assetFocus?: Maybe<AssetFocus>;
  /** The SEC Class ID for this fund */
  classId?: Maybe<Scalars['String']>;
  /** The date that the `netExpenseRatio` and `grossExpenseRatio` fields were last updated or collected */
  expenseRatioAsOfDate?: Maybe<Scalars['Date']>;
  /** The fund's gross expense ratio as of the date in `expenseRatioAsOfDate` */
  grossExpenseRatio?: Maybe<Scalars['Decimal']>;
  /** The date that the fund was launched */
  inceptionDate?: Maybe<Scalars['Date']>;
  /** True if the fund pursues ESG goals */
  isEsg: Scalars['Boolean'];
  /** The fund's management style (active or passive) */
  managementStyle: ManagementStyle;
  /** The net asset value per share of the fund as of the date in `navAsOfDate` */
  nav?: Maybe<Scalars['Decimal']>;
  /** The date that the `nav` field was last updated or collected */
  navAsOfDate?: Maybe<Scalars['Date']>;
  /** The total net value of the fund's assets as of the date in `netAssetsAsOfDate` */
  netAssets?: Maybe<Scalars['Decimal']>;
  /** The date that the `netAssets` field was last updated or collected */
  netAssetsAsOfDate?: Maybe<Scalars['Date']>;
  /** The fund's net expense ratio as of the date in `expenseRatioAsOfDate` */
  netExpenseRatio?: Maybe<Scalars['Decimal']>;
  /** The sector that this fund focuses on, or null if it has no particular focus */
  sectorFocus?: Maybe<Sector>;
  /** The SEC Series ID for this fund's family */
  seriesId?: Maybe<Scalars['String']>;
  /** The status describing whether a fund is accepting new investment */
  status: FundStatus;
  /** The target year of the fund, or null if it is not a lifecycle fund */
  targetDate?: Maybe<Scalars['Date']>;
};

/** A status describing if a fund is still accepting new investment. */
export enum FundStatus {
  Closed = 'CLOSED',
  ClosedToNewInvestors = 'CLOSED_TO_NEW_INVESTORS',
  Open = 'OPEN'
}

/** Provides detail about the market holiday. */
export enum HolidayStatus {
  /** Market is fully closed */
  Closed = 'CLOSED',
  /** Market is closing early */
  EarlyClose = 'EARLY_CLOSE'
}

/** Whether a fund's managers actively or passively manage the fund. */
export enum ManagementStyle {
  Active = 'ACTIVE',
  Passive = 'PASSIVE'
}

/** Input to `usMarketHolidays` used to filter the results. */
export type MarketHolidayFilterInput = {
  /** Time before which market holidays are returned */
  after?: InputMaybe<Scalars['Date']>;
  /** Time before which market holidays are returned. Default: `now()` */
  before?: InputMaybe<Scalars['Date']>;
  /** Used to limit the number of returned objects. Default: 100, max: 500 */
  limit?: InputMaybe<Scalars['Int']>;
  /** Used to filter holidays by a particular status */
  status?: InputMaybe<HolidayStatus>;
};

/** Input to `marketNews` used to filter the results. */
export type MarketNewsFilterInput = {
  /** Time after which news articles are returned */
  after?: InputMaybe<Scalars['DateTime']>;
  /** Time before which news articles are returned. Default: `now()` */
  before?: InputMaybe<Scalars['DateTime']>;
  /** Used to limit the number of returned articles. Default: 10, max: 500 */
  limit?: InputMaybe<Scalars['Int']>;
  /** A list of symbols used to filter the results */
  symbols?: InputMaybe<Array<Scalars['String']>>;
  /** A list of tags used to filter the results */
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** `NewsArticle` represents an article published about one or more securities or general market topics. */
export type NewsArticle = {
  __typename?: 'NewsArticle';
  /** An image from the article, if available */
  imageUrl?: Maybe<Scalars['String']>;
  /** A preview of the article's body content, as an HTML fragment */
  previewHtml: Scalars['String'];
  /** A preview of the article's body content, as plain text */
  previewText: Scalars['String'];
  /** The organization that published the article */
  publisher: Scalars['String'];
  /** A list of securities discussed in the article */
  subjects: Array<Security>;
  /** A list of tags describing the topic or content of the article */
  tags: Array<Scalars['String']>;
  /** The time the article was published */
  time: Scalars['DateTime'];
  /** The title of the article */
  title: Scalars['String'];
  /** The URL for the full article content */
  url: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /**
   * Fetch a list of companies. Returns a list of companies matching the filter input,
   * or all companies alphabetically if no input provided.
   */
  companies: Array<Company>;
  /** Fetch a list of crypto trading pairs. */
  cryptoTradingPairs: Array<CryptoTradingPair>;
  /** Fetch a list of forex trading pairs. */
  forexTradingPairs: Array<ForexTradingPair>;
  /**
   * Fetch recent market news article. Returns 10 most recent news articles by default.
   *
   * News is sourced from Benzinga, PRNewswire, Global Newswire, Business Wire, PR.com, and Dalton Brewster.
   */
  marketNews: Array<NewsArticle>;
  /** Fetch a list of securities. */
  securities: Array<Security>;
  /**
   * Fetch recently delisted securities
   * @deprecated PREVIEW
   */
  securityDelistings: Array<SecurityDelisting>;
  /**
   * Fetch recently listed securities
   * @deprecated PREVIEW
   */
  securityListings: Array<SecurityListing>;
  /** Fetch a list of past and upcoming security splits */
  securitySplits: Array<SecuritySplit>;
  /**
   * Fetch a list of security identifier changes
   * @deprecated PREVIEW
   */
  securitySymbolChanges: Array<Maybe<SecuritySymbolChange>>;
  /** Fetch info about market holidays in the U.S. */
  usMarketHolidays: Array<UsMarketHoliday>;
  /** Fetch info about market hours in the U.S. E.g. whether the market is currently open, and information about the next open and previous close. */
  usMarketHours: UsMarketHours;
  /**
   * `valueAssets` can be used to value a basket of assets backwards in time.
   *
   * For instance: if you hold 3 shares of AAPL and 2 Bitcoin and you want to know what
   * the value of this basket was over the last week, use this field.
   * @deprecated PREVIEW
   */
  valueAssets?: Maybe<ValueAssetsPayload>;
};


export type QueryCompaniesArgs = {
  input?: InputMaybe<CompanyFilterInput>;
};


export type QueryCryptoTradingPairsArgs = {
  input?: InputMaybe<CryptoTradingPairFilterInput>;
};


export type QueryForexTradingPairsArgs = {
  input?: InputMaybe<ForexTradingPairFilterInput>;
};


export type QueryMarketNewsArgs = {
  input?: InputMaybe<MarketNewsFilterInput>;
};


export type QuerySecuritiesArgs = {
  input?: InputMaybe<SecurityFilterInput>;
};


export type QuerySecurityDelistingsArgs = {
  input?: InputMaybe<SecurityDelistingFilterInput>;
};


export type QuerySecurityListingsArgs = {
  input?: InputMaybe<SecurityListingFilterInput>;
};


export type QuerySecuritySplitsArgs = {
  input?: InputMaybe<SecuritySplitFilterInput>;
};


export type QuerySecuritySymbolChangesArgs = {
  input?: InputMaybe<SecuritySymbolChangeFilterInput>;
};


export type QueryUsMarketHolidaysArgs = {
  input?: InputMaybe<MarketHolidayFilterInput>;
};


export type QueryValueAssetsArgs = {
  input: ValueAssetsInput;
};

/**
 * `Quote` represents an open offer to buy or sell an asset. Another way to think of a Quote is as a single limit order,
 * or a collection of limit orders grouped by the price at which they are offered.
 */
export type Quote = {
  __typename?: 'Quote';
  /** The price at which this offer is made */
  price: Scalars['Decimal'];
  /** The amount being offered */
  quantity: Scalars['Decimal'];
};

/** The industry sector of a security or fund. */
export enum Sector {
  Communications = 'COMMUNICATIONS',
  ConsumerDiscretionary = 'CONSUMER_DISCRETIONARY',
  ConsumerStaples = 'CONSUMER_STAPLES',
  Energy = 'ENERGY',
  Financial = 'FINANCIAL',
  Health = 'HEALTH',
  Industrials = 'INDUSTRIALS',
  Materials = 'MATERIALS',
  RealEstate = 'REAL_ESTATE',
  Technology = 'TECHNOLOGY',
  Utilities = 'UTILITIES'
}

/** `Security` represents a stock, ETF, or mutual fund. */
export type Security = {
  __typename?: 'Security';
  /** Historical price metrics for this security */
  aggregates: Array<SecurityAggregate>;
  /** The current best bid and offer for this security */
  bbo?: Maybe<BestBidOffer>;
  /** The exchange on which this security is primarily traded (e.g. `XNAS`) */
  exchange?: Maybe<Scalars['String']>;
  /** The composite FIGI of this security. FIGI stands for 'Financial Instrument Global Identifier.' */
  figiComposite: Scalars['String'];
  /** If this security is a fund (like an ETF or Mutual Fund), this field contains fund characteristics */
  fundDetail?: Maybe<FundDetail>;
  /**
   * The unique identifier of this security. Same as `figiComposite`.
   * Because symbols may not be unique, or are subject to change, use this id as a key in your own system
   */
  id: Scalars['ID'];
  /** The issuer of this security. Generally a company for common stock, and a fund or fund network for ETFs and Mutual Funds */
  issuer?: Maybe<Company>;
  /** The last trade for this security */
  lastTrade?: Maybe<Trade>;
  /** The name of the security (e.g. `AAPL Inc` or `Berkshire Hathaway Inc. - Class B`) */
  name: Scalars['String'];
  /** A list of news articles that are about or reference this security */
  newsArticles: Array<NewsArticle>;
  /** The type of the security (e.g. `COMMON_STOCK` or `ETF`) */
  securityType: SecurityType;
  /**
   * **PREVIEW:**
   * Returns a simple sparkline given a period (the duration between points), and a time period (start/end times)
   * @deprecated PREVIEW
   */
  sparkline?: Maybe<SparklinePayload>;
  /** A list of historical and forward-looking splits for this security */
  splits: Array<SecuritySplit>;
  /** The colloquial symbol of the security (e.g. `AAPL`) */
  symbol: Scalars['String'];
};


/** `Security` represents a stock, ETF, or mutual fund. */
export type SecurityAggregatesArgs = {
  input?: InputMaybe<SecurityAggregateFilterInput>;
};


/** `Security` represents a stock, ETF, or mutual fund. */
export type SecurityNewsArticlesArgs = {
  input?: InputMaybe<SecurityNewsArticlesFilterInput>;
};


/** `Security` represents a stock, ETF, or mutual fund. */
export type SecuritySparklineArgs = {
  input?: InputMaybe<SecuritySparklineInput>;
};

/**
 * `SecurityAggregate` represents a set of trading metrics for a period of time. Also known as a 'candle,' or 'OHLCV.'
 *
 * **NOTE:**
 * Mutual funds will always return daily prices, even if `MINUTE` or `HOUR` is specified in `SecurityAggregateFilterInput`. This is because,
 * unlike other securities, mutual funds do not trade on-exchange. Instead, their prices are published once at the close of markets
 * by the fund issuer.
 */
export type SecurityAggregate = {
  __typename?: 'SecurityAggregate';
  /** The price at which the last trade in this period occurred */
  close: Scalars['Decimal'];
  /** The highest price traded during the period */
  high: Scalars['Decimal'];
  /** The lowest price traded during the period */
  low: Scalars['Decimal'];
  /** The price at which the first trade in this period occurred */
  open: Scalars['Decimal'];
  /** The amount of time represented by this aggregate */
  period: SecurityAggregatePeriod;
  /** The beginning of the period represented by this aggregate */
  time: Scalars['DateTime'];
  /** The number of shares traded during the period */
  volume: Scalars['Decimal'];
};

/** Input to `Security.aggregates` used to filter the results. */
export type SecurityAggregateFilterInput = {
  /** Time after which aggregates are returned */
  after?: InputMaybe<Scalars['DateTime']>;
  /** Time before which aggregates are returned. Default: `now()` */
  before?: InputMaybe<Scalars['DateTime']>;
  /** Number of aggregates returned: Default: 100, max: 500 */
  limit?: InputMaybe<Scalars['Int']>;
  /** Period in which to request the aggregate. Default: `DAY` */
  period?: InputMaybe<SecurityAggregatePeriod>;
};

/** The granularity of a security aggregate, or the amount of time over which the aggregate applies. */
export enum SecurityAggregatePeriod {
  Day = 'DAY',
  Hour = 'HOUR',
  Minute = 'MINUTE'
}

export type SecurityDelisting = {
  __typename?: 'SecurityDelisting';
  /** The date of the delisting */
  date: Scalars['Date'];
  /** The `Security` to which this pertains */
  security: Security;
};

/** Input to `securityDelistings` used to filter the results. */
export type SecurityDelistingFilterInput = {
  after?: InputMaybe<Scalars['Date']>;
  before?: InputMaybe<Scalars['Date']>;
  figiComposites?: InputMaybe<Array<Scalars['String']>>;
  limit?: InputMaybe<Scalars['Int']>;
  symbols?: InputMaybe<Array<Scalars['String']>>;
};

/**
 * Input to `securities` used to filter the results. The parameters can be used to limit the number of results returned by the API.
 * If no filters are provided, the API will return up to `limit` securities ordered by symbol.
 *
 * There are multiple ways to get results. You may pass specific symbols or figiComposites to look up specific securities,
 * or you can pass `search` to fuzzy-search for securities based on the name or symbol. If both are passed, the API will
 * prefer specific lookup operations over fuzzy searches.
 */
export type SecurityFilterInput = {
  /** Use this to return specific figis. E.g., [BBG000B9XRY4, BBG000BPH459] */
  figiComposites?: InputMaybe<Array<Scalars['String']>>;
  /** Use to limit the number of returned securities. Default: 100, max: 500 */
  limit?: InputMaybe<Scalars['Int']>;
  /** Use to page through the results. Default: 0 */
  offset?: InputMaybe<Scalars['Int']>;
  /** Use to search for a security with a symbol or name matching the given input */
  search?: InputMaybe<Scalars['String']>;
  /** Use this to return specific symbols. E.g., [AAPL, MSFT] */
  symbols?: InputMaybe<Array<Scalars['String']>>;
};

export type SecurityListing = {
  __typename?: 'SecurityListing';
  /** The date of the delisting */
  date: Scalars['Date'];
  /** The primary listing venue of the new security */
  exchangeCode: Scalars['String'];
  /** The name of the new security */
  name: Scalars['String'];
  /** The new symbol of the security */
  symbol: Scalars['String'];
};

/** Input to `securityListings` used to filter the results. */
export type SecurityListingFilterInput = {
  after?: InputMaybe<Scalars['Date']>;
  before?: InputMaybe<Scalars['Date']>;
  limit?: InputMaybe<Scalars['Int']>;
  symbols?: InputMaybe<Array<Scalars['String']>>;
};

/** Input to `NewsArticles` used to filter the results. */
export type SecurityNewsArticlesFilterInput = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type SecuritySparklineInput = {
  /** The end of the sparkline period. Default = now */
  end?: InputMaybe<Scalars['DateTime']>;
  /** The period between points in the sparkline */
  period?: SecurityAggregatePeriod;
  /** The start of the sparkline period */
  start: Scalars['DateTime'];
};

/** `SecuritySplit` represents a split event. */
export type SecuritySplit = {
  __typename?: 'SecuritySplit';
  /** The date that the split took place or will took place */
  date: Scalars['Date'];
  /** The number of resulting shares after the split */
  newShares: Scalars['Int'];
  /** The number of shares that existed before the split event */
  oldShares: Scalars['Int'];
  /** The ratio of old shares to new shares */
  ratio: Scalars['Decimal'];
  /** The security to which the split pertains */
  security: Security;
};

/** Input to `securitySplits` used to filter the results. */
export type SecuritySplitFilterInput = {
  /** Specify after to return splits on or after this date */
  after?: InputMaybe<Scalars['Date']>;
  /** Specify before to return splits on or before this date */
  before?: InputMaybe<Scalars['Date']>;
  /** FigiComposites to returns splits for */
  figiComposites?: InputMaybe<Array<Scalars['String']>>;
  /** Specify limit to limit the number of results. Default: 100, max: 500 */
  limit?: InputMaybe<Scalars['Int']>;
  /** Symbols to returns splits for */
  symbols?: InputMaybe<Array<Scalars['String']>>;
};

export type SecuritySymbolChange = {
  __typename?: 'SecuritySymbolChange';
  /** The date of the change */
  date: Scalars['Date'];
  /** The new symbol, after `date` */
  newSymbol: Scalars['String'];
  /** The old symbol, previous to `date` */
  oldSymbol: Scalars['String'];
  /** The `Security` to which this pertains */
  security: Security;
};

/** Input to `securityIdentifierChanges` used to filter the results. */
export type SecuritySymbolChangeFilterInput = {
  after?: InputMaybe<Scalars['Date']>;
  before?: InputMaybe<Scalars['Date']>;
  figiComposites?: InputMaybe<Array<Scalars['String']>>;
  limit?: InputMaybe<Scalars['Int']>;
  symbols?: InputMaybe<Array<Scalars['String']>>;
};

/** The type of a security */
export enum SecurityType {
  /** U.S. bank-issued certificate representing shares in a foreign company for trade on American stock exchanges. */
  Adr = 'ADR',
  /** A type of mutual fund that issues a fixed number of shares through a single initial public offering. */
  ClosedEndFund = 'CLOSED_END_FUND',
  /** Common stock is a security that represents ownership in a corporation. */
  CommonStock = 'COMMON_STOCK',
  /** An exchange-traded fund is a type of pooled investment security that operates much like a mutual fund. Unlike mutual funds, ETFs are traded on exchanges. */
  Etf = 'ETF',
  /** A mutual fund is a financial vehicle that pools assets from shareholders to invest in securities like stocks, bonds, money market instruments, and other assets. */
  MutualFund = 'MUTUAL_FUND',
  /**
   * An open-end fund is a diversified portfolio of pooled investor money that can issue an unlimited number of shares.
   * @deprecated OPEN_END_FUND is being deprecated, see MUTUAL_FUND
   */
  OpenEndFund = 'OPEN_END_FUND',
  PartnershipShares = 'PARTNERSHIP_SHARES',
  /** Preferred stock, like common stock, represents ownership in a company. However, preferred stockholders have a higher claim to dividends or asset distribution than common stockholders. */
  PreferredStock = 'PREFERRED_STOCK',
  /** A real estate investment trust (REIT) is a company that owns, operates, or finances income-generating real estate. */
  Reit = 'REIT',
  Right = 'RIGHT',
  /** Commonly, a security made up of one common share and a fraction of a warrant (usually 1/2 or 1/3). It can also represent ownership in other types of business entities (e.g. LPs or trusts). */
  Unit = 'UNIT',
  /** A derivative that gives the right to purchase a security at a fixed price before expiration, similar to an option, but issued by the company itself. */
  Warrant = 'WARRANT'
}

export type SparklinePayload = {
  __typename?: 'SparklinePayload';
  /** The set of normalized points included in the sparkline */
  points: Array<Scalars['Decimal']>;
};

/** `Trade` is an exchange between a buyer and seller, at a fixed price, for a fixed quantity of an asset. */
export type Trade = {
  __typename?: 'Trade';
  /** The price of the trade */
  price: Scalars['Decimal'];
  /** The amount of the asset that changed hands */
  quantity: Scalars['Decimal'];
  /** The time at which the trade occurred */
  time: Scalars['DateTime'];
};

/** `TradingDay` represents the open and close of a market day in the United States. */
export type TradingDay = {
  __typename?: 'TradingDay';
  closeTime: Scalars['DateTime'];
  openTime: Scalars['DateTime'];
};

/**
 * `USMarketHoliday` is a day on which the market is either closed or has adjusted hours.
 *
 * Normal market hours are from 9:30AM - 4:00PM Eastern.
 */
export type UsMarketHoliday = {
  __typename?: 'UsMarketHoliday';
  /** If the market is not fully closed, the time that the market closes on this day */
  closeTime?: Maybe<Scalars['DateTime']>;
  /** The date of the market day adjustment */
  date: Scalars['Date'];
  /** The name of the holiday (e.g. `Juneteenth`) */
  name: Scalars['String'];
  /** If the market is not fully closed, the time that the market opens on this day */
  openTime?: Maybe<Scalars['DateTime']>;
  /** Whether the market is fully closed or closes early on this day */
  status: HolidayStatus;
};

/** `UsMarketHours` contains a few fields about the current market status and adjacent trading days. */
export type UsMarketHours = {
  __typename?: 'UsMarketHours';
  /** If markets are currently open, the current trading day. If the markets are closed, the next trading day */
  nextTradingDay: TradingDay;
  /** True if the market is currently open during regular hours */
  openNow: Scalars['Boolean'];
  /** The most recently completed trading day */
  previousTradingDay: TradingDay;
};

/** `ValueAssetsCryptoInput` represents one crypto asset in the basket */
export type ValueAssetsCryptoInput = {
  /** Quantity of the asset */
  quantity: Scalars['Decimal'];
  /** Symbol of the crypto asset (e.g. `BTC`) */
  symbol: Scalars['String'];
};

/** `ValueAssetsInput` is the input to `valueAssets`, and specifies which asset basket and time period you'd like to get valuation info for. */
export type ValueAssetsInput = {
  /** The basket of crypto assets to include */
  cryptoAssets?: InputMaybe<Array<ValueAssetsCryptoInput>>;
  /** The end of the asset valuation period. Default is today */
  end?: InputMaybe<Scalars['DateTime']>;
  /**
   * The period at which to return asset values.
   *
   * E.g. `DAY` will return the asset values as of the end of every day
   */
  period?: SecurityAggregatePeriod;
  /** The basket of securities to include */
  securities?: InputMaybe<Array<ValueAssetsSecurityInput>>;
  /** The start of the asset valuation period */
  start: Scalars['DateTime'];
};

/**
 * `ValueAssetsPayload` is the output of `valueAssets` and contains info
 * about the value of the asset basket backward in time
 */
export type ValueAssetsPayload = {
  __typename?: 'ValueAssetsPayload';
  /** The absolute change in value of this portfolio in the time period requested */
  absoluteChange: Scalars['Decimal'];
  /** The current value of this basket */
  currentValue: Scalars['Decimal'];
  /** The percent change in value of this portfolio in the time period requested, as a decimal float (e.g. 0.4 = 40%) */
  percentChange: Scalars['Decimal'];
  /** The value of these assets at the intervals requested */
  periods: Array<ValueAssetsPeriod>;
};

/**
 * `ValueAssetsPeriod` represents one period (e.g. one day or one hour)
 * where the value of an asset basket changed.
 */
export type ValueAssetsPeriod = {
  __typename?: 'ValueAssetsPeriod';
  /** The start time of the period */
  time: Scalars['DateTime'];
  /** The value of the asset basket at this time */
  value: Scalars['Decimal'];
};

/** `ValueAssetsSecurityInput` represents one security asset in the basket */
export type ValueAssetsSecurityInput = {
  /** FIGI Composite of the security. Must provide either this field or `symbol` */
  figiComposite?: InputMaybe<Scalars['String']>;
  /** Quantity of the asset */
  quantity: Scalars['Decimal'];
  /** Ticker symbol of the security. Must provide either this field or `figiComposite` */
  symbol?: InputMaybe<Scalars['String']>;
};

export type SearchQueryQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
}>;


export type SearchQueryQuery = { __typename?: 'Query', cryptoTradingPairs: Array<{ __typename?: 'CryptoTradingPair', id: string, symbol: string, aggregates: Array<{ __typename?: 'CryptoAggregate', time: any, close: any }>, baseAsset: { __typename?: 'CryptoAsset', name: string, symbol: string } }>, securities: Array<{ __typename?: 'Security', symbol: string, name: string, aggregates: Array<{ __typename?: 'SecurityAggregate', close: any }> }> };

export type SecuritiesQueryQueryVariables = Exact<{
  input?: InputMaybe<SecurityFilterInput>;
  aggregatesInput?: InputMaybe<SecurityAggregateFilterInput>;
}>;


export type SecuritiesQueryQuery = { __typename?: 'Query', securities: Array<{ __typename?: 'Security', id: string, symbol: string, name: string, issuer?: { __typename?: 'Company', name: string } | null, lastTrade?: { __typename?: 'Trade', price: any, time: any } | null, aggregates: Array<{ __typename?: 'SecurityAggregate', time: any, close: any }> }> };

export type CryptoQueryQueryVariables = Exact<{
  input?: InputMaybe<CryptoTradingPairFilterInput>;
  aggregatesInput?: InputMaybe<CryptoTradingPairAggregateFilterInput>;
}>;


export type CryptoQueryQuery = { __typename?: 'Query', cryptoTradingPairs: Array<{ __typename?: 'CryptoTradingPair', id: string, symbol: string, lastTrade?: { __typename?: 'Trade', price: any, time: any } | null, aggregates: Array<{ __typename?: 'CryptoAggregate', time: any, close: any }> }> };

export type ForexQueryQueryVariables = Exact<{
  input?: InputMaybe<ForexTradingPairFilterInput>;
  aggregatesInput?: InputMaybe<ForexTradingPairAggregateFilterInput>;
}>;


export type ForexQueryQuery = { __typename?: 'Query', forexTradingPairs: Array<{ __typename?: 'ForexTradingPair', id: string, symbol: string, currentRate: any, aggregates: Array<{ __typename?: 'ForexAggregate', time: any, close: any }> }> };

export type AtAGlanceQueryQueryVariables = Exact<{
  sec?: InputMaybe<SecurityFilterInput>;
  secAggregates?: InputMaybe<SecurityAggregateFilterInput>;
  cry?: InputMaybe<CryptoTradingPairFilterInput>;
  cryAggregates?: InputMaybe<CryptoTradingPairAggregateFilterInput>;
}>;


export type AtAGlanceQueryQuery = { __typename?: 'Query', securities: Array<{ __typename?: 'Security', id: string, symbol: string, name: string, lastTrade?: { __typename?: 'Trade', price: any } | null, aggregates: Array<{ __typename?: 'SecurityAggregate', time: any, close: any }> }>, cryptoTradingPairs: Array<{ __typename?: 'CryptoTradingPair', id: string, symbol: string, lastTrade?: { __typename?: 'Trade', price: any } | null, aggregates: Array<{ __typename?: 'CryptoAggregate', time: any, close: any }> }> };
