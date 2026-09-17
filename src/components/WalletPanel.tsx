// 【ウォレット別残高】
// 現金・口座・電子マネーの残高と、クレカの未払い額を表示します。
import type { WalletId } from "../types";
import { formatCurrency } from "../utils/formatCurrency";
import { walletIds, walletNames } from "../utils/wallets";

type WalletPanelProps = {
  balances: Record<WalletId, number>;
  isLoaded: boolean;
};

function WalletPanel({ balances, isLoaded }: WalletPanelProps) {
  return (
    <section className="wallet-panel">
      <h2>ウォレット別残高</h2>
      {!isLoaded ? <p>読み込み中…</p> : (
        <>
          <ul className="wallet-list">
            {walletIds.map((id) => (
              <li key={id}>
                <span>{walletNames[id]}</span>
                <strong className={id === "creditCard" && balances[id] > 0 ? "over-budget" : ""}>
                  {formatCurrency(balances[id])}
                </strong>
              </li>
            ))}
          </ul>
          <p className="wallet-note">開始額とすべての記録から計算。クレカは未払い額です。</p>
        </>
      )}
    </section>
  );
}

export default WalletPanel;
