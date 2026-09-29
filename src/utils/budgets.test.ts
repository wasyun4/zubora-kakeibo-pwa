import { describe, expect, it } from "vitest";
import type { CategoryBudget } from "../types";
import { calculateMonthlyBudget } from "./budgets";

const budgets: CategoryBudget[] = [
  { month: "2026-09", majorCategoryId: "food", amount: 30_000 },
  { month: "2026-09", majorCategoryId: "fixedCost", amount: 80_000 },
  { month: "2026-10", majorCategoryId: "food", amount: 35_000 },
];

describe("月予算", () => {
  it("選択月に予算がなければ未設定を返す", () => {
    expect(calculateMonthlyBudget(budgets, "2026-11", 0, 0)).toEqual({
      total: null,
      remaining: null,
    });
  });

  it("カテゴリ予算の合計から支出と貯金を差し引く", () => {
    expect(calculateMonthlyBudget(budgets, "2026-09", 45_000, 10_000)).toEqual({
      total: 110_000,
      remaining: 55_000,
    });
  });

});
