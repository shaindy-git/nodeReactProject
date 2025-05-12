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

        const managers = await Manager.find({}, { area: 1 }).lean();


        if (!managers?.length) {
            return res.status(404).json({ message: 'No managers found' });
        }

        const areas = managers.map(manager => manager.area);

        return res.status(200).json({ areas:areas });
    } catch (error) {
        console.error('Error fetching areas:', error.message);
        return res.status(500).json({ message: 'An error occurred while fetching areas' });
    }
};
const changePassword = async (req, res) => {
    const { _id, role } = req.user
    if (role != 'A') {
        return res.status(400).json({ message: "No accsess" })
    }
    const { oldPassword, newPassword } = req.body
    const admin = await Admin.findById(_id).exec();
    if (!admin) {
        return res.status(400).json({ message: 'admin not found' });
    }
    const match = await bcrypt.compare(oldPassword, admin.password)
    if (!match) return res.status(401).json({ message: 'Incorrect password' })
        admin.password = await bcrypt.hash(newPassword, 10)
    await admin.save()
    return res.status(200).json({ message: 'Password changed successfully.' })
}

module.exports = {
    addAdmin,
    getAllAreas,
    changePassword
   
}