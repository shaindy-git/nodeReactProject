const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const mangerController = require("../controllers/mangerController")

//router.use(verifyJWT)

router.post("/addManager",verifyJWT, mangerController.addManager)
router.get("/getAllManagers",verifyJWT, mangerController.getAllManagers)
router.put("/updateManager",verifyJWT, mangerController.updateManager)
router.get("/getRequestsByManagerId",verifyJWT, mangerController.getRequestsByManagerId)
router.put("/removeReqest",verifyJWT, mangerController.removeReqest)
router.put("/changePassword",verifyJWT, mangerController.changePassword)
router.delete("/deleteManager/:id",verifyJWT, mangerController.deleteManager)
router.get("/getManagerById/:id", verifyJWT,mangerController.getManagerById)




module.exports = router

