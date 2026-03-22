"use client";

const SORT_OPTIONS = [
  { key: "best_match", label: "Best match" },
  { key: "highest_roi", label: "Highest ROI" },
  { key: "fastest", label: "Fastest path" },
  { key: "lowest_cost", label: "Lowest cost" },
];

interface SortBarProps {
  activeSort: string;
  onSort: (key: string) => void;
}

export default function SortBar({ activeSort, onSort }: SortBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onSort(opt.key)}
          className={`px-4 py-1.5 rounded-full text-sm font-heading font-medium transition-all ${
            activeSort === opt.key
              ? "bg-primary text-white"
              : "bg-white border border-silver/50 text-charcoal hover:border-secondary"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
