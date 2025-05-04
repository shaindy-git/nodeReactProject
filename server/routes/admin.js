const express = require("express")
const router = express.Router()


const adminController = require("../controllers/adminController")
router.post("/addAdmin", adminController.addAdmin)
router.get("/getAllAreas", adminController.getAllAreas)


module.exports = router