import express from "express";
const router = express.Router();
import * as projectController from "../controllers/projectController.js";

// tokenValidator is already applied to the entire /projects router in script.js
router.get("/load", projectController.loadProject);
router.get("/members/:projId", projectController.getProjectMembers);
router.get("/invites", projectController.getInvites);
router.post("/create", projectController.createProject);
router.post("/invite", projectController.projectInvite);
router.post("/response", projectController.inviteResponse);

export default router;
