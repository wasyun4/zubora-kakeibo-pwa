import { useState } from "react";
import type { Category } from "../categories";

type CategoryBudgetPanelProps = {
    selectedMonth: string;
    categories: Category[];
    statuses: {
        id: string;
        name: string;
        budget: number;
        spent: number;
        remaining: number;
    }[];
    onSave: (majorCategoryId: string, amount: number) => void;
};

function CategoryBudgetPanel({
    selectedMonth,
    categories,
    statuses,
    onSave,
}: CategoryBudgetPanelProps) {
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState("");

    function handleSave() {
        if (
            selectedMonth === "" ||
            categoryId === "" ||
            amount === "" ||
            Number(amount) <= 0
        ) {
            alert("月・カテゴリ・予算金額を入力してください。");
            return;
        }

        onSave(categoryId, Number(amount));
        setAmount("");
    }

    return (
        <section>
            <h2>カテゴリ別予算</h2>

            <label>
                大カテゴリ
                <select
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                >
                    <option value="">選択してください</option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                予算金額
                <input
                    type="number"
                    placeholder="例：30000"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                />
            </label>

            <button onClick={handleSave}>
                カテゴリ予算を保存する
            </button>

            {statuses.length === 0 ? (
                <p>この月のカテゴリ予算は未設定です。</p>
            ) : (
                <ul>
                    {statuses.map((status) => (
                        <li key={status.id}>
                            <strong>{status.name}</strong>
                            <br />
                            予算：{status.budget.toLocaleString()}円
                            <br />
                            使用：{status.spent.toLocaleString()}円
                            <br />
                            {status.remaining >= 0
                                ? `残り：${status.remaining.toLocaleString()}円`
                                : `予算オーバー：${Math.abs(
                                    status.remaining,
                                ).toLocaleString()}円`}
                        </li>
                    ))}
                </ul>
            )}

        </section>
    );
}

export default CategoryBudgetPanel;