// 【下部メニューアイコン】
// 各画面を表す線画アイコンを表示します。

import type { AppView } from "../types";

type BottomNavigationIconProps = {
  view: AppView;
};

function BottomNavigationIcon({ view }: BottomNavigationIconProps) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (view === "home") {
    return (
      <svg {...commonProps}>
        <path d="m3.5 10 8.5-7 8.5 7" />
        <path d="M5.5 9v11h13V9" />
        <path d="M9.5 20v-6h5v6" />
      </svg>
    );
  }

  if (view === "records") {
    return (
      <svg {...commonProps}>
        <path d="m4 20 4.2-1 10.7-10.7a2.1 2.1 0 0 0-3-3L5.2 16Z" />
        <path d="m14.5 6.7 3 3" />
        <path d="M4 20h6" />
      </svg>
    );
  }

  if (view === "budget") {
    return (
      <svg {...commonProps}>
        <path d="M11 3a9 9 0 1 0 9 9h-9Z" />
        <path d="M14 3.5A7.5 7.5 0 0 1 20.5 10H14Z" />
      </svg>
    );
  }

  if (view === "analysis") {
    return (
      <svg {...commonProps}>
        <path d="M4 20V11h4v9" />
        <path d="M10 20V4h4v16" />
        <path d="M16 20v-6h4v6" />
        <path d="M2.5 20.5h19" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.8v2M12 19.2v2M21.2 12h-2M4.8 12h-2M18.5 5.5 17 7M7 17l-1.5 1.5M18.5 18.5 17 17M7 7 5.5 5.5" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

export default BottomNavigationIcon;
