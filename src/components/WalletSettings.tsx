// 【ウォレット設定】
// 記録開始時の金額と、財布・口座間の資金移動を登録します。
import { useState } from "react";
import type { WalletData, WalletId, WalletTransfer } from "../types";
import { formatCurrency } from "../utils/formatCurrency";
import { walletIds, walletNames } from "../utils/wallets";

type WalletSettingsProps = {
  data: WalletData;
  onChange: (data: WalletData) => Promise<void>;
};

function WalletSettings({ data, onChange }: WalletSettingsProps) {
  const [opening, setOpening] = useState(() => ({ ...data.openingBalances }));
  const [from, setFrom] = useState<WalletId>("bankAccount");
  const [to, setTo] = useState<WalletId>("cash");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toLocaleDateString("sv-SE"));

  async function saveOpening() {
    if (walletIds.some((id) => !Number.isFinite(opening[id]) || opening[id] < 0)) {
      alert("開始額には0円以上の数字を入力してください。");
      return;
    }
    await onChange({ ...data, openingBalances: opening });
    alert("ウォレットの開始額を保存しました。");
  }

  async function addTransfer() {
    const numericAmount = Number(amount);
    if (from === to || from === "creditCard" || !date || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      alert("移動元・移動先・日付・1円以上の金額を確認してください。");
      return;
    }
    const transfer: WalletTransfer = {
      id: crypto.randomUUID(), date, from, to, amount: numericAmount,
    };
    await onChange({ ...data, transfers: [...data.transfers, transfer] });
    setAmount("");
    alert("資金移動を登録しました。");
  }

  async function removeTransfer(id: string) {
    if (!window.confirm("この資金移動を削除しますか？")) return;
    await onChange({ ...data, transfers: data.transfers.filter((item) => item.id !== id) });
  }

  return (
    <section>
      <h2>ウォレット設定</h2>
      <p>開始額は、家計簿に記録し始める直前の金額です。クレカはその時点の未払い額を入れます。</p>
      {walletIds.map((id) => (
        <label key={id}>
          {walletNames[id]}の開始額
          <input type="number" min="0" step="1" value={opening[id]}
            onChange={(event) => setOpening({ ...opening, [id]: Number(event.target.value) })} />
        </label>
      ))}
      <button type="button" onClick={() => void saveOpening()}>開始額を保存する</button>

      <h3>資金移動・クレカ返済</h3>
      <p>現金の引き出しや口座間移動、クレカの返済はここへ。支出として二重登録しないでください。</p>
      <label>日付<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
      <label>移動元
        <select value={from} onChange={(event) => setFrom(event.target.value as WalletId)}>
          {walletIds.filter((id) => id !== "creditCard").map((id) => <option key={id} value={id}>{walletNames[id]}</option>)}
        </select>
      </label>
      <label>移動先
        <select value={to} onChange={(event) => setTo(event.target.value as WalletId)}>
          {walletIds.map((id) => <option key={id} value={id}>{walletNames[id]}</option>)}
        </select>
      </label>
      <label>金額<input type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
      <button type="button" onClick={() => void addTransfer()}>資金移動を登録する</button>
      {data.transfers.length > 0 && (
        <ul className="wallet-transfer-list">
          {[...data.transfers].reverse().map((item) => (
            <li key={item.id}>
              <span>{item.date}　{walletNames[item.from]} → {walletNames[item.to]}　{formatCurrency(item.amount)}</span>
              <button type="button" onClick={() => void removeTransfer(item.id)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default WalletSettings;
