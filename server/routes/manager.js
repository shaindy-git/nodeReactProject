const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const mangerController = require("../controllers/mangerController")

//router.use(verifyJWT)

router.post("/addManager", mangerController.addManager)
router.put("/updateManager",verifyJWT, mangerController.updateManager)

module.exports = router

