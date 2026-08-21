import { useState } from "react";

type Expense = {
  amount: string;
  memo: string;
  date: string;
};

function App() {
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0,
  );
  function handleExpenseClick() {
    if (amount === "" || Number(amount) <= 0) {
      alert("1円以上の金額を入力してください。");
      return;
    }

    setExpenses([...expenses, { amount, memo, date }]);
    alert(`${amount}円を入力しました！`);
    setAmount("");
    setMemo("");
    setDate("");
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

      <label>
        メモ
        <input
          type="text"
          placeholder="例：昼ごはん"
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
        />
      </label>

      <label>
        日付
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>

      <button onClick={handleExpenseClick}>
        支出を入力する
      </button>
      <p>支出合計：{total}円</p>
      <h2>支出履歴</h2>

      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.date || "日付なし"}：{expense.amount}円：
            {expense.memo || "メモなし"}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
