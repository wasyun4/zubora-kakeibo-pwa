// 【月間収支アイコン】
// 収入・支出・貯金・残額を表す線画アイコンを表示します。

type SummaryIconProps = {
  type: "income" | "expense" | "scheduled" | "savings" | "balance";
};

function SummaryIcon({ type }: SummaryIconProps) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (type === "income") {
    return (
      <svg {...commonProps}>
        <path d="M4 6.5h13.5A2.5 2.5 0 0 1 20 9v8.5H6A2 2 0 0 1 4 15.5z" />
        <path d="M4 7V5.5A1.5 1.5 0 0 1 5.5 4H17v2.5" />
        <path d="M15 10h5v4h-5a2 2 0 0 1 0-4Z" />
        <circle cx="15.5" cy="12" r=".45" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "expense") {
    return (
      <svg {...commonProps}>
        <path d="M12 4v15" />
        <path d="m6.5 13.5 5.5 5.5 5.5-5.5" />
      </svg>
    );
  }

  if (type === "savings") {
    return (
      <svg {...commonProps}>
        <path d="M5.5 10.5A6.8 6.8 0 0 1 12 6h2.5a5.5 5.5 0 0 1 5.3 4H22v4h-2.2a6.2 6.2 0 0 1-2.3 3l.5 2.5h-3L14.3 18H9.7L9 19.5H6L6.6 17A6.2 6.2 0 0 1 4 12.5H2.5v-2H5.5Z" />
        <path d="M11 6c.7-1.2 2.2-1.8 3.5-1.4" />
        <circle cx="16.5" cy="10" r=".55" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "scheduled") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <ellipse cx="9" cy="8" rx="5" ry="2.5" />
      <path d="M4 8v3c0 1.4 2.2 2.5 5 2.5 1.1 0 2.1-.2 3-.5" />
      <path d="M4 11v3c0 1.4 2.2 2.5 5 2.5 1 0 1.9-.1 2.7-.4" />
      <ellipse cx="15.5" cy="13" rx="4.5" ry="2.3" />
      <path d="M11 13v3c0 1.3 2 2.3 4.5 2.3S20 17.3 20 16v-3" />
    </svg>
  );
}

export default SummaryIcon;
