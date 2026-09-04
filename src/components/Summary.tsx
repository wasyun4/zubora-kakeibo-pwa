// 【月間収支まとめ】
// App.tsxで計算された収入・生活支出・貯金・使える残りを表示する部品です。

import { formatCurrency } from "../utils/formatCurrency";

type SummaryProps = {
  incomeTotal: number;
  expenseTotal: number;
  savingsTotal: number;
  availableBalance: number;
  isExpenseOverBudget: boolean;
};

function Summary({
  incomeTotal,
  expenseTotal,
  savingsTotal,
  availableBalance,
  isExpenseOverBudget,
}: SummaryProps) {
  return (
    <section className="summary">
      <h2>今月の収支</h2>

      <div className="summary-item income">
        <span className="summary-label">
          <span className="summary-icon">＋</span>
          収入
        </span>
        <strong>{formatCurrency(incomeTotal)}</strong>
      </div>

      <div className="summary-item expense">
        <span className="summary-label">
          <span className="summary-icon">－</span>
          生活支出
        </span>
        <strong
          className={isExpenseOverBudget ? "over-budget" : ""}
        >
          {formatCurrency(expenseTotal)}
        </strong>
      </div>

      <div className="summary-item savings">
        <span className="summary-label">
          <span className="summary-icon">貯</span>
          貯金
        </span>
        <strong>{formatCurrency(savingsTotal)}</strong>
      </div>

      <div className="summary-item balance">
        <span className="summary-label">
          <span className="summary-icon">残</span>
          使える残り
        </span>
        <strong>{formatCurrency(availableBalance)}</strong>
      </div>
    </section>
  );
}

export default Summary;
