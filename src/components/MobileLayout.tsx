// 【スマホ用レイアウト】
// スマホ画面全体の配置を担当する部品です。

import type { ReactNode } from "react";
import MonthFilter from "./MonthFilter";
import type { AppView } from "../types";
import BottomNavigation from "./BottomNavigation";

type MobileLayoutProps = {
    children: ReactNode;
    selectedMonth: string;
    monthStartDay: string;
    onMonthChange: (month: string) => void;
    activeView: AppView;
    onViewChange: (view: AppView) => void;
};

function MobileLayout({
    children,
    selectedMonth,
    monthStartDay,
    onMonthChange,
    activeView,
    onViewChange,
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

            <BottomNavigation
                activeView={activeView}
                onViewChange={onViewChange}
            />

        </main>
    );
}

export default MobileLayout;