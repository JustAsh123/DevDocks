import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectMembers } from "../api/projects";
import InviteMemberModal from "../modals/InviteMemberModal";
import { useAuth } from "../context/AuthContext";
// prop onInvite: called when "+ Invite" button is clicked
function ProjectCard({ project, onInvite }) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const formattedDate = new Date(project.created_at).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await getProjectMembers(project.id);
        const { success, members } = res.data;
        if (success) {
          setMembers(members);
        }
      } catch (err) {
        console.error("Failed to load members", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [project.id]);

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a] transition-colors">
      {showModal && (
        <InviteMemberModal
          project={project}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-base font-semibold text-white">{project.name}</h3>
        {user.id === project.owner_id && (
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-[#555] hover:text-white transition-colors ml-3 shrink-0 border border-[#2a2a2a] px-2 py-0.5 rounded"
          >
            + Invite
          </button>
        )}
      </div>
      <p className="text-xs text-[#555] mb-4">Created {formattedDate}</p>

      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        {members.map((member, i) => (
          <span
            key={i}
            className="px-2.5 py-1 bg-[#222] border border-[#2e2e2e] text-[#aaa] text-xs rounded-full"
          >
            {member.name}
          </span>
        ))}
      </div>

      <button
        onClick={() => navigate(`/project/${project.id}`)}
        className="w-full text-center py-2 rounded-lg border border-[#2a2a2a] text-xs text-[#555] hover:border-[#444] hover:text-[#aaa] transition-all"
      >
        Open Board →
      </button>
    </div>
  );
}

export default memo(ProjectCard);
