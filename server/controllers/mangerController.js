const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const addManager = async (req, res) => {
    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, password, area } = req.body
    if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !password || !area) {
        return res.status(400).json({ message: "files are required" })
    }
    const doubleUserNameT = await Teacher.findOne({ userName: userName }).lean()
    const doubleUserNameM = await Manager.findOne({ userName: userName }).lean()
    const doubleUserNameS = await Student.findOne({ userName: userName }).lean()
    if (doubleUserNameT || doubleUserNameM || doubleUserNameS) {
        return res.status(400).json({ message: "doubleUserName" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const manager = await Manager.create({
        firstName, lastName, userName, numberID, dateOfBirth, phone, email, password: hashedPwd, area
    })

    if (manager) {
        const manager = await Manager.find().sort({ firstNane: 1, lastName: 1 }).lean()
        return res.status(200).json({ manager, role: 'Manager' })
    } else {
        return res.status(400).json({ message: 'Invalid Teacher ' })
    }

}
const updateManager = async (req, res) => {
    const{_id}=req.user
    console.log(_id)
    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, password } = req.body

    if (!_id || !firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !password ) {
        return res.status(400).json({ message: 'fields are required' })
    }

    const manager = await Manager.findById(_id).exec()
    if (!manager) {
        return res.status(400).json({ message: 'Manager not found' })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
        manager.firstName = firstName,
        manager.lastName = lastName,
        manager.userName = userName,
        manager.numberID = numberID,
        manager.dateOfBirth = dateOfBirth,
        manager.phone = phone,
        manager.email = email,
        manager.password = hashedPwd,
        manager.area =  manager.area

    await manager.save()
    const managers = await Manager.find({},{password:0}).sort({ firstNane: 1, lastName: 1 }).lean()
    return res.status(200).json({ managers, role: 'Manager' })

}


module.exports = {
    addManager,
    updateManager
}