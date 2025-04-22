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
    const cities=["Jerusalem - Talpiot", "Jerusalem - Beit Hakerem", "Jerusalem - Ramot",
        "Jerusalem - Pisgat Zeev", "Tel Aviv - Center", "Tel Aviv - Arlozorov", 
        "Tel Aviv - Dizengoff", "Tel Aviv - Balfour", "Petah Tikva - Center", 
        "Herzliya - Pituach", "Netivot", "Haifa - Bat Galim", "Haifa - Kiryot", "Safed - David Elazar", 
        "Tel Aviv - Kikar Hamedina", "Holon", "Beer Sheva", "Beit Shemesh - Ha'ir", "Bat Yam - Allenby", "Ramat Gan - Begin"]
    
        if(!cities.includes(area)){
            return res.status(400).json({ message: 'This area is not validate' })
        }
    const doubleUserNameT = await Teacher.findOne({ userName: userName }).lean()
    const doubleUserNameM = await Manager.findOne({ userName: userName }).lean()
    const doubleUserNameS = await Student.findOne({ userName: userName }).lean()
    const doublarea = await Manager.findOne({ area: area }).lean()
    if (doubleUserNameT || doubleUserNameM || doubleUserNameS) {
        return res.status(400).json({ message: "doubleUserName" })
    }
    if (doublarea) {
        return res.status(400).json({ message: "doublarea" })
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

const removeReqest = async (req, res) => {
    //איתור הבקשה
    const { _id } = req.user
    const maneger = await Manager.findOne({ _id: _id }).exec()
    if (!maneger) {
        return res.status(400).json({ message: "maneger not found" })
    }

    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, password, area, gender } = req.body

    if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !password || !area || !gender) {
        return res.status(400).json({ message: "files are required" })
    }
    const cities = ["Jerusalem - Talpiot", "Jerusalem - Beit Hakerem", "Jerusalem - Ramot",
        "Jerusalem - Pisgat Zeev", "Tel Aviv - Center", "Tel Aviv - Arlozorov",
        "Tel Aviv - Dizengoff", "Tel Aviv - Balfour", "Petah Tikva - Center",
        "Herzliya - Pituach", "Netivot", "Haifa - Bat Galim", "Haifa - Kiryot", "Safed - David Elazar",
        "Tel Aviv - Kikar Hamedina", "Holon", "Beer Sheva", "Beit Shemesh - Ha'ir", "Bat Yam - Allenby", "Ramat Gan - Begin"]

    const genders = ["male", "female"]

    if (!cities.includes(area)) {
        return res.status(400).json({ message: 'This area is not validate' })
    }
    if (!genders.includes(gender)) {
        return res.status(400).json({ message: 'This gender is not validate' })
    }

    if (maneger.area != area) {
        if (area != maneger.area) {
            return res.status(400).json({ message: 'No Access for this manneger' })
        }
    }

    const reqest = { firstName, lastName, userName, numberID, dateOfBirth, phone, email, password, area, gender }

    const foundItem = maneger.RequestList.find((a) => {
        return (
            a.firstName === firstName &&
            a.lastName === lastName &&
            a.userName === userName &&
            a.numberID === numberID &&
            new Date(a.dateOfBirth).toISOString() === new Date(dateOfBirth).toISOString() &&
            a.phone === phone &&
            a.email === email &&
            a.password === password &&
            a.area === area &&
            a.gender === gender
        );
    });
    //מחיקת הבקשה
    maneger.RequestList = maneger.RequestList.filter(item => item !== foundItem);
    await maneger.save();

    //res
    return res.status(400).json({ message: 'The deletion was successful' })

}



module.exports = {
    addManager,
    updateManager,
    removeReqest

}