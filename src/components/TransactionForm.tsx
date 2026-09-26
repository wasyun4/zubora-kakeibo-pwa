// 【収支入力フォーム】
// 収入・支出の入力欄を表示し、入力内容や登録操作をApp.tsxへ伝える部品です。

import type { Category } from "../categories";
import type { PaymentMethod } from "../paymentMethods";
import type { TransactionScope } from "../types";

type TransactionFormProps = {
    type: string;
    majorCategoryId: string;
    minorCategoryId: string;
    amount: string;
    memo: string;
    date: string;
    source: string;
    paymentMethodId: string;
    scope: TransactionScope;
    editingTransactionId: string | null;
    incomeCategories: Category[];
    expenseMajorCategories: Category[];
    expenseMinorCategories: Category[];
    paymentMethods: PaymentMethod[];
    onTypeChange: (value: string) => void;
    onMajorCategoryChange: (value: string) => void;
    onMinorCategoryChange: (value: string) => void;
    onAmountChange: (value: string) => void;
    onMemoChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onSourceChange: (value: string) => void;
    onPaymentMethodChange: (value: string) => void;
    onScopeChange: (value: TransactionScope) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

function TransactionForm(
    props: TransactionFormProps,
) {
    return (
        <section>
            <h2 id="transaction-form-title">{props.editingTransactionId === null ? "収支入力" : "収支の編集"}</h2>

            <label>
                種類
                <select
                    value={props.type}
                    onChange={(event) =>
                        props.onTypeChange(event.target.value)
                    }
                >
                    <option value="expense">支出</option>
                    <option value="income">収入</option>
                </select>
            </label>

            {props.type === "income" && (
                <label>
                    収入カテゴリ
                    <select
                        value={props.majorCategoryId}
                        onChange={(event) =>
                            props.onMajorCategoryChange(event.target.value)
                        }
                    >
                        <option value="">選択してください</option>

                        {props.incomeCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            {props.type === "expense" && (
                <label>
                    支出の大カテゴリ
                    <select
                        value={props.majorCategoryId}
                        onChange={(event) =>
                            props.onMajorCategoryChange(event.target.value)
                        }
                    >
                        <option value="">選択してください</option>

                        {props.expenseMajorCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            {props.type === "expense" &&
                props.majorCategoryId !== "" && (
                    <label>
                        支出の小カテゴリ
                        <select
                            value={props.minorCategoryId}
                            onChange={(event) =>
                                props.onMinorCategoryChange(event.target.value)
                            }
                        >
                            <option value="">選択してください</option>

                            {props.expenseMinorCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </label>
                )}

            <label>
                金額
                <input
                    type="number"
                    placeholder="例：1000"
                    value={props.amount}
                    onChange={(event) =>
                        props.onAmountChange(event.target.value)
                    }
                />
            </label>

            <label>
                メモ
                <input
                    type="text"
                    placeholder="例：昼ごはん"
                    value={props.memo}
                    onChange={(event) =>
                        props.onMemoChange(event.target.value)
                    }
                />
            </label>

            <label>
                日付
                <input
                    type="date"
                    value={props.date}
                    onChange={(event) =>
                        props.onDateChange(event.target.value)
                    }
                />
            </label>

            <label>
                店舗・収入元
                <input
                    type="text"
                    value={props.source}
                    onChange={(event) =>
                        props.onSourceChange(event.target.value)
                    }
                />
            </label>

            <label>
                支払方法
                <select
                    value={props.paymentMethodId}
                    onChange={(event) =>
                        props.onPaymentMethodChange(event.target.value)
                    }
                >
                    <option value="">選択してください</option>

                    {props.paymentMethods
                        .filter((paymentMethod) => paymentMethod.isActive)
                        .map((paymentMethod) => (
                            <option
                                key={paymentMethod.id}
                                value={paymentMethod.id}
                            >
                                {paymentMethod.name}
                            </option>
                        ))}
                </select>
            </label>

            <label>
                個人・共有
                <select
                    value={props.scope}
                    onChange={(event) =>
                        props.onScopeChange(
                            event.target.value as TransactionScope,
                        )
                    }
                >
                    <option value="personal">個人</option>
                    <option value="shared">共有</option>
                </select>
            </label>

            <button onClick={props.onSubmit}>
                {props.editingTransactionId === null
                    ? "収支を入力する"
                    : "収支を更新する"}
            </button>

            <button type="button"
                className="cancel-button"
                onClick={props.onCancel}
            >
                {props.editingTransactionId === null
                    ? "入力をやめる"
                    : "編集をやめる"}
            </button>
        </section>
    );
}
export default TransactionForm;
