export const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const fetchGraphData = (success, fail) => {
  success({"2021-01-01": 2, "2021-01-02": 3})
  // or fail("Data not available")
}
