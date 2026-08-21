import { useState } from "react";

function App() {
  const [amount, setAmount] = useState("");

  function handleExpenseClick() {
    alert(`${amount}円を入力しました！`);
  }
  return (
    <main>
      <h1>家計簿アプリ</h1>
      <p>ここから少しずつ作っていきます。</p>

      <label>
        金額
        <input
          type="number"
          placeholder="例：1000"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>

      <button onClick={handleExpenseClick}>
        支出を入力する
      </button>
    </main>
  );
}

export default App;
