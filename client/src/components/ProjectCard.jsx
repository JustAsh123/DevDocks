import { useState, useEffect, memo } from "react";
import axios from "axios";
import InviteMemberModal from "../modals/InviteMemberModal";
import { useAuth } from "../context/AuthContext";
// prop onInvite: called when "+ Invite" button is clicked
function ProjectCard({ project, onInvite }) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const formattedDate = new Date(project.created_at).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  const [members, setMembers] = useState([]);

  useEffect(() => {
    console.log(project);
    const getMembers = async () => {
      const res = await axios.get(
        `http://localhost:3000/projects/members/${project.id}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        },
      );
      console.log(res.data.members);
      setMembers(res.data.members);
    };
    getMembers();
  }, []);

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

      <div className="flex items-center gap-1.5 flex-wrap">
        {members.map((member, i) => (
          <span
            key={i}
            className="px-2.5 py-1 bg-[#222] border border-[#2e2e2e] text-[#aaa] text-xs rounded-full"
          >
            {member.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default memo(ProjectCard);
