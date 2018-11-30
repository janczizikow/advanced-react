import formatMoney from "../lib/formatMoney";

describe("formatMoney", () => {
  it("formats fractional dollars correctly for 1 cent", () => {
    expect(formatMoney(1)).toEqual("$0.01");
  });

  it("formats fractional dollars correctly for 10 cents", () => {
    expect(formatMoney(10)).toEqual("$0.10");
  });

  it("formats whole amount correctly (ommits cents)", () => {
    expect(formatMoney(5000)).toEqual("$50");
  });

  it("formats whole amount correctly (adds commas)", () => {
    expect(formatMoney(50000000)).toEqual("$500,000");
  });

  it("formats whole and fractional dollars correctly", () => {
    expect(formatMoney(5050)).toEqual("$50.50");
  });
});
