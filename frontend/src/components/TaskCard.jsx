const PRIORITY_CONFIG = {
  high: {
    label: "High",
    classes: "bg-red-500/10 text-red-400",
    bar: "bg-red-500",
  },
  medium: {
    label: "Medium",
    classes: "bg-amber-500/10 text-amber-400",
    bar: "bg-amber-400",
  },
  low: {
    label: "Low",
    classes: "bg-zinc-700/60 text-zinc-500",
    bar: "bg-zinc-600",
  },
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const date = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group bg-surface border border-border hover:border-zinc-700 rounded-xl p-4 animate-card-in transition-all duration-150 cursor-grab active:cursor-grabbing">
      {/* Priority bar */}
      <div
        className={`h-0.5 w-8 rounded-full ${p.bar} mb-3 transition-all group-hover:w-12`}
      />

      <p className="text-sm text-white font-medium leading-snug mb-1">
        {task.title}
      </p>

      {task.description && (
        <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.classes}`}
        >
          {p.label}
        </span>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-700 font-mono">{date}</span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-muted text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M8.5 1.5l2 2-6 6H2.5v-2l6-6z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 3h8M5 3V2h2v1M4.5 5v4M7.5 5v4M3 3l.5 6h5L9 3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
