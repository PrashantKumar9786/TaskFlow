import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

const COLUMNS = [
  { id: "todo", label: "To Do", color: "#6366f1", dot: "bg-[#6B7280]" },
  {
    id: "in-progress",
    label: "In Progress",
    color: "#f59e0b",
    dot: "bg-[#3B82F6]",
  },
  { id: "done", label: "Done", color: "#22c55e", dot: "bg-green-500" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openCreate = () => {
    setEditTask(null);
    setModalOpen(true);
  };
  const openEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleSave = (saved) => {
    setTasks((prev) =>
      editTask
        ? prev.map((t) => (t._id === saved._id ? saved : t))
        : [saved, ...prev],
    );
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination || source.droppableId === destination.droppableId) return;

    const newStage = destination.droppableId;
    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, stage: newStage } : t)),
    );

    try {
      await api.put(`/tasks/${draggableId}`, { stage: newStage });
    } catch {
      toast.error("Failed to update stage");
      fetchTasks();
    }
  };

  const tasksByStage = (stage) => tasks.filter((t) => t.stage === stage);

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.stage === "done").length,
    high: tasks.filter((t) => t.priority === "high" && t.stage !== "done")
      .length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000]">
      {/* Navbar */}
      <header className="border-b border-border bg-[#000000] backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" />
                <rect
                  x="9"
                  y="1"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  opacity="0.5"
                />
                <rect
                  x="1"
                  y="9"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  opacity="0.5"
                />
                <rect
                  x="9"
                  y="9"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="white"
                  opacity="0.25"
                />
              </svg>
            </div> */}
            <div>
              <img src="/Task.png" alt="Task Manager" className="w-15 h-15" />
            </div>
            <span className="font-sans font-semibold tracking-tight">
              Task Manager - Stay On Track
            </span>

            {/* Stats pills */}
            <div className="hidden sm:flex items-center gap-2 ml-4">
              <span className="text-md bg-blue-500/18 px-2.5 py-1 rounded-full text-blue-400 border border-blue-400">
                {stats.total} tasks
              </span>
              <span className="text-md bg-green-500/18 text-green-400 px-2.5 py-1 rounded-full border border-green-400">
                {stats.done} done
              </span>
              {stats.high > 0 && (
                <span className="text-xs bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full">
                  {stats.high} urgent
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-[#ffffff] hover:bg-[#aaaaaa] text-black text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1v12M1 7h12"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="hidden sm:inline">New task</span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-md font-medium text-[#ffffff]">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm text-zinc-400">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="text-md text-[#ffffff] hover:text-[#aaaaaa] transition-colors ml-1"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {COLUMNS.map((col) => {
                const colTasks = tasksByStage(col.id);
                return (
                  <div key={col.id} className="flex flex-col">
                    {/* Column header */}
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className={`w-3 h-3 rounded-full ${col.dot}`} />
                      <span className="text-md font-medium text-[#ffffff]">
                        {col.label}
                      </span>
                      <span className="ml-auto text-xs font-mono text-white bg-black px-2 py-0.5 rounded-full border border-[#ffffff]">
                        {colTasks.length}
                      </span>
                    </div>

                    {/* Drop zone */}
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 min-h-[200px] rounded-2xl border border-border p-3 space-y-3 transition-all duration-200 ${
                            snapshot.isDraggingOver
                              ? "drag-over"
                              : "bg-surface/40"
                          }`}
                        >
                          {colTasks.length === 0 &&
                            !snapshot.isDraggingOver && (
                              <div className="flex flex-col items-center justify-center h-32 text-zinc-700 text-md">
                                <span className="text-2xl mb-2">....</span>
                                Drop tasks here
                              </div>
                            )}

                          {colTasks.map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(prov, snap) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  className={`transition-transform ${snap.isDragging ? "rotate-1 scale-105" : ""}`}
                                >
                                  <TaskCard
                                    task={task}
                                    onEdit={() => openEdit(task)}
                                    onDelete={() => handleDelete(task._id)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {/* Add task inline shortcut */}
                    <button
                      onClick={openCreate}
                      className="mt-3 flex items-center gap-2 text-md text-zinc-700 hover:text-[#ffffff] transition-colors py-1"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M6 1v10M1 6h10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Add task
                    </button>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </main>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        task={editTask}
      />
    </div>
  );
}
