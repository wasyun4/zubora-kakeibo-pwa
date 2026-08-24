import { useEffect, useState } from "react";
import { initialCategories } from "./categories";
import { initialPaymentMethods } from "./paymentMethods";

type TransactionScope = "personal" | "shared";

type Transaction = {
  id: string;
  type: string;
  amount: string;
  memo: string;
  date: string;
  source: string;
  majorCategoryId: string;
  minorCategoryId: string;
  paymentMethodId: string;
  scope: TransactionScope;
};

function App() {
  const incomeCategories = initialCategories.filter(
    (category) =>
      category.type === "income" &&
      category.parentId === null &&
      category.isActive,
  );

  const expenseMajorCategories = initialCategories.filter(
    (category) =>
      category.type === "expense" &&
      category.parentId === null &&
      category.isActive,
  );

  const [type, setType] = useState("expense");
  const [majorCategoryId, setMajorCategoryId] = useState("");
  const [minorCategoryId, setMinorCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [scope, setScope] =
    useState<TransactionScope>("personal");
  const [editingTransactionId, setEditingTransactionId] =
    useState<string | null>(null);

  const [source, setSource] = useState("");

  const expenseMinorCategories = initialCategories.filter(
    (category) =>
      category.type === "expense" &&
      category.parentId === majorCategoryId &&
      category.isActive,
  );

  const [expenses, setExpenses] = useState<Transaction[]>(() => {
    const savedExpenses = localStorage.getItem("expenses");

    const parsedExpenses = savedExpenses
      ? JSON.parse(savedExpenses)
      : [];

    return parsedExpenses.map((expense: Transaction) => ({
      ...expense,
      id: expense.id || crypto.randomUUID(),
    }));
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

  function resetForm() {
    setAmount("");
    setMemo("");
    setDate("");
    setSource("");
    setMajorCategoryId("");
    setMinorCategoryId("");
    setPaymentMethodId("");
    setScope("personal");
    setEditingTransactionId(null);
  }

  function handleExpenseClick() {
    if (amount === "" || Number(amount) <= 0) {
      alert("1円以上の金額を入力してください。");
      return;
    }

    if (paymentMethodId === "") {
      alert("支払方法を選択してください。");
      return;
    }

    if (type === "income" && majorCategoryId === "") {
      alert("収入カテゴリを選択してください。");
      return;
    }

    if (
      type === "expense" &&
      (majorCategoryId === "" || minorCategoryId === "")
    ) {
      alert("支出の大カテゴリと小カテゴリを選択してください。");
      return;
    }

    const transactionData = {
      type,
      amount,
      memo,
      date,
      source,
      majorCategoryId,
      minorCategoryId,
      paymentMethodId,
      scope,
    };

    if (editingTransactionId === null) {
      setExpenses([
        ...expenses,
        {
          id: crypto.randomUUID(),
          ...transactionData,
        },
      ]);

      alert(`${amount}円を入力しました！`);
    } else {
      setExpenses(
        expenses.map((expense) =>
          expense.id === editingTransactionId
            ? { ...expense, ...transactionData }
            : expense,
        ),
      );

      alert(`${amount}円に更新しました！`);
    }

    resetForm();
  }

  function handleDeleteExpense(id: string) {
    setExpenses(
      expenses.filter((expense) => expense.id !== id),
    );
  }

  function handleEditTransaction(id: string) {
    const transaction = expenses.find(
      (expense) => expense.id === id,
    );

    if (!transaction) {
      return;
    }

    setType(transaction.type);
    setAmount(transaction.amount);
    setMemo(transaction.memo);
    setDate(transaction.date);
    setSource(transaction.source);
    setMajorCategoryId(transaction.majorCategoryId || "");
    setMinorCategoryId(transaction.minorCategoryId || "");
    setPaymentMethodId(transaction.paymentMethodId || "");
    setScope(transaction.scope || "personal");
    setEditingTransactionId(transaction.id);
  }

  function getCategoryName(categoryId: string) {
    const category = initialCategories.find(
      (item) => item.id === categoryId,
    );
    return category?.name || "カテゴリなし";
  }

  function getPaymentMethodName(paymentMethodId: string) {
    const paymentMethod = initialPaymentMethods.find(
      (item) => item.id === paymentMethodId,
    );

    return paymentMethod?.name || "支払方法なし";
  }

  return (
    <main>
      <h1>家計簿アプリ</h1>
      <p>ここから少しずつ作っていきます。</p>

      <label>
        種類
        <select
          value={type}
          onChange={(event) => {
            setType(event.target.value);
            setMajorCategoryId("");
            setMinorCategoryId("");
          }}
        >
          <option value="expense">支出</option>
          <option value="income">収入</option>
        </select>
      </label>

      {
        type === "income" && (
          <label>
            収入カテゴリ
            <select
              value={majorCategoryId}
              onChange={(event) => {
                setMajorCategoryId(event.target.value);
                setMinorCategoryId("");
              }}
            >
              <option value="">選択してください</option>

              {incomeCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        )
      }

      {type === "expense" && (
        <label>
          支出の大カテゴリ
          <select
            value={majorCategoryId}
            onChange={(event) => {
              setMajorCategoryId(event.target.value);
              setMinorCategoryId("");
            }}
          >
            <option value="">選択してください</option>

            {expenseMajorCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {type === "expense" && majorCategoryId !== "" && (
        <label>
          支出の小カテゴリ
          <select
            value={minorCategoryId}
            onChange={(event) =>
              setMinorCategoryId(event.target.value)
            }
          >
            <option value="">選択してください</option>

            {expenseMinorCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      )}

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

      <label>
        店舗・収入元
        <input
          type="text"
          value={source}
          onChange={(event) => setSource(event.target.value)}
        />
      </label>

      <label>
        支払方法
        <select
          value={paymentMethodId}
          onChange={(event) =>
            setPaymentMethodId(event.target.value)
          }
        >
          <option value="">選択してください</option>

          {initialPaymentMethods
            .filter((paymentMethod) => paymentMethod.isActive)
            .map((paymentMethod) => (
              <option
                key={paymentMethod.id}
                value={paymentMethod.id}
              >
                {paymentMethod.name}
              </option>
            ))}
        </select>
      </label>

      <label>
        個人・共有
        <select
          value={scope}
          onChange={(event) =>
            setScope(event.target.value as TransactionScope)
          }
        >
          <option value="personal">個人</option>
          <option value="shared">共有</option>
        </select>
      </label>

      <button onClick={handleExpenseClick}>
        {editingTransactionId === null
          ? "収支を入力する"
          : "収支を更新する"}
      </button>

      {editingTransactionId !== null && (
        <button type="button" onClick={resetForm}>
          編集をやめる
        </button>
      )}

      <p>収入合計：{incomeTotal}円</p>
      <p>支出合計：{expenseTotal}円</p>
      <p>残高：{balance}円</p>
      <h2>収支履歴</h2>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.type === "expense" ? "支出" : "収入"}：
            {expense.date || "日付なし"}：{expense.amount}円：
            {expense.memo || "メモなし"}
            {expense.source || "収支元なし"}
            ：{getCategoryName(expense.majorCategoryId)}
            {expense.type === "expense" &&
              `：${getCategoryName(expense.minorCategoryId)}`}
            ：{getPaymentMethodName(expense.paymentMethodId)}
            ：{expense.scope === "shared" ? "共有" : "個人"}

            <button
              onClick={() => handleEditTransaction(expense.id)}
            >
              編集
            </button>

            <button onClick={() => handleDeleteExpense(expense.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </main >
  );
}

export default App;
