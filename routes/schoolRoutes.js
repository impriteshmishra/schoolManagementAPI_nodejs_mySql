import express from "express"
import { addSchool, listSchools } from "../controllers/school.controllers.js";

const router = express.Router();

router.route('/addSchool').post(addSchool)
router.route('/listSchool').get(listSchools)

export default router;