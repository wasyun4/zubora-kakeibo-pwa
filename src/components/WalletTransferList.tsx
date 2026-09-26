// 【振替履歴】
// 口座間の移動やクレカ返済の履歴を表示し、削除操作をApp.tsxへ伝えます。

import type { WalletTransfer } from "../types";
import { formatCurrency } from "../utils/formatCurrency";
import { walletNames } from "../utils/wallets";

type WalletTransferListProps = {
  transfers: WalletTransfer[];
  onDelete: (id: string) => void;
};

function WalletTransferList({ transfers, onDelete }: WalletTransferListProps) {
  return (
    <section>
      <h2>振替履歴</h2>
      {transfers.length === 0 ? (
        <p>この月の振替はまだありません。</p>
      ) : (
        <ul className="wallet-transfer-list">
          {[...transfers].reverse().map((item) => (
            <li key={item.id}>
              <span>
                {item.date}　{walletNames[item.from]} → {walletNames[item.to]}　
                {formatCurrency(item.amount)}
                {item.memo ? `　${item.memo}` : ""}
              </span>
              <button type="button" onClick={() => onDelete(item.id)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default WalletTransferList;
