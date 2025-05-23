const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const studentController = require("../controllers/studentController")

router.use(verifyJWT)

router.post("/addStudent", studentController.addStudent)
router.get("/getAllStudents", studentController.getAllStudents)
router.put("/updateStudent", studentController.updateStudent)
router.get("/getstudentById/:id", studentController.getstudentById)
router.put("/teacherSelection", studentController.teacherSelection)
router.put("/addRecommendation", studentController.addRecommendation)
router.put("/settingLesson", studentController.settingLesson)
router.put("/cancellationLesson", studentController.cancellationLesson)
router.put("/testRequest", studentController.testRequest)
router.delete("/deleteStudent/:studentID", studentController.deleteStudent)
router.put("/changePassword", studentController.changePassword)
router.get("/getTestDetails", studentController.getTestDetails)



module.exports = router
