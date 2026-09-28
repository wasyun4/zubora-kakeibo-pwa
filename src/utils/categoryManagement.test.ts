import { describe, expect, it } from "vitest";
import type { Category } from "../categories";
import {
  addCategory,
  isCategoryArray,
  renameCategory,
  toggleCategoryActive,
} from "./categoryManagement";

const categories: Category[] = [
  { id: "salary", type: "income", name: "給与", parentId: null, isActive: true },
  { id: "food", type: "expense", name: "食費", parentId: null, isActive: true },
  { id: "groceries", type: "expense", name: "食料品", parentId: "food", isActive: true },
];

describe("category management", () => {
  it("adds income and expense minor categories", () => {
    const withIncome = addCategory(
      categories,
      { type: "income", name: "配当", parentId: null },
      "dividend",
    );
    const result = addCategory(
      withIncome,
      { type: "expense", name: "おやつ", parentId: "food" },
      "snack",
    );

    expect(result.at(-2)?.name).toBe("配当");
    expect(result.at(-1)?.parentId).toBe("food");
  });

  it("renames a category without changing its id", () => {
    const result = renameCategory(categories, "groceries", "スーパー");
    expect(result.find((item) => item.id === "groceries")?.name).toBe("スーパー");
  });

  it("hides a category without deleting it", () => {
    const result = toggleCategoryActive(categories, "food");
    expect(result.find((item) => item.id === "food")?.isActive).toBe(false);
    expect(result).toHaveLength(categories.length);
  });

  it("rejects duplicate names in the same parent", () => {
    expect(() => addCategory(
      categories,
      { type: "expense", name: "食料品", parentId: "food" },
      "duplicate",
    )).toThrow("同名");
  });

  it("validates category data loaded from storage", () => {
    expect(isCategoryArray(categories)).toBe(true);
    expect(isCategoryArray([{ id: "broken" }])).toBe(false);
  });
});
