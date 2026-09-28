import { describe, expect, it } from "vitest";
import {
  getAccountingPeriod,
  getCurrentAccountingMonth,
} from "./accountingPeriod";

describe("家計簿の集計期間", () => {
  it("月初め日が1日なら暦どおりの1か月になる", () => {
    expect(getAccountingPeriod("2026-09", "1")).toEqual({
      start: "2026-09-01",
      end: "2026-09-30",
      label: "9/1〜9/30",
    });
  });

  it("月初め日が25日なら前月25日から当月24日になる", () => {
    expect(getAccountingPeriod("2026-10", "25")).toEqual({
      start: "2026-09-25",
      end: "2026-10-24",
      label: "9/25〜10/24",
    });
  });

  it("月初め日の前後で起動時の表示月が切り替わる", () => {
    expect(getCurrentAccountingMonth("25", new Date(2026, 8, 24))).toBe("2026-09");
    expect(getCurrentAccountingMonth("25", new Date(2026, 8, 25))).toBe("2026-10");
  });

  it("年をまたぐ期間でも翌年の表示月を選ぶ", () => {
    expect(getCurrentAccountingMonth("25", new Date(2026, 11, 25))).toBe("2027-01");
  });
});
