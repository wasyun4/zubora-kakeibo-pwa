// 【カテゴリ別の予算比較】
// 大カテゴリごとの支出実績と設定予算を横並びで表示する部品です。

import { formatCurrency } from "../utils/formatCurrency";

type CategoryBudgetComparisonItem = {
    id: string;
    name: string;
    spent: number;
    budget: number | null;
};

type CategoryBudgetComparisonProps = {
    items: CategoryBudgetComparisonItem[];
};

function CategoryBudgetComparison({
    items,
}: CategoryBudgetComparisonProps) {
    return (
        <section>
            <h2>カテゴリ別支出</h2>

            {items.length === 0 ? (
                <p>この月の支出はまだありません。</p>
            ) : (
                <ul className="category-comparison-list">
                    {items.map((item) => (
                        <li key={item.id}>
                            <strong>{item.name}</strong>

                            <div className="category-comparison-values">
                                <span>支出：{formatCurrency(item.spent)}</span>
                                <span>
                                    予算：
                                    {item.budget === null
                                        ? "未設定"
                                        : formatCurrency(item.budget)}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default CategoryBudgetComparison;