// 【ウォレット設定】
// 記録開始時点の各ウォレットの金額を設定します。
import { useEffect, useState } from "react";
import type { WalletData, WalletId } from "../types";
import { walletIds, walletNames } from "../utils/wallets";

type WalletSettingsProps = {
  data: WalletData;
  onChange: (data: WalletData) => Promise<void>;
};

function WalletSettings({ data, onChange }: WalletSettingsProps) {
  const [opening, setOpening] = useState(() => ({ ...data.openingBalances }));
  const [cardSettings, setCardSettings] = useState(() => ({ ...data.creditCardSettings }));

  useEffect(() => {
    setOpening({ ...data.openingBalances });
    setCardSettings({ ...data.creditCardSettings });
  }, [data]);

  async function saveOpening() {
    if (walletIds.some((id) => !Number.isFinite(opening[id]) || opening[id] < 0)) {
      alert("開始額には0円以上の数字を入力してください。");
      return;
    }
    if (
      cardSettings.closingDay < 1 || cardSettings.closingDay > 31 ||
      cardSettings.paymentDay < 1 || cardSettings.paymentDay > 31 ||
      cardSettings.paymentWalletId === "creditCard"
    ) {
      alert("クレカの締め日・引落日・引落口座を確認してください。");
      return;
    }
    await onChange({
      ...data,
      openingBalances: opening,
      creditCardSettings: cardSettings,
    });
    alert("ウォレットとクレカ設定を保存しました。");
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

      <h3>クレカの自動引き落とし</h3>
      <p>締め日までの利用額をまとめ、翌月の引落日に指定口座から自動で差し引きます。31日は月末締めです。</p>
      <label>
        締め日
        <input type="number" min="1" max="31" value={cardSettings.closingDay}
          onChange={(event) => setCardSettings({ ...cardSettings, closingDay: Number(event.target.value) })} />
      </label>
      <label>
        引落日
        <input type="number" min="1" max="31" value={cardSettings.paymentDay}
          onChange={(event) => setCardSettings({ ...cardSettings, paymentDay: Number(event.target.value) })} />
      </label>
      <label>
        引落口座
        <select value={cardSettings.paymentWalletId}
          onChange={(event) => setCardSettings({ ...cardSettings, paymentWalletId: event.target.value as WalletId })}>
          {walletIds.filter((id) => id !== "creditCard").map((id) => (
            <option key={id} value={id}>{walletNames[id]}</option>
          ))}
        </select>
      </label>

      <button type="button" onClick={() => void saveOpening()}>設定を保存する</button>

    </section>
  );
}

export default WalletSettings;
