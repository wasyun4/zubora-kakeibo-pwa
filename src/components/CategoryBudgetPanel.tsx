// 【カテゴリ別予算】
// 大カテゴリごとの予算入力と保存操作、使用額、残額を表示する部品です。

import { useState } from "react";
import type { Category } from "../categories";
import { formatCurrency } from "../utils/formatCurrency";

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
            !Number.isFinite(Number(amount)) ||
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
                            予算：{formatCurrency(status.budget)}
                            <br />
                            使用：{formatCurrency(status.spent)}
                            <br />
                            {status.remaining >= 0
                                ? `残り：${formatCurrency(status.remaining)}`
                                : `予算オーバー：${formatCurrency(
                                    Math.abs(status.remaining),
                                )}`}
                        </li>
                    ))}
                </ul>
            )}

        </section>
    );
}

export default CategoryBudgetPanel;
