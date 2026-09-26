// 【ウォレット設定】
// 記録開始時点の各ウォレットの金額を設定します。
import { useState } from "react";
import type { WalletData } from "../types";
import { walletIds, walletNames } from "../utils/wallets";

type WalletSettingsProps = {
  data: WalletData;
  onChange: (data: WalletData) => Promise<void>;
};

function WalletSettings({ data, onChange }: WalletSettingsProps) {
  const [opening, setOpening] = useState(() => ({ ...data.openingBalances }));

  async function saveOpening() {
    if (walletIds.some((id) => !Number.isFinite(opening[id]) || opening[id] < 0)) {
      alert("開始額には0円以上の数字を入力してください。");
      return;
    }
    await onChange({ ...data, openingBalances: opening });
    alert("ウォレットの開始額を保存しました。");
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

    </section>
  );
}

export default WalletSettings;
