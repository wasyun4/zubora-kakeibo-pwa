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
    <section>
      <p>収入合計：{incomeTotal}円</p>
      <p>生活支出：{expenseTotal}円</p>
      <p>貯金：{savingsTotal}円</p>
      <p>使える残り：{availableBalance}円</p>
    </section>
  );
}

export default Summary;