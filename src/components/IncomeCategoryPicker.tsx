// 【収入カテゴリ選択】
// 収入カテゴリをポップアップで表示し、選択結果を入力フォームへ伝えます。

import { useState } from "react";
import type { Category } from "../categories";

type IncomeCategoryPickerProps = {
  categories: Category[];
  categoryId: string;
  onChange: (categoryId: string) => void;
};

function IncomeCategoryPicker({ categories, categoryId, onChange }: IncomeCategoryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategory = categories.find((category) => category.id === categoryId);

  return (
    <>
      <button
        type="button"
        className="entry-category-trigger"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <span>{selectedCategory?.name ?? "選択してください"}</span>
        <span aria-hidden="true">⌄</span>
      </button>

      {isOpen && (
        <div className="category-picker-backdrop" onClick={() => setIsOpen(false)}>
          <section
            className="category-picker"
            role="dialog"
            aria-modal="true"
            aria-labelledby="income-category-picker-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="category-picker-header category-picker-header-single">
              <h3 id="income-category-picker-title">収入カテゴリを選択</h3>
              <button
                type="button"
                aria-label="収入カテゴリ選択を閉じる"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="category-picker-options">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={category.id === categoryId}
                  onClick={() => {
                    onChange(category.id);
                    setIsOpen(false);
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default IncomeCategoryPicker;
