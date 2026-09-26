// 月予算はカテゴリ予算から自動計算し、この画面では表示だけ行います。
import { formatCurrency } from "../utils/formatCurrency";

type MonthlyBudgetPanelProps = {
  selectedMonth: string;
  savedBudgetAmount: number | null;
  remainingBudget: number | null;
};

export default function MonthlyBudgetPanel({
  selectedMonth, savedBudgetAmount, remainingBudget,
}: MonthlyBudgetPanelProps) {
  const usagePercentage = savedBudgetAmount !== null && savedBudgetAmount > 0 && remainingBudget !== null
    ? Math.round(((savedBudgetAmount - remainingBudget) / savedBudgetAmount) * 100)
    : null;

  return (
    <section>
      <h2>月予算（カテゴリ予算の合計）</h2>
      <p>貯金を含むカテゴリ予算を合計します。変更は予算画面の「カテゴリ別予算」で行えます。</p>
      {selectedMonth === "" ? (
        <p>予算を設定する月を選択してください。</p>
      ) : savedBudgetAmount === null || remainingBudget === null ? (
        <p>この月の予算は未設定です。カテゴリ予算を設定してください。</p>
      ) : (
        <>
          <p>月予算：{formatCurrency(savedBudgetAmount)}</p>
          <div className="budget-heading">
            <span>予算の使用率</span>
            <strong>{usagePercentage === null ? "—" : `${usagePercentage}%`}</strong>
          </div>
          <div className="budget-progress">
            <div className="budget-progress-bar" style={{ width: `${Math.max(0, Math.min(usagePercentage ?? 0, 100))}%` }} />
          </div>
          {remainingBudget >= 0 ? (
            <p>残り予算：{formatCurrency(remainingBudget)}</p>
          ) : (
            <p className="over-budget">予算オーバー：{formatCurrency(Math.abs(remainingBudget))}</p>
          )}
          <p>残り予算には、予算未設定のカテゴリの支出と貯金も反映します。</p>
        </>
      )}
    </section>
  );
}