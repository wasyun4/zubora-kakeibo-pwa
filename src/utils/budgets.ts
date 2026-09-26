import type { CategoryBudget } from "../types";

export function calculateMonthlyBudget(
  budgets: CategoryBudget[], month: string, expenses: number, savings: number,
) {
  const selected = budgets.filter((budget) => budget.month === month);
  if (selected.length === 0) return { total: null, remaining: null };
  const total = selected.reduce((sum, budget) => sum + budget.amount, 0);
  return { total, remaining: total - expenses - savings };
}