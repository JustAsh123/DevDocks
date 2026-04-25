import { pool } from "../db.js";

export const getProjects = async (userId) => {
  const result = await pool.query(
    "SELECT p.id, p.name,p.owner_id, p.created_at from projects as p inner join project_members as pm on pm.project_id = p.id inner join users as u on pm.user_id = u.id where u.id = $1",
    [userId],
  );

  if (result.rows.length === 0) {
    return { success: false, message: "No projects found" };
  }

  return {
    success: true,
    projects: result.rows,
    message: "Projects fetched successfully",
  };
};

export const getProjectMembers = async (projId) => {
  const result = await pool.query(
    "select u.id, u.name from users as u inner join project_members as pm on pm.user_id = u.id where pm.project_id = $1",
    [projId],
  );
  if (result.rows.length === 0) {
    return { success: false, message: "No members found" };
  }
  return {
    success: true,
    members: result.rows,
    message: "Members fetched successfully",
  };
};

export const createProject = async (projectName, userId) => {
  const result = await pool.query(
    "INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING *",
    [projectName, userId],
  );
  if (result.rows.length === 0) {
    return { success: false, message: "Error creating project" };
  }
  await pool.query(
    "INSERT INTO project_members (user_id, project_id) VALUES ($1, $2)",
    [userId, result.rows[0].id],
  );
  return {
    success: true,
    project: result.rows[0],
    message: "Project Created Successfully",
  };
};

const isOwner = async (projId, userId) => {
  const res = await pool.query(
    "SELECT * FROM projects WHERE owner_id = $1 and id = $2",
    [userId, projId],
  );
  return res.rows.length > 0;
};

const getIdFromEmail = async (email) => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (res.rowCount === 0) return null;
  return res.rows[0].id;
};

const isMember = async (projId, userId) => {
  const res = await pool.query(
    "SELECT * FROM project_members WHERE user_id = $1 and project_id = $2",
    [userId, projId],
  );
  return res.rowCount > 0;
};

export const inviteProject = async (projId, userId, email) => {
  //Check if inviter is not the owner
  if (!(await isOwner(projId, userId))) {
    return { success: false, message: "Only owner can invite members" };
  }

  // Check if already a member
  const inviteeId = await getIdFromEmail(email);
  if (!inviteeId) {
    return { success: false, message: "User not found" };
  }

  if (await isMember(projId, inviteeId)) {
    return { success: false, message: "User is already a member" };
  }

  // Fail safe for unique(projId, inviteeId)
  try {
    const result = await pool.query(
      "INSERT INTO project_invites (proj_id, inviter_id, invitee_id) VALUES ($1,$2,$3) RETURNING *",
      [projId, userId, inviteeId], // reuse already-fetched inviteeId
    );
    return {
      success: true,
      message: "User invited successfully",
      invite: result.rows[0],
    };
  } catch (err) {
    console.log(err);
    return { success: false, message: "User is already invited" };
  }
};

export const getInvites = async (userId) => {
  const result = await pool.query(
    "SELECT pm.id, p.name, pm.created_at, u.name AS inviter_name, u.email AS inviter_email FROM projects p INNER JOIN project_invites pm ON p.id = pm.proj_id INNER JOIN users u ON pm.inviter_id = u.id WHERE pm.invitee_id = $1;",
    [userId],
  );

  if (result.rows.length === 0) {
    return { success: false, message: "No invites found" };
  }

  return {
    success: true,
    invites: result.rows,
    message: "Invites fetched successfully",
  };
};

export const inviteResponse = async (userId, inviteId, response) => {
  console.log(inviteId, userId);
  const res = await pool.query(
    "SELECT proj_id FROM project_invites WHERE id = $1 and invitee_id = $2",
    [inviteId, userId],
  );
  console.log(res);
  if (res.rowCount === 0) {
    return { success: false, message: "Invite not found" };
  }

  const project_id = res.rows[0].proj_id;

  if (response === "accept") {
    try {
      await pool.query(
        "INSERT INTO project_members (user_id, project_id) VALUES ($1, $2)",
        [userId, project_id],
      );
      await pool.query("DELETE FROM project_invites WHERE id = $1", [inviteId]);
      return { success: true, message: "Invite accepted successfully" };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Error accepting invite" };
    }
  }

  if (response === "reject") {
    try {
      await pool.query("DELETE FROM project_invites WHERE id = $1", [inviteId]);
      return { success: true, message: "Invite rejected successfully" };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Error rejecting invite" };
    }
  }
};

// Members with task-count for a project
export const getMembersStats = async (projId) => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email,
            COUNT(t.id) AS task_count
     FROM users u
     INNER JOIN project_members pm ON pm.user_id = u.id
     LEFT JOIN tasks t ON t.assigned_to = u.id AND t.project_id = $1
     WHERE pm.project_id = $1
     GROUP BY u.id, u.name, u.email
     ORDER BY task_count DESC, u.name ASC`,
    [projId],
  );
  return { success: true, members: result.rows };
};

// Remove a member (owner only). Also unassigns their tasks.
export const removeMember = async (projId, memberId, requesterId) => {
  // Verify requester is the owner
  if (!(await isOwner(projId, requesterId))) {
    return { success: false, message: "Only the owner can remove members" };
  }
  // Prevent removing the owner themselves
  if (memberId === requesterId) {
    return { success: false, message: "Owner cannot remove themselves" };
  }
  try {
    // Unassign their tasks in this project
    await pool.query(
      "UPDATE tasks SET assigned_to = NULL WHERE project_id = $1 AND assigned_to = $2",
      [projId, memberId],
    );
    // Remove from project_members
    const res = await pool.query(
      "DELETE FROM project_members WHERE project_id = $1 AND user_id = $2",
      [projId, memberId],
    );
    if (res.rowCount === 0) {
      return { success: false, message: "Member not found in this project" };
    }
    return { success: true, message: "Member removed successfully" };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
};
