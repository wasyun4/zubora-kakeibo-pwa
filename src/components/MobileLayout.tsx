// 【スマホ用レイアウト】
// スマホ画面全体の配置を担当する部品です。

import type { ReactNode } from "react";

type MobileLayoutProps = {
    children: ReactNode;
};

function MobileLayout({ children }: MobileLayoutProps) {
    return <main className="mobile-layout">{children}</main>;
}

export default MobileLayout;