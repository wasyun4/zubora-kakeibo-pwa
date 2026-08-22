import { useEffect, useState } from "react";

type Expense = {
  type: string;
  amount: string;
  memo: string;
  date: string;
};

function App() {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem("expenses");

    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses),
    );
  }, [expenses]);

  const expenseTotal = expenses
    .filter((expense) => expense.type === "expense")
    .reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

  const incomeTotal = expenses
    .filter((expense) => expense.type === "income")
    .reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

  const balance = incomeTotal - expenseTotal;

  function handleExpenseClick() {
    if (amount === "" || Number(amount) <= 0) {
      alert("1円以上の金額を入力してください。");
      return;
    }

    setExpenses([...expenses, { type, amount, memo, date }]);
    alert(`${amount}円を入力しました！`);
    setAmount("");
    setMemo("");
    setDate("");
  }

  function handleDeleteExpense(index: number) {
    setExpenses(
      expenses.filter((_, expenseIndex) => expenseIndex !== index),
    );
  }

  return (
    <main>
      <h1>家計簿アプリ</h1>
      <p>ここから少しずつ作っていきます。</p>

      <label>
        種類
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="expense">支出</option>
          <option value="income">収入</option>
        </select>
      </label>

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
        収支を入力する
      </button>
      <p>収入合計：{incomeTotal}円</p>
      <p>支出合計：{expenseTotal}円</p>
      <p>残高：{balance}円</p>
      <h2>収支履歴</h2>

      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.type === "expense" ? "支出" : "収入"}：
            {expense.date || "日付なし"}：{expense.amount}円：
            {expense.memo || "メモなし"}

            <button onClick={() => handleDeleteExpense(index)}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
