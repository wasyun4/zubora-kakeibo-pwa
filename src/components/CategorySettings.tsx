// 【カテゴリ設定】
// 収入・支出カテゴリの追加、名前変更、表示切り替えを行います。

import { useState } from "react";
import type { Category } from "../categories";
import {
  addCategory,
  renameCategory,
  toggleCategoryActive,
} from "../utils/categoryManagement";
import { createId } from "../utils/createId";

type CategoryKind = "income" | "expenseMajor" | "expenseMinor";

type CategorySettingsProps = {
  categories: Category[];
  onChange: (categories: Category[]) => void;
};

function CategorySettings({ categories, onChange }: CategorySettingsProps) {
  const [kind, setKind] = useState<CategoryKind>("expenseMinor");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const incomeCategories = categories.filter(
    (category) => category.type === "income" && category.parentId === null,
  );
  const expenseMajorCategories = categories.filter(
    (category) => category.type === "expense" && category.parentId === null,
  );

  function handleAdd() {
    try {
      const type = kind === "income" ? "income" : "expense";
      const nextParentId = kind === "expenseMinor" ? parentId : null;
      onChange(addCategory(categories, { type, name, parentId: nextParentId }, createId()));
      setName("");
      alert("カテゴリを追加しました！");
    } catch (error) {
      alert(error instanceof Error ? error.message : "カテゴリを追加できませんでした。");
    }
  }

  function startRename(category: Category) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  function saveRename() {
    if (!editingId) return;
    try {
      onChange(renameCategory(categories, editingId, editingName));
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "名前を変更できませんでした。");
    }
  }

  function renderCategory(category: Category) {
    return (
      <li key={category.id} className={!category.isActive ? "category-setting-inactive" : ""}>
        {editingId === category.id ? (
          <div className="category-setting-edit">
            <input
              aria-label={`${category.name}の新しい名前`}
              value={editingName}
              onChange={(event) => setEditingName(event.target.value)}
            />
            <button type="button" onClick={saveRename}>保存</button>
            <button type="button" className="secondary-button" onClick={() => setEditingId(null)}>取消</button>
          </div>
        ) : (
          <div className="category-setting-row">
            <span>{category.name}</span>
            <button type="button" className="secondary-button" onClick={() => startRename(category)}>名前変更</button>
            <button type="button" className="secondary-button" onClick={() => onChange(toggleCategoryActive(categories, category.id))}>
              {category.isActive ? "非表示" : "表示する"}
            </button>
          </div>
        )}
      </li>
    );
  }

  return (
    <section>
      <h2>カテゴリ設定</h2>
      <p className="settings-note">非表示にしても、過去の履歴からは消えません。</p>

      <div className="category-setting-add">
        <label>
          追加する種類
          <select value={kind} onChange={(event) => setKind(event.target.value as CategoryKind)}>
            <option value="income">収入カテゴリ</option>
            <option value="expenseMajor">支出の大カテゴリ</option>
            <option value="expenseMinor">支出の小カテゴリ</option>
          </select>
        </label>
        {kind === "expenseMinor" && (
          <label>
            親になる大カテゴリ
            <select value={parentId} onChange={(event) => setParentId(event.target.value)}>
              <option value="">選択してください</option>
              {expenseMajorCategories.filter((category) => category.isActive).map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
        )}
        <label>
          新しいカテゴリ名
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="例：美容" />
        </label>
        <button type="button" onClick={handleAdd}>カテゴリを追加</button>
      </div>

      <details>
        <summary>収入カテゴリ（{incomeCategories.length}件）</summary>
        <ul className="category-setting-list">{incomeCategories.map(renderCategory)}</ul>
      </details>
      {expenseMajorCategories.map((major) => (
        <details key={major.id}>
          <summary>{major.name}（小カテゴリ {categories.filter((item) => item.parentId === major.id).length}件）</summary>
          <ul className="category-setting-list">
            {renderCategory(major)}
            {categories.filter((item) => item.parentId === major.id).map(renderCategory)}
          </ul>
        </details>
      ))}
    </section>
  );
}

export default CategorySettings;
