import { useState, useEffect } from "react";
import { updateTask, deleteTask, updateTaskStatus, assignTask, unassignTask } from "../api/tasks";
import { getProjectMembers } from "../api/projects";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["backlog", "todo", "in_progress", "done"];
const PRIORITIES = ["low", "medium", "high"];

const statusLabel = { backlog: "Backlog", todo: "Todo", in_progress: "In Progress", done: "Done" };
const priorityColor = {
  low: "text-[#888] bg-[#1e1e1e] border-[#2a2a2a]",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  high: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function TaskDetailModal({ task, projectId, onClose, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority || "medium");
  const [members, setMembers] = useState([]);
  const [assigneeId, setAssigneeId] = useState(task.assigned_to || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProjectMembers(projectId)
      .then((res) => setMembers(res.data.members || []))
      .catch(() => {});
  }, [projectId]);

  const handleSave = async () => {
    if (!title.trim()) return setError("Title is required");
    setSaving(true);
    setError("");
    try {
      // Update title/description
      await updateTask(projectId, task.id, title.trim(), description.trim());
      // Update status if changed
      if (status !== task.status) await updateTaskStatus(projectId, task.id, status);
      // Update assignment if changed
      if (assigneeId && assigneeId !== task.assigned_to) {
        await assignTask(projectId, task.id, assigneeId);
      } else if (!assigneeId && task.assigned_to) {
        await unassignTask(projectId, task.id);
      }
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(projectId, task.id);
      onDelete(task.id);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete");
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-scaleIn bg-[#141414] border border-[#2a2a2a] rounded-t-2xl sm:rounded-2xl w-full max-w-lg mx-0 sm:mx-4 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${priorityColor[priority]}`}>
              {priority}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-red-400/70 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <button onClick={onClose} className="text-[#555] hover:text-white transition-colors text-xl leading-none">×</button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-white text-lg font-semibold outline-none border-b border-[#2a2a2a] pb-2 focus:border-[#444] transition-colors"
          />

          {/* Description */}
          <div>
            <label className="text-xs text-[#555] mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="No description..."
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#ccc] text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-[#444] transition-colors placeholder:text-[#444] resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-xs text-[#555] mb-1.5 block">Status</label>
            <div className="grid grid-cols-4 gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium capitalize border transition-all ${
                    status === s
                      ? s === "done"
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : s === "in_progress"
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                        : s === "todo"
                        ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                        : "bg-[#2a2a2a] border-[#444] text-[#aaa]"
                      : "bg-transparent border-[#222] text-[#555] hover:border-[#333] hover:text-[#777]"
                  }`}
                >
                  {statusLabel[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs text-[#555] mb-1.5 block">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium capitalize border transition-all ${
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

          {/* Assignee */}
          <div>
            <label className="text-xs text-[#555] mb-1.5 block">Assigned to</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#ccc] text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-[#444] transition-colors"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-lg hover:bg-[#e0e0e0] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
