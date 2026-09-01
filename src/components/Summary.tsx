type SummaryProps = {
  incomeTotal: number;
  expenseTotal: number;
  savingsTotal: number;
  availableBalance: number;
};

function Summary({
  incomeTotal,
  expenseTotal,
  savingsTotal,
  availableBalance,
}: SummaryProps) {
  return (
    <section className="summary">
      <div className="summary-item income">
        <span>収入合計</span>
        <strong>{incomeTotal}円</strong>
      </div>

      <div className="summary-item expense">
        <span>生活支出</span>
        <strong>{expenseTotal}円</strong>
      </div>

      <div className="summary-item savings">
        <span>貯金</span>
        <strong>{savingsTotal}円</strong>
      </div>

      <div className="summary-item balance">
        <span>使える残り</span>
        <strong>{availableBalance}円</strong>
      </div>
    </section>
  );
}

export default Summary;