import type { Category } from "../categories";

export type NewCategory = Pick<Category, "type" | "name" | "parentId">;

function normalizeName(name: string) {
  return name.trim();
}

function hasDuplicateName(
  categories: Category[],
  name: string,
  type: Category["type"],
  parentId: string | null,
  ignoredId?: string,
) {
  return categories.some(
    (category) =>
      category.id !== ignoredId &&
      category.type === type &&
      category.parentId === parentId &&
      category.name === name,
  );
}

export function addCategory(
  categories: Category[],
  category: NewCategory,
  id: string,
) {
  const name = normalizeName(category.name);

  if (!name) throw new Error("カテゴリ名を入力してください。");
  if (categories.some((item) => item.id === id)) {
    throw new Error("カテゴリIDが重複しています。");
  }
  if (category.type === "income" && category.parentId !== null) {
    throw new Error("収入カテゴリに小カテゴリは追加できません。");
  }
  if (category.parentId !== null) {
    const parent = categories.find((item) => item.id === category.parentId);
    if (!parent || parent.type !== "expense" || parent.parentId !== null) {
      throw new Error("支出の大カテゴリを選択してください。");
    }
  }
  if (hasDuplicateName(categories, name, category.type, category.parentId)) {
    throw new Error("同じ場所に同名のカテゴリがあります。");
  }

  return [
    ...categories,
    { ...category, id, name, isActive: true },
  ];
}

export function renameCategory(
  categories: Category[],
  id: string,
  newName: string,
) {
  const current = categories.find((category) => category.id === id);
  const name = normalizeName(newName);

  if (!current) throw new Error("カテゴリが見つかりません。");
  if (!name) throw new Error("カテゴリ名を入力してください。");
  if (hasDuplicateName(categories, name, current.type, current.parentId, id)) {
    throw new Error("同じ場所に同名のカテゴリがあります。");
  }

  return categories.map((category) =>
    category.id === id ? { ...category, name } : category,
  );
}

export function toggleCategoryActive(categories: Category[], id: string) {
  if (!categories.some((category) => category.id === id)) {
    throw new Error("カテゴリが見つかりません。");
  }

  return categories.map((category) =>
    category.id === id
      ? { ...category, isActive: !category.isActive }
      : category,
  );
}

export function isCategoryArray(value: unknown): value is Category[] {
  return Array.isArray(value) && value.every(
    (category) =>
      category !== null &&
      typeof category === "object" &&
      typeof category.id === "string" &&
      (category.type === "income" || category.type === "expense") &&
      typeof category.name === "string" &&
      (category.parentId === null || typeof category.parentId === "string") &&
      typeof category.isActive === "boolean",
  );
}
