import { useEffect, useState } from "react";
import { initialCategories } from "./categories";
import { initialPaymentMethods } from "./paymentMethods";
import type {
  CategoryBudget,
  MonthlyBudget,
  Transaction,
  TransactionScope,
} from "./types";
import Summary from "./components/Summary";
import CategoryTotals from "./components/CategoryTotals";
import MonthFilter from "./components/MonthFilter";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import MonthlyBudgetPanel from "./components/MonthlyBudgetPanel";
import CategoryBudgetPanel from "./components/CategoryBudgetPanel";

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
  const [selectedMonth, setSelectedMonth] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [monthlyBudgets, setMonthlyBudgets] =
    useState<MonthlyBudget[]>(() => {
      const savedBudgets =
        localStorage.getItem("monthlyBudgets");

      return savedBudgets ? JSON.parse(savedBudgets) : [];
    });
  const [categoryBudgets, setCategoryBudgets] =
    useState<CategoryBudget[]>(() => {
      const savedCategoryBudgets =
        localStorage.getItem("categoryBudgets");

      return savedCategoryBudgets
        ? JSON.parse(savedCategoryBudgets)
        : [];
    });
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

  useEffect(() => {
    localStorage.setItem(
      "monthlyBudgets",
      JSON.stringify(monthlyBudgets),
    );
  }, [monthlyBudgets]);

  useEffect(() => {
    const savedBudget = monthlyBudgets.find(
      (budget) => budget.month === selectedMonth,
    );

    setBudgetAmount(
      savedBudget ? String(savedBudget.amount) : "",
    );
  }, [selectedMonth, monthlyBudgets]);

  useEffect(() => {
    localStorage.setItem(
      "categoryBudgets",
      JSON.stringify(categoryBudgets),
    );
  }, [categoryBudgets]);

  const filteredExpenses =
    selectedMonth === ""
      ? expenses
      : expenses.filter((expense) =>
        expense.date.startsWith(selectedMonth),
      );

  const expenseTotal = filteredExpenses
    .filter(
      (expense) =>
        expense.type === "expense" &&
        expense.majorCategoryId !== "savings",
    )
    .reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

  const savingsTotal = filteredExpenses
    .filter(
      (expense) =>
        expense.type === "expense" &&
        expense.majorCategoryId === "savings",
    )
    .reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

  const incomeTotal = filteredExpenses
    .filter((expense) => expense.type === "income")
    .reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

  const expenseCategoryTotals = expenseMajorCategories
    .filter((category) => category.id !== "savings")
    .map((category) => {
      const total = filteredExpenses
        .filter(
          (expense) =>
            expense.type === "expense" &&
            expense.majorCategoryId === category.id,
        )
        .reduce(
          (sum, expense) => sum + Number(expense.amount),
          0,
        );

      return {
        id: category.id,
        name: category.name,
        total,
      };
    })
    .filter((category) => category.total > 0);

  const categoryBudgetStatuses = categoryBudgets
    .filter((budget) => budget.month === selectedMonth)
    .map((budget) => {
      const category = expenseMajorCategories.find(
        (item) => item.id === budget.majorCategoryId,
      );

      const categoryTotal = expenseCategoryTotals.find(
        (item) => item.id === budget.majorCategoryId,
      );

      const spent = categoryTotal?.total ?? 0;

      return {
        id: budget.majorCategoryId,
        name: category?.name ?? "カテゴリなし",
        budget: budget.amount,
        spent,
        remaining: budget.amount - spent,
      };
    });

  const availableBalance =
    incomeTotal - expenseTotal - savingsTotal;

  const selectedBudget = monthlyBudgets.find(
    (budget) => budget.month === selectedMonth,
  );

  const remainingBudget =
    selectedBudget === undefined
      ? null
      : selectedBudget.amount - expenseTotal;

  function handleSaveBudget() {
    if (selectedMonth === "") {
      alert("予算を設定する月を選択してください。");
      return;
    }

    if (budgetAmount === "" || Number(budgetAmount) <= 0) {
      alert("1円以上の予算を入力してください。");
      return;
    }

    const newBudget: MonthlyBudget = {
      month: selectedMonth,
      amount: Number(budgetAmount),
    };

    const alreadyExists = monthlyBudgets.some(
      (budget) => budget.month === selectedMonth,
    );

    setMonthlyBudgets(
      alreadyExists
        ? monthlyBudgets.map((budget) =>
          budget.month === selectedMonth
            ? newBudget
            : budget,
        )
        : [...monthlyBudgets, newBudget],
    );

    alert(`${selectedMonth}の予算を保存しました！`);
  }

  function handleSaveCategoryBudget(
    majorCategoryId: string,
    amount: number,
  ) {
    const newBudget: CategoryBudget = {
      month: selectedMonth,
      majorCategoryId,
      amount,
    };

    const alreadyExists = categoryBudgets.some(
      (budget) =>
        budget.month === selectedMonth &&
        budget.majorCategoryId === majorCategoryId,
    );

    setCategoryBudgets(
      alreadyExists
        ? categoryBudgets.map((budget) =>
          budget.month === selectedMonth &&
            budget.majorCategoryId === majorCategoryId
            ? newBudget
            : budget,
        )
        : [...categoryBudgets, newBudget],
    );

    alert("カテゴリ予算を保存しました！");
  }

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

  return (
    <main>
      <h1>家計簿アプリ</h1>
      <p>ここから少しずつ作っていきます。</p>

      <TransactionForm
        type={type}
        majorCategoryId={majorCategoryId}
        minorCategoryId={minorCategoryId}
        amount={amount}
        memo={memo}
        date={date}
        source={source}
        paymentMethodId={paymentMethodId}
        scope={scope}
        editingTransactionId={editingTransactionId}
        incomeCategories={incomeCategories}
        expenseMajorCategories={expenseMajorCategories}
        expenseMinorCategories={expenseMinorCategories}
        paymentMethods={initialPaymentMethods}
        onTypeChange={(value) => {
          setType(value);
          setMajorCategoryId("");
          setMinorCategoryId("");
        }}
        onMajorCategoryChange={(value) => {
          setMajorCategoryId(value);
          setMinorCategoryId("");
        }}
        onMinorCategoryChange={setMinorCategoryId}
        onAmountChange={setAmount}
        onMemoChange={setMemo}
        onDateChange={setDate}
        onSourceChange={setSource}
        onPaymentMethodChange={setPaymentMethodId}
        onScopeChange={setScope}
        onSubmit={handleExpenseClick}
        onCancel={resetForm}
      />


      <MonthFilter
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <MonthlyBudgetPanel
        selectedMonth={selectedMonth}
        budgetAmount={budgetAmount}
        savedBudgetAmount={selectedBudget?.amount ?? null}
        remainingBudget={remainingBudget}
        onBudgetAmountChange={setBudgetAmount}
        onSave={handleSaveBudget}
      />

      <CategoryBudgetPanel
        selectedMonth={selectedMonth}
        categories={expenseMajorCategories.filter(
          (category) => category.id !== "savings",
        )}
        statuses={categoryBudgetStatuses}
        onSave={handleSaveCategoryBudget}
      />

      <Summary
        incomeTotal={incomeTotal}
        expenseTotal={expenseTotal}
        savingsTotal={savingsTotal}
        availableBalance={availableBalance}
      />

      <CategoryTotals categoryTotals={expenseCategoryTotals} />

      <TransactionList
        transactions={filteredExpenses}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteExpense}
      />
    </main>
  );
}

export default App;
