export type Category = {
    id: string;
    type: "income" | "expense";
    name: string;
    parentId: string | null;
    isActive: boolean;
};

export const initialCategories: Category[] = [

    // 収入　大カテゴリ
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

    // 支出　大カテゴリ
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

    // 固定費 小カテゴリ
    {
        id: "housing",
        type: "expense",
        name: "住居",
        parentId: "fixedCost",
        isActive: true,
    },
    {
        id: "mobilePhone",
        type: "expense",
        name: "スマホ",
        parentId: "fixedCost",
        isActive: true,
    },
    {
        id: "internet",
        type: "expense",
        name: "インターネット",
        parentId: "fixedCost",
        isActive: true,
    },
    {
        id: "gas",
        type: "expense",
        name: "ガス",
        parentId: "fixedCost",
        isActive: true,
    },
    {
        id: "electricity",
        type: "expense",
        name: "電気",
        parentId: "fixedCost",
        isActive: true,
    },
    {
        id: "subscription",
        type: "expense",
        name: "サブスク",
        parentId: "fixedCost",
        isActive: true,
    },

    // 食費 小カテゴリ
    {
        id: "groceries",
        type: "expense",
        name: "食料品",
        parentId: "food",
        isActive: true,
    },
    {
        id: "diningOut",
        type: "expense",
        name: "外食",
        parentId: "food",
        isActive: true,
    },
    {
        id: "drinking",
        type: "expense",
        name: "飲酒!!!",
        parentId: "food",
        isActive: true,
    },
    {
        id: "convenienceMeal",
        type: "expense",
        name: "コンビニ飯",
        parentId: "food",
        isActive: true,
    },
    {
        id: "beverages",
        type: "expense",
        name: "飲料",
        parentId: "food",
        isActive: true,
    },

    // 日用品 小カテゴリ
    {
        id: "consumables",
        type: "expense",
        name: "消耗品",
        parentId: "dailyNecessities",
        isActive: true,
    },
    {
        id: "hygiene",
        type: "expense",
        name: "衛生用品",
        parentId: "dailyNecessities",
        isActive: true,
    },
    {
        id: "clothing",
        type: "expense",
        name: "衣類",
        parentId: "dailyNecessities",
        isActive: true,
    },
    {
        id: "tobacco",
        type: "expense",
        name: "ヤニ",
        parentId: "dailyNecessities",
        isActive: true,
    },
    {
        id: "dailyNecessitiesOther",
        type: "expense",
        name: "その他",
        parentId: "dailyNecessities",
        isActive: true,
    },
];