// 【画面下部メニュー】
// ホーム・記録・予算・分析・設定の画面切り替えをApp.tsxへ伝える部品です。

import type { AppView } from "../types";

type BottomNavigationProps = {
    activeView: AppView;
    onViewChange: (view: AppView) => void;
};

function BottomNavigation({
    activeView,
    onViewChange,
}: BottomNavigationProps) {
    return (
        <nav
            className="bottom-navigation"
            aria-label="メインメニュー"
        >
            <button
                type="button"
                className={activeView === "home" ? "active" : ""}
                onClick={() => onViewChange("home")}
            >
                <span>⌂</span>
                ホーム
            </button>

            <button
                type="button"
                className={activeView === "records" ? "active" : ""}
                onClick={() => onViewChange("records")}
            >
                <span>✎</span>
                記録
            </button>

            <button
                type="button"
                className={activeView === "budget" ? "active" : ""}
                onClick={() => onViewChange("budget")}
            >
                <span>￥</span>
                予算
            </button>

            <button
                type="button"
                className={activeView === "analysis" ? "active" : ""}
                onClick={() => onViewChange("analysis")}
            >
                <span>▥</span>
                分析
            </button>

            <button
                type="button"
                className={activeView === "settings" ? "active" : ""}
                onClick={() => onViewChange("settings")}
            >
                <span>⚙</span>
                設定
            </button>
        </nav>
    );
}

export default BottomNavigation;