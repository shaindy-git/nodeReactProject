const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
const Admin = require("../models/Admin")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generatePassword = require('generate-password');
const sendEmail = require('../nodemailer');
const validateUserDetails = require("../validation")



const login = async (req, res) => {
    const { userName, password } = req.body
    if (!userName || !password) {
        return res.status(400).json({ message: "all fields are required" })

    }


    const foundM = await Manager.findOne({ userName }).lean()
    const foundT = await Teacher.findOne({ userName }).lean()
    const foundS = await Student.findOne({ userName }).lean()
    const foundA = await Admin.findOne({ userName }).lean()
    if (!foundM && !foundT && !foundS && !foundA) {

        return res.status(401).json({ message: 'Unauthorized' })
    }

    else if (foundA) {
        const match = await bcrypt.compare(password, foundA.password)
        if (!match) return res.status(401).json({ message: 'Unauthorized' })
        const AInfo = {
            _id: foundA._id,
            userName: foundA.userName,
            role: "A"
        }
        const accessToken = jwt.sign(AInfo, process.env.ACCESS_TOKEN_SECRET)
        return res.status(200).json({ accessToken: accessToken })
    }


    else if (foundM) {
        const match = await bcrypt.compare(password, foundM.password)
        if (!match) return res.status(401).json({ message: 'Unauthorized' })

        console.log("foundM");
        const MInfo = {
            _id: foundM._id,
            firstName: foundM.firstName,
            lastName: foundM.lastName,
            userName: foundM.userName,
            numberID: foundM.numberID,
            dateOfBirth: foundM.dateOfBirth,
            phone: foundM.phone,
            email: foundM.email,
            area: foundM.area,
            RequestList: foundM.RequestList,
            role: "M"
        }
        const accessToken = jwt.sign(MInfo, process.env.ACCESS_TOKEN_SECRET)
        return res.status(200).json({ accessToken: accessToken })

    }

    else if (foundT) {
        const match = await bcrypt.compare(password, foundT.password)
        if (!match) return res.status(401).json({ message: 'Unauthorized' })

        console.log("foundT");

        const TInfo = {
            _id: foundT._id,
            firstName: foundT.firstName,
            lastName: foundT.lastName,
            userName: foundT.userName,
            numberID: foundT.numberID,
            dateOfBirth: foundT.dateOfBirth,
            phone: foundT.phone,
            email: foundT.email,
            area: foundT.area,
            gender: foundT.gender,
            recommendations: foundT.recommendations,
            role: "T"
        }
        const accessToken = jwt.sign(TInfo, process.env.ACCESS_TOKEN_SECRET)
        return res.status(200).json({ accessToken: accessToken })

    }

    else if (foundS) {
        const match = await bcrypt.compare(password, foundS.password)
        if (!match) return res.status(401).json({ message: 'Unauthorized' })

        console.log("foundS");

        const SInfo = {
            _id: foundS._id,
            firstName: foundS.firstName,
            lastName: foundS.lastName,
            userName: foundS.userName,
            numberID: foundS.numberID,
            dateOfBirth: foundS.dateOfBirth,
            phone: foundS.phone,
            email: foundS.email,
            myTeacher: foundS.myTeacher,
            lessonsRemaining: foundS.lessonsRemaining,
            lessonsLearned: foundS.lessonsLearned,
            dateforLessonsAndTest: foundS.dateforLessonsAndTest,
            role: "S"
        }
        const accessToken = jwt.sign(SInfo, process.env.ACCESS_TOKEN_SECRET)
        return res.status(200).json({ accessToken: accessToken })
    }


}

