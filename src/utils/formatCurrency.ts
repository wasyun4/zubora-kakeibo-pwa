// 【金額表示の共通処理】
// 数値や数字の文字列を、3桁区切りの日本円表示へ変換する関数です。

export function formatCurrency(value: number | string) {
    return `${Number(value).toLocaleString("ja-JP")}円`;
}