const express = require("express")
const router = express.Router()
//------------------------------
const verifyJWT = require("../middleware/verifyJWT")
//------------------------------
const adminController = require("../controllers/adminController")




router.post("/addAdmin", adminController.addAdmin)
router.get("/getAllAreas", adminController.getAllAreas)
//-------------------------------------------------
router.put("/changePassword",verifyJWT, adminController.changePassword)
//---------------------------------------------------



module.exports = router

