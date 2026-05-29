import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const STAGES = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const DEFAULT = {
  title: "",
  description: "",
  stage: "todo",
  priority: "medium",
};

export default function TaskModal({ open, onClose, onSave, task }) {
  const [form, setForm] = useState(DEFAULT);
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(task);

  useEffect(() => {
    setForm(
      task
        ? {
            title: task.title,
            description: task.description,
            stage: task.stage,
            priority: task.priority,
          }
        : DEFAULT,
    );
  }, [task, open]);

  if (!open) return null;

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    setLoading(true);
    try {
      const { data } = isEditing
        ? await api.put(`/tasks/${task._id}`, form)
        : await api.post("/tasks", form);
      onSave(data);
      toast.success(isEditing ? "Task updated" : "Task created");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold text-white">
            {isEditing ? "Edit task" : "New task"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Title
            </label>
            <input
              name="title"
              required
              value={form.title}
              onChange={handle}
              placeholder="What needs to be done?"
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              placeholder="Add more detail... (optional)"
              rows={3}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Stage
              </label>
              <select
                name="stage"
                value={form.stage}
                onChange={handle}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
              >
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handle}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-muted hover:bg-zinc-700 text-zinc-300 text-sm font-medium py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-medium py-3 rounded-xl transition-colors"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
