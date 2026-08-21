import { useState } from "react";

function App() {
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState<string[]>([]);
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense),
    0,
  );
  function handleExpenseClick() {
    setExpenses([...expenses, amount]);
    alert(`${amount}円を入力しました！`);
    setAmount("");
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
      <p>支出合計：{total}円</p>
      <h2>支出履歴</h2>

      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>{expense}円</li>
        ))}
      </ul>
    </main>
  );
}

export default App;
