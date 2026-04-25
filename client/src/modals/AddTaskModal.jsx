import { useState } from "react";
import { addTask } from "../api/tasks";

const PRIORITIES = ["low", "medium", "high"];

export default function AddTaskModal({ projectId, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");
    setLoading(true);
    setError("");
    try {
      const res = await addTask(projectId, title.trim(), description.trim(), priority);
      onAdd(res.data.task);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-scaleIn bg-[#141414] border border-[#2a2a2a] rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">New Task</h2>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-[#666] mb-1.5 block">Title *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-[#444] transition-colors placeholder:text-[#444]"
            />
          </div>

          <div>
            <label className="text-xs text-[#666] mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details..."
              rows={3}
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-[#444] transition-colors placeholder:text-[#444] resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#666] mb-1.5 block">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                    priority === p
                      ? p === "high"
                        ? "bg-red-500/20 border-red-500/50 text-red-400"
                        : p === "medium"
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                        : "bg-[#2a2a2a] border-[#444] text-[#aaa]"
                      : "bg-transparent border-[#222] text-[#555] hover:border-[#333]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-lg hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
