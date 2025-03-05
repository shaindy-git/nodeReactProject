const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")

const teacherController = require("../controllers/teacherController")

router.use(verifyJWT)

router.post("/addTeacher", teacherController.addTeacher)
router.get("/getAllTeachers", teacherController.getAllTeachers)
router.delete("/deleteTeacher",teacherController.deleteTeacher )
router.put("/updateTeacher", teacherController.updateTeacher)
//router.get("/getTeacherById/:id", teacherController.getTeacherById)
router.put("/addAvailableClasses", teacherController.addAvailableClasses)
router.put("/settingTest", teacherController.settingTest)



module.exports = router