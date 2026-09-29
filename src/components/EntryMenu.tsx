// 【入力方法の選択】
// ＋ボタンを押した後に、通常入力かレシート入力かを選びます。

type EntryMenuProps = {
  onTransaction: () => void;
  onReceipt: () => void;
  onCancel: () => void;
};

export default function EntryMenu({ onTransaction, onReceipt, onCancel }: EntryMenuProps) {
  return (
    <section className="entry-menu">
      <div className="quick-entry-header">
        <h2 id="transaction-form-title">入力方法</h2>
        <button type="button" className="entry-close" aria-label="入力方法を閉じる" onClick={onCancel}>×</button>
      </div>
      <div className="entry-menu-options">
        <button type="button" onClick={onTransaction}>シンプル入力</button>
        <button type="button" onClick={onReceipt}>レシート手入力</button>
      </div>
    </section>
  );
}