const registerS = async (req, res) => {
    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, password } = req.body
    if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !password) {
        return res.status(400).json({ message: "all fields are required" })
    }
    if (!validateUserDetails(phone, email, dateOfBirth, numberID)) {
        return res.status(400).json({ message: "The details are invalid." })
    }

    const doubleUserNameT = await Teacher.findOne({ userName: userName }).lean()
    const doubleUserNameM = await Manager.findOne({ userName: userName }).lean()
    const doubleUserNameS = await Student.findOne({ userName: userName }).lean()
    const doubleUserNameA = await Admin.findOne({ userName: userName }).lean()

    const allManagers = await Manager.find().exec();
    const userExistsInRequests = allManagers.some(manager =>
        manager.RequestList.some(request => request.userName === userName)
    );
    if (doubleUserNameT || doubleUserNameM || doubleUserNameS || doubleUserNameA || userExistsInRequests) {
        return res.status(400).json({ message: "doubleUserName" })
    }
    if ((new Date() - new Date(dateOfBirth)) < 0) {
        return res.status(400).json({ message: "Invalid date of birth" })
    }
    if ((new Date() - new Date(dateOfBirth)) > 70 * 31536000000 || (new Date() - new Date(dateOfBirth)) < 18 * 31536000000) {//מציג את 1/1000 השניה בשנה
        return res.status(400).json({ message: "The age is not appropriate" })
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const student = await Student.create({
        firstName, lastName, userName, numberID, dateOfBirth, phone, email, password: hashedPwd
    })
    if (student) {
        const students = await Student.find({}, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
        console.log({ students, role: 'Student' })
        return res.status(200).json(student)
    } else {
        return res.status(400).json({ message: 'Invalid Student ' })
    }
}

const registerT = async (req, res) => {
    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, area, gender } = req.body


    if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !area || !gender) {
        return res.status(400).json({ message: "files are required" })
    }
    if (!validateUserDetails(phone, email, dateOfBirth, numberID)) {
        return res.status(400).json({ message: "The details are invalid." })
    }

    const meneger = await Manager.findOne({ area: area }).exec()
    if (!meneger) {
        return res.status(400).json({ message: "not area" })
    }
    const genders = ["male", "female"]

    if (!genders.includes(gender)) {
        return res.status(400).json({ message: 'This gender is not validate' })
    }


    const doubleUserNameT = await Teacher.findOne({ userName: userName }).lean()
    const doubleUserNameM = await Manager.findOne({ userName: userName }).lean()
    const doubleUserNameS = await Student.findOne({ userName: userName }).lean()
    const doubleUserNameA = await Admin.findOne({ userName: userName }).lean()
    const allManagers = await Manager.find().exec();
    const userExistsInRequests = allManagers.some(manager =>
        manager.RequestList.some(request => request.userName === userName)
    );
    if (doubleUserNameT || doubleUserNameM || doubleUserNameS || doubleUserNameA || userExistsInRequests) {
        return res.status(400).json({ message: "doubleUserName" })
    }
    if ((new Date() - new Date(dateOfBirth)) < 0) {
        return res.status(400).json({ message: "Invalid date of birth" })
    }
    if ((new Date() - new Date(dateOfBirth)) > 60 * 31536000000 || (new Date() - new Date(dateOfBirth)) < 40 * 31536000000) {//מציג את 1/1000 השניה בשנה
        return res.status(400).json({ message: "The age is not appropriate" })
    }
    // יצירת סיסמה אקראית
    const password = "RandomPassword" + generatePassword.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
    });
    const hashedPwd = await bcrypt.hash(password, 10)
    const teacher = ({
        firstName, lastName, userName, numberID, dateOfBirth, phone, email, password: hashedPwd, area, gender
    })

    console.log(meneger.RequestList)
    meneger.RequestList = [...meneger.RequestList, teacher]
    // meneger.RequestList.push(teacher)
    await meneger.save()


    sendEmail(email, `The request has been sent`, `                      
    Hello  ${firstName}  ${lastName}! \n
            Your request to be a driving instructor at a school in the ${area} area is being reviewed \n
            A response will be received within 10 business days \n
            This is your personal password: ${password} If accepted,\n
             we recommend changing the password the first time you log in to your personal area.\n 
             Save the password and delete this email `)
        .then(response => {
            console.log('Email sent from Function One:', response);
        })
        .catch(error => {
            console.error('Error sending email from Function One:', error);
        });

    // console.log('Generated Password:', password); // הדפסת הסיסמה לקונסולה
    // console.log(meneger.RequestList)
    return res.status(200).json(meneger)

}
module.exports = {
    login,
    registerS,
    registerT
}



