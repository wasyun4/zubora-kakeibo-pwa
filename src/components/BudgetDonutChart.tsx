// 【予算の二重円グラフ】
// 外側にカテゴリ別予算、内側に月予算の使用済み・残りを表示します。

import { formatCurrency } from "../utils/formatCurrency";

type BudgetStatus = {
  id: string;
  name: string;
  budget: number;
  spent: number;
  remaining: number;
};

type BudgetDonutChartProps = {
  totalBudget: number | null;
  remainingBudget: number | null;
  statuses: BudgetStatus[];
};

const categoryColors = [
  "#2e7d32",
  "#43a047",
  "#66bb6a",
  "#00897b",
  "#26a69a",
  "#7cb342",
  "#9e9d24",
  "#f9a825",
  "#ef6c00",
  "#8e24aa",
];

function BudgetDonutChart({
  totalBudget,
  remainingBudget,
  statuses,
}: BudgetDonutChartProps) {
  if (totalBudget === null || totalBudget <= 0) {
    return (
      <section className="budget-donut-card">
        <h2>予算の内訳</h2>
        <p className="budget-donut-empty">
          予算画面でカテゴリ別予算を登録すると、ここに円グラフが表示されます。
        </p>
      </section>
    );
  }

  const safeRemaining = remainingBudget ?? totalBudget;
  const usedAmount = Math.max(0, totalBudget - safeRemaining);
  const usedPercent = Math.min(100, (usedAmount / totalBudget) * 100);
  const remainingPercent = Math.max(0, 100 - usedPercent);
  const isOverBudget = safeRemaining < 0;

  let categoryOffset = 0;

  return (
    <section className="budget-donut-card">
      <h2>予算の内訳</h2>

      <div className="budget-donut-layout">
        <div className="budget-donut-figure">
          <svg
            className="budget-donut-svg"
            viewBox="0 0 200 200"
            role="img"
            aria-label={`月予算の残り${Math.round(remainingPercent)}パーセント`}
          >
            <circle className="budget-donut-track" cx="100" cy="100" r="70" pathLength="100" />

            {statuses.map((status, index) => {
              const percent = (status.budget / totalBudget) * 100;
              const offset = categoryOffset;
              categoryOffset += percent;

              return (
                <circle
                  key={status.id}
                  className="budget-donut-category-segment"
                  cx="100"
                  cy="100"
                  r="70"
                  pathLength="100"
                  stroke={categoryColors[index % categoryColors.length]}
                  strokeDasharray={`${percent} ${100 - percent}`}
                  strokeDashoffset={-offset}
                />
              );
            })}

          </svg>

          <div className={`budget-donut-center ${isOverBudget ? "over-budget" : ""}`}>
            <strong>{isOverBudget ? "超過" : `${Math.round(remainingPercent)}%`}</strong>
            <span>{isOverBudget ? formatCurrency(Math.abs(safeRemaining)) : "残り"}</span>
          </div>
        </div>

        <div className="budget-donut-summary">
          <div>
            <span className="budget-donut-summary-dot used" />
            使用済み
            <strong>{formatCurrency(usedAmount)}</strong>
          </div>
          <div>
            <span className="budget-donut-summary-dot remaining" />
            残り
            <strong className={isOverBudget ? "over-budget" : ""}>
              {formatCurrency(safeRemaining)}
            </strong>
          </div>
        </div>
      </div>

      <ul className="budget-donut-legend">
        {statuses.map((status, index) => (
          <li key={status.id}>
            <span
              className="budget-donut-legend-color"
              style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
            />
            <span className="budget-donut-legend-name">{status.name}</span>
            <span className="budget-donut-legend-values">
              予算 {formatCurrency(status.budget)}／使用 {formatCurrency(status.spent)}
            </span>
            <strong className={status.remaining < 0 ? "over-budget" : ""}>
              残り {formatCurrency(status.remaining)}
            </strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default BudgetDonutChart;
