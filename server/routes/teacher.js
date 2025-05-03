const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")

const teacherController = require("../controllers/teacherController")

router.get("/getTeacherById/:id", teacherController.getTeacherById)

router.use(verifyJWT)

router.post("/addTeacher", teacherController.addTeacher)
router.get("/getAllTeachers", teacherController.getAllTeachers)
router.delete("/deleteTeacher/:idTeacher",teacherController.deleteTeacher )
router.put("/updateTeacher", teacherController.updateTeacher)
router.put("/addAvailableClasses", teacherController.addAvailableClasses)
router.put("/settingTest", teacherController.settingTest)
router.put("/addLessonToStudent", teacherController.addLessonToStudent)
router.get("/getAllDatesWithClasses", teacherController.getAllDatesWithClasses)
router.get("/getClassesByDate/:date", teacherController.getClassesByDate)
router.put("/changePassword", teacherController.changePassword)
router.get("/getAllRecommendations", teacherController.getAllRecommendations)
router.get("/getRequests", teacherController.getRequests)
router.get("/getDateforLessonsAndTests/:date", teacherController.getDateforLessonsAndTests);


module.exports = router