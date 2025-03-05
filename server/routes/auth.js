const express = require("express")
const router = express.Router()


const authController = require("../controllers/authController")
router.post("/login", authController.login)
router.post("/registerS", authController.registerS)
router.post("/registerT", authController.registerT)

module.exports = router