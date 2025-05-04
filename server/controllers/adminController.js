const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
const Admin = require("../models/Admin")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const addAdmin=async(req, res)=>{

    const{userName, password}=req.body

    const doubleUserNameT = await Teacher.findOne({ userName: userName }).lean()
        const doubleUserNameM = await Manager.findOne({ userName: userName }).lean()
        const doubleUserNameS = await Student.findOne({ userName: userName }).lean()
        const doubleUserNameA = await Admin.findOne({ userName: userName }).lean()
        const allManagers = await Manager.find().exec();
        const userExistsInRequests = allManagers.some(manager =>
            manager.RequestList.some(request => request.userName === userName)
        );
        if (doubleUserNameT || doubleUserNameM || doubleUserNameS || doubleUserNameA||userExistsInRequests) {
            return res.status(400).json({ message: "doubleUserName" })
        }
        
    const hashedPwd = await bcrypt.hash(password, 10)
    const admin = await Admin.create({
       userName, password: hashedPwd
    })
    if(admin){
        return res.status(200).json({admin:admin})
    }

    return res.status(400).json({message:"no admin created"})
}

const getAllAreas = async (req, res) => {
    try {
        // שליפת כל המנהלים מהמסד
        const managers = await Manager.find({}, { area: 1 }).lean();

        // בדיקה האם נמצאו מנהלים
        if (!managers?.length) {
            return res.status(404).json({ message: 'No managers found' });
        }

        // מיפוי האזורים של המנהלים
        const areas = managers.map(manager => manager.area);

        // החזרת האזורים
        return res.status(200).json({ areas:areas });
    } catch (error) {
        console.error('Error fetching areas:', error.message);
        return res.status(500).json({ message: 'An error occurred while fetching areas' });
    }
};

module.exports = {
    addAdmin,
    getAllAreas
   
}