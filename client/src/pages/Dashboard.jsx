import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../modals/CreateProjectModal";
import InviteMemberModal from "../modals/InviteMemberModal";
import { getProjects } from "../api/projects";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [inviteTarget, setInviteTarget] = useState(null); // { id, title }

  // Load Projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };
    loadProjects();
  }, []);

  const handleCreate = (newProject) => {
    // Add new project to the list locally (optimistic update)
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-white">Projects</h1>
            <p className="text-sm text-[#555] mt-0.5">
              {projects?.length} project{projects?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-[#e0e0e0] transition-colors"
          >
            + New Project
          </button>
        </div>

        {projects?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects?.map((project) => (
              <ProjectCard key={project.id} project={project} inviter={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#444] text-sm">
            No projects yet. Create your first one.
          </div>
        )}
      </div>

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {inviteTarget && (
        <InviteMemberModal
          project={inviteTarget}
          onClose={() => setInviteTarget(null)}
        />
      )}
    </div>
  );
}
