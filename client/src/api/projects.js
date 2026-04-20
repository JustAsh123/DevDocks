import API from "./axios";

// POST /projects/create → body: { projName }
// response: { status: true/false, message, project: "name string", user: "name string" }
// ⚠️ server uses "status" (not "success") for this route
export const createProject = (projName) =>
  API.post("/projects/create", { projName });

// POST /projects/invite → body: { projId, email }
// response: { success, message, statement, invite: { id, proj_id, inviter_id, invitee_id } }
// requires: caller must be the project owner
export const inviteToProject = (projId, email) =>
  API.post("/projects/invite", { projId, email });

// POST /projects/response → body: { inviteId, response: "accept" | "reject" }
// response: { success, message }
export const respondToInvite = (inviteId, response) =>
  API.post("/projects/response", { inviteId, response });
