export type Category = {
    id: string;
    type: "income" | "expense";
    name: string;
    parentId: string | null;
    isActive: boolean;
};

export const initialCategories: Category[] = [
    {
        id: "salary",
        type: "income",
        name: "給与",
        parentId: null,
        isActive: true,
    },
    {
        id: "bonus",
        type: "income",
        name: "ボーナス",
        parentId: null,
        isActive: true,
    },
    {
        id: "temporaryIncome",
        type: "income",
        name: "臨時収入",
        parentId: null,
        isActive: true,
    },
    {
        id: "incomeOther",
        type: "income",
        name: "その他",
        parentId: null,
        isActive: true,
    },
    {
        id: "fixedCost",
        type: "expense",
        name: "固定費",
        parentId: null,
        isActive: true,
    },
    {
        id: "food",
        type: "expense",
        name: "食費",
        parentId: null,
        isActive: true,
    },
    {
        id: "dailyNecessities",
        type: "expense",
        name: "日用品",
        parentId: null,
        isActive: true,
    },
    {
        id: "furnitureAppliances",
        type: "expense",
        name: "家具・家電",
        parentId: null,
        isActive: true,
    },
    {
        id: "transportation",
        type: "expense",
        name: "交通費",
        parentId: null,
        isActive: true,
    },
    {
        id: "medical",
        type: "expense",
        name: "医療費",
        parentId: null,
        isActive: true,
    },
    {
        id: "entertainment",
        type: "expense",
        name: "娯楽",
        parentId: null,
        isActive: true,
    },
    {
        id: "expenseOther",
        type: "expense",
        name: "その他",
        parentId: null,
        isActive: true,
    },
    {
        id: "savings",
        type: "expense",
        name: "貯金",
        parentId: null,
        isActive: true,
    },
];