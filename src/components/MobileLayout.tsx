// 【スマホ用レイアウト】
// スマホ画面全体の配置を担当する部品です。

import type { ReactNode } from "react";
import MonthFilter from "./MonthFilter";

type MobileLayoutProps = {
    children: ReactNode;
    selectedMonth: string;
    monthStartDay: string;
    onMonthChange: (month: string) => void;
};

function MobileLayout({
    children,
    selectedMonth,
    monthStartDay,
    onMonthChange,
}: MobileLayoutProps) {
    return (
        <main className="mobile-layout">
            <h1 className="visually-hidden">家計簿アプリ</h1>
            <MonthFilter
                selectedMonth={selectedMonth}
                monthStartDay={monthStartDay}
                onMonthChange={onMonthChange}
            />
            {children}
        </main>
    );
}

export default MobileLayout;