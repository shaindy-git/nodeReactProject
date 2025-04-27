const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const mangerController = require("../controllers/mangerController")

//router.use(verifyJWT)

router.post("/addManager", mangerController.addManager)
router.put("/updateManager",verifyJWT, mangerController.updateManager)
router.get("/getRequestsByManagerId",verifyJWT, mangerController.getRequestsByManagerId)
router.put("/removeReqest",verifyJWT, mangerController.removeReqest)
router.put("/changePassword",verifyJWT, mangerController.changePassword)


module.exports = router

