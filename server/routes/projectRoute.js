import express from "express";
const router = express.Router();
import * as projectController from "../controllers/projectController.js";
import tokenValidator from "../middlewares/tokenValidator.js";

router.post("/create", tokenValidator, projectController.createProject);
router.post("/invite", tokenValidator, projectController.projectInvite);
router.post("/response", tokenValidator, projectController.inviteResponse);

export default router;
