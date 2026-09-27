// 【画面下部メニュー】
// ホーム・記録・予算・分析・設定の画面切り替えをApp.tsxへ伝える部品です。

import type { AppView } from "../types";
import BottomNavigationIcon from "./BottomNavigationIcon";

type BottomNavigationProps = {
    activeView: AppView;
    onViewChange: (view: AppView) => void;
};

function BottomNavigation({
    activeView,
    onViewChange,
}: BottomNavigationProps) {
    const items: { view: AppView; label: string }[] = [
        { view: "home", label: "ホーム" },
        { view: "records", label: "記録" },
        { view: "budget", label: "予算" },
        { view: "analysis", label: "分析" },
        { view: "settings", label: "設定" },
    ];

    return (
        <nav
            className="bottom-navigation"
            aria-label="メインメニュー"
        >
            {items.map((item) => (
                <button
                    key={item.view}
                    type="button"
                    className={activeView === item.view ? "active" : ""}
                    onClick={() => onViewChange(item.view)}
                >
                    <span className="bottom-navigation-icon">
                        <BottomNavigationIcon view={item.view} />
                    </span>
                    {item.label}
                </button>
            ))}
        </nav>
    );
}

export default BottomNavigation;
