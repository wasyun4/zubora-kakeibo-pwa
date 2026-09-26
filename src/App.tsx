// 【家計簿アプリ全体の司令塔】
// データの管理・集計・操作を行い、各画面コンポーネントを組み合わせるファイルです。

import { useEffect, useState } from "react";
import { initialCategories } from "./categories";
import { initialPaymentMethods } from "./paymentMethods";
import type {
  AppView,
  CategoryBudget,
  Transaction,
  TransactionScope,
  WalletData,
} from "./types";
import Summary from "./components/Summary";
import CategoryTotals from "./components/CategoryTotals";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import MonthlyBudgetPanel from "./components/MonthlyBudgetPanel";
import CategoryBudgetPanel from "./components/CategoryBudgetPanel";
import CategoryBudgetComparison from "./components/CategoryBudgetComparison";
import SettingsPanel from "./components/SettingsPanel";
import WalletPanel from "./components/WalletPanel";
import WalletSettings from "./components/WalletSettings";
import MobileLayout from "./components/MobileLayout";
import TransactionDialog from "./components/TransactionDialog";
import { calculateWalletBalances, emptyWalletData } from "./utils/wallets";
import { getAccountingPeriod } from "./utils/accountingPeriod";
import CsvPanel from "./components/CsvPanel";
import { calculateMonthlyBudget } from "./utils/budgets";
import {
  downloadBackup,
  restoreBackup,
} from "./utils/backup";
import { downloadTransactionsCsv } from "./utils/csv";
import { readTransactionsCsv } from "./utils/csvImport";
import {
  loadCategoryBudgets,
  loadMonthStartDay,
  loadWalletData,
  loadTransactions,
  saveCategoryBudgets,
  saveMonthStartDay,
  saveWalletData,
  saveTransactions,
} from "./utils/database";

function getCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function App() {
  // 【収入・支出の大カテゴリ抽出】
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

  // 【収支入力フォームの状態管理】
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
  const [isTransactionFormOpen, setIsTransactionFormOpen] =
    useState(false);
  const [activeView, setActiveView] =
    useState<AppView>("home");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  // 【月初め日の設定管理】
  const [monthStartDay, setMonthStartDay] = useState("1");

  // 【カテゴリ別予算データ管理】
  const [categoryBudgets, setCategoryBudgets] =
    useState<CategoryBudget[]>([]);
  const [areCategoryBudgetsLoaded, setAreCategoryBudgetsLoaded] =
    useState(false);

  // 【店舗・収入元の状態管理】
  const [source, setSource] = useState("");

  // 【選択した大カテゴリに属する小カテゴリ抽出】
  const expenseMinorCategories = initialCategories.filter(
    (category) =>
      category.type === "expense" &&
      category.parentId === majorCategoryId &&
      category.isActive,
  );

  // 【収支履歴の読み込みと状態管理】
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [isDatabaseLoaded, setIsDatabaseLoaded] = useState(false);
  const [walletData, setWalletData] = useState<WalletData>(emptyWalletData);
  const [isWalletDataLoaded, setIsWalletDataLoaded] = useState(false);

  useEffect(() => {
    void loadWalletData().then((saved) => {
      setWalletData(saved);
      setIsWalletDataLoaded(true);
    });
  }, []);

  async function updateWalletData(next: WalletData) {
    await saveWalletData(next);
    setWalletData(next);
  }

  // 【IndexedDBから月初め日を読み込む】
  useEffect(() => {
    async function fetchMonthStartDay() {
      const savedMonthStartDay = await loadMonthStartDay();
      setMonthStartDay(savedMonthStartDay ?? "1");
    }

    void fetchMonthStartDay();
  }, []);

  // 【IndexedDBから収支履歴を読み込む】
  useEffect(() => {
    async function fetchTransactions() {
      const savedTransactions = await loadTransactions();

      setExpenses(savedTransactions);
      setIsDatabaseLoaded(true);
    }

    void fetchTransactions();
  }, []);

  // 【収支履歴をIndexedDBへ保存する】
  useEffect(() => {
    if (!isDatabaseLoaded) {
      return;
    }

    void saveTransactions(expenses);
  }, [expenses, isDatabaseLoaded]);

  // 【IndexedDBからカテゴリ予算を読み込む】
  useEffect(() => {
    async function fetchCategoryBudgets() {
      const savedCategoryBudgets = await loadCategoryBudgets();

      setCategoryBudgets(savedCategoryBudgets);
      setAreCategoryBudgetsLoaded(true);
    }

    void fetchCategoryBudgets();
  }, []);

  // 【カテゴリ予算をIndexedDBへ保存する】
  useEffect(() => {
    if (!areCategoryBudgetsLoaded) {
      return;
    }

    void saveCategoryBudgets(categoryBudgets);
  }, [categoryBudgets, areCategoryBudgetsLoaded]);

  // 【選択した表示月の集計期間】
  const accountingPeriod = getAccountingPeriod(
    selectedMonth,
    monthStartDay,
  );

  // 【表示月による収支の絞り込み】
  const filteredExpenses =
    accountingPeriod === null
      ? expenses
      : expenses.filter(
        (expense) =>
          expense.date >= accountingPeriod.start &&
          expense.date <= accountingPeriod.end,
      );

  // 【生活支出合計の計算】
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

  // 【貯金合計の計算】
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

  // 【収入合計の計算】
  const incomeTotal = filteredExpenses
    .filter((expense) => expense.type === "income")
    .reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

  // 【大カテゴリ別支出合計の計算】
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

  // 【カテゴリ別の支出実績と予算を結合】
  const categoryBudgetComparisons = expenseMajorCategories
    .filter((category) => category.id !== "savings")
    .map((category) => {
      const categoryTotal = expenseCategoryTotals.find(
        (item) => item.id === category.id,
      );

      const categoryBudget = categoryBudgets.find(
        (budget) =>
          budget.month === selectedMonth &&
          budget.majorCategoryId === category.id,
      );

      return {
        id: category.id,
        name: category.name,
        spent: categoryTotal?.total ?? 0,
        budget: categoryBudget?.amount ?? null,
      };
    })
    .filter(
      (item) => item.spent > 0 || item.budget !== null,
    );

  // 【カテゴリ別予算の使用額と残額計算】
  const categoryBudgetStatuses = categoryBudgets
    .filter((budget) => budget.month === selectedMonth)
    .map((budget) => {
      const category = expenseMajorCategories.find(
        (item) => item.id === budget.majorCategoryId,
      );

      const categoryTotal = expenseCategoryTotals.find(
        (item) => item.id === budget.majorCategoryId,
      );

      const spent = budget.majorCategoryId === "savings" ? savingsTotal : categoryTotal?.total ?? 0;

      return {
        id: budget.majorCategoryId,
        name: category?.name ?? "カテゴリなし",
        budget: budget.amount,
        spent,
        remaining: budget.amount - spent,
      };
    });

  // 【使える残り金額の計算】
  const availableBalance =
    incomeTotal - expenseTotal - savingsTotal;

  const walletBalances = calculateWalletBalances(walletData, expenses);

  // 月予算は表示月のカテゴリ予算の合計。未設定カテゴリの支出も残額に含める。
  const { total: monthlyBudgetTotal, remaining: remainingBudget } =
    calculateMonthlyBudget(categoryBudgets, selectedMonth, expenseTotal, savingsTotal);

  // 【カテゴリ別予算の保存】
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

  // 【月初め日の保存】
  async function handleSaveMonthStartDay() {
    const startDay = Number(monthStartDay);

    if (startDay < 1 || startDay > 28) {
      alert("月初め日は1日から28日の間で入力してください。");
      return;
    }

    await saveMonthStartDay(String(startDay));

    setMonthStartDay(String(startDay));
    alert(`月初め日を${startDay}日に設定しました！`);
  }

  // 【バックアップファイルからの復元】
  async function handleRestoreBackup(file: File) {
    try {
      const restored = await restoreBackup(file);

      if (!restored) {
        return;
      }

      alert("バックアップから復元しました！");
      window.location.reload();
    } catch {
      alert("バックアップファイルを読み込めませんでした。");
    }
  }

  // 【CSVファイルからの収支取り込み】
  async function handleImportCsv(file: File) {
    try {
      const importedTransactions =
        await readTransactionsCsv(file);

      if (importedTransactions.length === 0) {
        alert("取り込める収支データがありません。");
        return;
      }

      const shouldImport = window.confirm(
        `${importedTransactions.length}件の収支を追加します。よろしいですか？`,
      );

      if (!shouldImport) {
        return;
      }

      setExpenses((currentExpenses) => [
        ...currentExpenses,
        ...importedTransactions,
      ]);

      alert(
        `${importedTransactions.length}件の収支を取り込みました！`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "CSVファイルを読み込めませんでした。";

      alert(message);
    }
  }

  // 【収支入力フォームの初期化】
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
    setIsTransactionFormOpen(false);
  }

  // 【収支の新規登録・更新】
  function handleExpenseClick() {
    if (amount === "" || Number(amount) <= 0) {
      alert("1円以上の金額を入力してください。");
      return;
    }

    if (date === "") {
      alert("日付を入力してください。");
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

  // 【収支履歴の削除】
  function handleDeleteExpense(id: string) {
    setExpenses(
      expenses.filter((expense) => expense.id !== id),
    );
  }

  // 【収支履歴の編集開始】
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
    setIsTransactionFormOpen(true);
  }

  // 【画面コンポーネントの組み立て】
  return (
    <MobileLayout
      selectedMonth={selectedMonth}
      monthStartDay={monthStartDay}
      onMonthChange={(month) => setSelectedMonth(month || getCurrentMonth())}
      activeView={activeView}
      onViewChange={setActiveView}
    >

      {/*ホーム画面*/}
      {activeView === "home" &&
        <>
          <Summary
            incomeTotal={incomeTotal}
            expenseTotal={expenseTotal}
            savingsTotal={savingsTotal}
            availableBalance={availableBalance}
            isExpenseOverBudget={
              remainingBudget !== null && remainingBudget < 0
            }
          />

          <WalletPanel
            balances={walletBalances}
            isLoaded={isWalletDataLoaded && isDatabaseLoaded}
          />

          <MonthlyBudgetPanel
            selectedMonth={selectedMonth}
            savedBudgetAmount={monthlyBudgetTotal}
            remainingBudget={remainingBudget}
          />

          <CategoryBudgetComparison
            items={categoryBudgetComparisons}
          />
        </>
      }

      {/*分析画面*/}
      {activeView === "analysis" && (
        <CategoryTotals categoryTotals={expenseCategoryTotals} />
      )}

      {/* 予算画面 */}
      {activeView === "budget" && (
        <>
          <MonthlyBudgetPanel
            selectedMonth={selectedMonth}
            savedBudgetAmount={monthlyBudgetTotal}
            remainingBudget={remainingBudget}
          />

          <CategoryBudgetPanel
            selectedMonth={selectedMonth}
            categories={expenseMajorCategories}
            statuses={categoryBudgetStatuses}
            onSave={handleSaveCategoryBudget}
          />
        </>
      )}

      {/*記録画面*/}
      {activeView === "records" && (
        <>
          <TransactionList
            transactions={filteredExpenses}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteExpense}
          />
        </>
      )}

      <button
        type="button"
        className="floating-add-button"
        aria-label="収支を登録する"
        onClick={() => {
          resetForm();
          setIsTransactionFormOpen(true);
        }}
      >
        ＋
      </button>

      {isTransactionFormOpen && (
        <TransactionDialog onCancel={resetForm}>
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
        </TransactionDialog>
      )}
      {/* 設定画面 */}
      {activeView === "settings" && (
        <>
          <SettingsPanel
            monthStartDay={monthStartDay}
            onMonthStartDayChange={setMonthStartDay}
            onSave={handleSaveMonthStartDay}
            onBackup={downloadBackup}
            onRestore={handleRestoreBackup}
          />

          {isWalletDataLoaded && (
            <WalletSettings data={walletData} onChange={updateWalletData} />
          )}

          <CsvPanel
            onExport={() => downloadTransactionsCsv(expenses)}
            onImport={handleImportCsv}
          />
        </>
      )}

    </MobileLayout>
  );
}

export default App;
