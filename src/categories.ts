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

    // 家具・家電 小カテゴリ
    {
        id: "furniture",
        type: "expense",
        name: "家具",
        parentId: "furnitureAppliances",
        isActive: true,
    },
    {
        id: "appliances",
        type: "expense",
        name: "家電",
        parentId: "furnitureAppliances",
        isActive: true,
    },
    {
        id: "cookingUtensils",
        type: "expense",
        name: "調理器具",
        parentId: "furnitureAppliances",
        isActive: true,
    },
    {
        id: "computerEquipment",
        type: "expense",
        name: "PC・周辺機器",
        parentId: "furnitureAppliances",
        isActive: true,
    },
    {
        id: "furnitureAppliancesOther",
        type: "expense",
        name: "その他",
        parentId: "furnitureAppliances",
        isActive: true,
    },

    // 交通費 小カテゴリ
    {
        id: "publicTransportation",
        type: "expense",
        name: "電車・バス",
        parentId: "transportation",
        isActive: true,
    },
    {
        id: "taxi",
        type: "expense",
        name: "タクシー",
        parentId: "transportation",
        isActive: true,
    },
    {
        id: "gasoline",
        type: "expense",
        name: "ガソリン",
        parentId: "transportation",
        isActive: true,
    },
    {
        id: "rentalCar",
        type: "expense",
        name: "レンタカー",
        parentId: "transportation",
        isActive: true,
    },
    {
        id: "parking",
        type: "expense",
        name: "駐車・駐輪",
        parentId: "transportation",
        isActive: true,
    },
    {
        id: "transportationOther",
        type: "expense",
        name: "その他",
        parentId: "transportation",
        isActive: true,
    },

    // 医療費 小カテゴリ
    {
        id: "hospital",
        type: "expense",
        name: "病院",
        parentId: "medical",
        isActive: true,
    },
    {
        id: "medicine",
        type: "expense",
        name: "薬",
        parentId: "medical",
        isActive: true,
    },
    {
        id: "medicalOther",
        type: "expense",
        name: "その他",
        parentId: "medical",
        isActive: true,
    },

    // 娯楽 小カテゴリ
    {
        id: "motorcycle",
        type: "expense",
        name: "バイク",
        parentId: "entertainment",
        isActive: true,
    },
    {
        id: "darts",
        type: "expense",
        name: "ダーツ",
        parentId: "entertainment",
        isActive: true,
    },
    {
        id: "games",
        type: "expense",
        name: "ゲーム",
        parentId: "entertainment",
        isActive: true,
    },
    {
        id: "bass",
        type: "expense",
        name: "ベース",
        parentId: "entertainment",
        isActive: true,
    },
    {
        id: "showaCollectibles",
        type: "expense",
        name: "昭和の要らんもの",
        parentId: "entertainment",
        isActive: true,
    },
    {
        id: "universityCosts",
        type: "expense",
        name: "大学費用",
        parentId: "entertainment",
        isActive: true,
    },
    {
        id: "entertainmentOther",
        type: "expense",
        name: "その他",
        parentId: "entertainment",
        isActive: true,
    },

    // その他 小カテゴリ
    {
        id: "gift",
        type: "expense",
        name: "プレゼント",
        parentId: "expenseOther",
        isActive: true,
    },
    {
        id: "ceremonialOccasions",
        type: "expense",
        name: "冠婚葬祭",
        parentId: "expenseOther",
        isActive: true,
    },
    {
        id: "fees",
        type: "expense",
        name: "手数料",
        parentId: "expenseOther",
        isActive: true,
    },
    {
        id: "unknownExpense",
        type: "expense",
        name: "不明",
        parentId: "expenseOther",
        isActive: true,
    },
    {
        id: "uncategorizedExpense",
        type: "expense",
        name: "その他",
        parentId: "expenseOther",
        isActive: true,
    },

    // 貯金 小カテゴリ
    {
        id: "regularSavings",
        type: "expense",
        name: "通常貯金",
        parentId: "savings",
        isActive: true,
    },
    {
        id: "goalSavings",
        type: "expense",
        name: "目的貯金",
        parentId: "savings",
        isActive: true,
    },
    {
        id: "investment",
        type: "expense",
        name: "投資",
        parentId: "savings",
        isActive: true,
    },
    {
        id: "savingsOther",
        type: "expense",
        name: "その他",
        parentId: "savings",
        isActive: true,
    },
];