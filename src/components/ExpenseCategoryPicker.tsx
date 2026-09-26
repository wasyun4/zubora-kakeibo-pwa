// 【支出カテゴリ選択】
// 大カテゴリ、小カテゴリの順に選び、選択結果を入力フォームへ伝えます。

import { useState } from "react";
import type { Category } from "../categories";

type ExpenseCategoryPickerProps = {
  majorCategories: Category[];
  minorCategories: Category[];
  majorCategoryId: string;
  minorCategoryId: string;
  onChange: (majorCategoryId: string, minorCategoryId: string) => void;
};

function ExpenseCategoryPicker({
  majorCategories,
  minorCategories,
  majorCategoryId,
  minorCategoryId,
  onChange,
}: ExpenseCategoryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"major" | "minor">("major");
  const [pendingMajorId, setPendingMajorId] = useState("");

  const selectedMajor = majorCategories.find((category) => category.id === majorCategoryId);
  const selectedMinor = minorCategories.find((category) => category.id === minorCategoryId);
  const pendingMajor = majorCategories.find((category) => category.id === pendingMajorId);
  const visibleMinorCategories = minorCategories.filter(
    (category) => category.parentId === pendingMajorId,
  );

  function openPicker() {
    setPendingMajorId("");
    setStep("major");
    setIsOpen(true);
  }

  function closePicker() {
    setIsOpen(false);
    setStep("major");
    setPendingMajorId("");
  }

  return (
    <>
      <button
        type="button"
        className="entry-category-trigger"
        aria-haspopup="dialog"
        onClick={openPicker}
      >
        <span>{selectedMajor && selectedMinor
          ? `${selectedMajor.name} / ${selectedMinor.name}`
          : "選択してください"}</span>
        <span aria-hidden="true">⌄</span>
      </button>

      {isOpen && (
        <div className="category-picker-backdrop" onClick={closePicker}>
          <section
            className="category-picker"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-picker-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="category-picker-header">
              {step === "minor" ? (
                <button type="button" onClick={() => setStep("major")}>‹ 戻る</button>
              ) : <span />}
              <h3 id="category-picker-title">
                {step === "major" ? "大カテゴリを選択" : `${pendingMajor?.name ?? ""}の小カテゴリ`}
              </h3>
              <button type="button" aria-label="カテゴリ選択を閉じる" onClick={closePicker}>×</button>
            </div>

            <div className="category-picker-options">
              {step === "major"
                ? majorCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setPendingMajorId(category.id);
                      setStep("minor");
                    }}
                  >
                    {category.name}
                  </button>
                ))
                : visibleMinorCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      onChange(pendingMajorId, category.id);
                      closePicker();
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

export default ExpenseCategoryPicker;
