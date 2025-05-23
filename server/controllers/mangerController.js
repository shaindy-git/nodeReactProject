const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
const Admin = require("../models/Admin")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generatePassword = require('generate-password');
const sendEmail = require('../nodemailer');
const validateUserDetails=require("../validation")


const addManager = async (req, res) => {
    const { role } = req.user;
    if (role !== 'A') {
        return res.status(400).json({ message: "No access" }); 
    }

    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, area } = req.body;

    if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !area) {
        return res.status(400).json({ message: "Fields are required" });
    }
    if(! validateUserDetails(phone, email, dateOfBirth, numberID)){
        return res.status(400).json({ message: "The details are invalid." })
    }

    const doubleUserNameT = await Teacher.findOne({ userName: userName }).lean();
    const doubleUserNameM = await Manager.findOne({ userName: userName }).lean();
    const doubleUserNameS = await Student.findOne({ userName: userName }).lean();
    const doubleUserNameA = await Admin.findOne({ userName: userName }).lean();
    const allManagers = await Manager.find().exec();
    const userExistsInRequests = allManagers.some(manager =>
        manager.RequestList.some(request => request.userName === userName)
    );

    if (doubleUserNameT || doubleUserNameM || doubleUserNameS || doubleUserNameA || userExistsInRequests) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const doublarea = await Manager.findOne({ area: area }).lean();
    if (doublarea) {
        return res.status(400).json({ message: "Area already assigned" });
    }
    if ((new Date() - new Date(dateOfBirth)) < 0) {
        return res.status(400).json({ message: "Invalid date of birth" });
    }


    if ((new Date() - new Date(dateOfBirth)) > 70 * 31536000000 || (new Date() - new Date(dateOfBirth)) < 50 * 31536000000) {//מציג את 1/1000 השניה בשנה
        return res.status(400).json({ message: "The age is not appropriate, for a teacher the required age is between 50-70" })

    }

 
    const password = "RandomPassword" + generatePassword.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
    });

 
    const hashedPwd = await bcrypt.hash(password, 10);

 
    const manager = await Manager.create({
        firstName, lastName, userName, numberID, dateOfBirth, phone, email, password: hashedPwd, area
    });

    if (manager) {
   
        const managers = await Manager.find()
            .sort({ area: 1, firstName: 1, lastName: 1 })
            .select('-password')
            .lean();



        sendEmail(email, `You joined as the principal of a driving school in the area ${area}`, `Hello  ${firstName}  ${lastName}! \n
            You joined as the principal of a driving school in the area ${area}\n
            your password is:  ${password}. \n
           The password is valid for 60 minutes, you must log in to your personal area and change it.\n
                The username will be sent to you at the phone number:${phone} `)
            .then(response => {
                console.log('Email sent from Function One:', response);
            })
            .catch(error => {
                console.error('Error sending email from Function One:', error);
            });



       //console.log('Generated Password:', password); // הדפסת הסיסמה לצרכי פיתוח
        return res.status(200).json({ managers });
    } else {
        return res.status(400).json({ message: 'Invalid Manager' });
    }
};

const getAllManagers = async (req, res) => {
    const { role } = req.user; 
    if (role !== 'A') {
        return res.status(400).json({ message: "No access" }); 
    }
    const managers = await Manager.find({}, { password: 0 }).sort({ firstName: 1, lastName: 1 }).lean();
    if (!managers) {
        return res.status(400).json({ message: 'No managers found' });
    }
 

    return res.status(200).json({ managers: managers });
}


const updateManager = async (req, res) => {
    const { _id } = req.user
    console.log(_id)
    const { firstName, lastName, userName, phone, email } = req.body

    if (!_id || !firstName || !lastName || !userName || !phone || !email) {
        return res.status(400).json({ message: 'fields are required' })
    }
    if(! validateUserDetails(phone, email)){
            return res.status(400).json({ message: "The details are invalid." })
        }
    const manager = await Manager.findById(_id).exec()
    if (!manager) {
        return res.status(400).json({ message: 'Manager not found' })
    }

    
    const doubleUserNameT = await Teacher.findOne({ userName: userName }).lean()
    const doubleUserNameM = await Manager.findOne({
        userName: userName,
        _id: { $ne: _id }
    }).lean()
    const doubleUserNameS = await Student.findOne({ userName: userName }).lean()
    const doubleUserNameA = await Admin.findOne({ userName: userName }).lean()
    const allManagers = await Manager.find().exec();
    const userExistsInRequests = allManagers.some(manager =>
        manager.RequestList.some(request => request.userName === userName)
    );
    if (doubleUserNameT || doubleUserNameM || doubleUserNameS || doubleUserNameA || userExistsInRequests) {
        return res.status(400).json({ message: "doubleUserName" })
    }

    manager.firstName = firstName,
        manager.lastName = lastName,
        manager.userName = userName,
        manager.numberID = manager.numberID,
        manager.dateOfBirth = manager.dateOfBirth,
        manager.phone = phone,
        manager.email = email,
        manager.password = manager.password,
        manager.area = manager.area

    await manager.save()


    const MInfo = {
        _id: manager._id,
        firstName: manager.firstName,
        lastName: manager.lastName,
        userName: manager.userName,
        numberID: manager.numberID,
        dateOfBirth: manager.dateOfBirth,
        phone: manager.phone,
        email: manager.email,
        area: manager.area,
        RequestList: manager.RequestList,
        role: "M"
    }
    const accessToken = jwt.sign(MInfo, process.env.ACCESS_TOKEN_SECRET)
    return res.status(200).json({ accessToken: accessToken, role: MInfo.role })

}


const getRequestsByManagerId = async (req, res) => {

    const { _id, role } = req.user
    if (role != 'M') {
        return res.status(400).json({ message: "No accsess" })
    }
    const manager = await Manager.findById(_id, { password: 0 });

    if (!manager) {
        return res.status(400).json({ message: 'no manager found' });
    }


    res.status(200).json(manager.RequestList);


};

const removeReqest = async (req, res) => {
    //איתור הבקשה
    const { _id, role } = req.user
    if (role != 'M') {
        return res.status(400).json({ message: "No accsess" })
    }
    const maneger = await Manager.findOne({ _id: _id }).exec()
    if (!maneger) {
        return res.status(400).json({ message: "maneger not found" })
    }

    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, password, area, gender } = req.body

    if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !password || !area || !gender) {
        return res.status(400).json({ message: "files are required" })
    }

    if(! validateUserDetails(phone, email)){
        return res.status(400).json({ message: "The details are invalid." })
    }
    const genders = ["male", "female"]

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

    sendEmail(email, ` Your request was not accepted`, `Hello  ${firstName}  ${lastName}! \n
        Your request to be accepted as a driving instructor in the ${area} rea was rejected.\n
       Best of luck in the future! \n`)
        .then(response => {
            console.log('Email sent from Function One:', response);
        })
        .catch(error => {
            console.error('Error sending email from Function One:', error);
        });

    //res
    return res.status(200).json({ message: 'The deletion was successful' })

}

const changePassword = async (req, res) => {
    const { _id, role } = req.user
    if (role != 'M') {
        return res.status(400).json({ message: "No accsess" })
    }
    const { oldPassword, newPassword } = req.body
    const manager = await Manager.findById(_id).exec();
    if (!manager) {
        return res.status(400).json({ message: 'manager not found' });
    }
    const match = await bcrypt.compare(oldPassword, manager.password)
    if (!match) return res.status(401).json({ message: 'Incorrect password' })
    manager.password = await bcrypt.hash(newPassword, 10)
    await manager.save()
    return res.status(200).json({ message: 'Password changed successfully.' })
}

const deleteManager = async (req, res) => {
    try {
        const { role } = req.user;
        const { id } = req.params;
        const { firstName, lastName, userName, numberID, dateOfBirth, phone, email } = req.body;

     
        if (!role || !id) {
            return res.status(400).json({ message: "Role and ID are required" });
        }

        if (role !== 'A') {
            return res.status(403).json({ message: "No access" });
        }

    
        if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email) {
            return res.status(400).json({ message: "All replacement teacher fields are required" });
        }
        if(! validateUserDetails(phone, email, dateOfBirth, numberID)){
            return res.status(400).json({ message: "The details are invalid." })
        }


        const doubleUserNameT = await Teacher.findOne({ userName }).lean();
        const doubleUserNameM = await Manager.findOne({ userName }).lean();
        const doubleUserNameS = await Student.findOne({ userName }).lean();
        const doubleUserNameA = await Admin.findOne({ userName }).lean();

        const allManagers = await Manager.find().exec();
        const userExistsInRequests = allManagers.some(manager =>
            manager.RequestList.some(request => request.userName === userName)
        );

        if (doubleUserNameT || doubleUserNameM || doubleUserNameS || doubleUserNameA || userExistsInRequests) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const birthDate = new Date(dateOfBirth);
        const age = (new Date() - birthDate) / 31536000000; 

        if (age < 50 || age > 70) {
            return res.status(400).json({ message: "The age is not appropriate, for a teacher the required age is between 50-70" });
        }

   
        const manager = await Manager.findById(id).exec();
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }


        const password = "RandomPassword" + generatePassword.generate({
            length: 12,
            numbers: true,
            symbols: true,
            uppercase: true,
            lowercase: true,
        });

        const hashedPwd = await bcrypt.hash(password, 10);


        const newManager = await Manager.create({
            firstName,
            lastName,
            userName,
            numberID,
            dateOfBirth,
            phone,
            email,
            password: hashedPwd,
            area: manager.area,
        });

        if (!newManager) {
            return res.status(400).json({ message: "Failed to create replacement teacher" });
        }
        const manager1 = manager

        try {
            await manager.deleteOne();

            sendEmail(manager1.email, `You are fired from running the driving school in the area. ${manager1.area}`, `Hello  ${manager1.firstName}  ${manager1.lastName}! \n
                You are fired from running the driving school in the area. ${manager1.area}\n
                Wishing you continued success. `)
                .then(response => {
                    console.log('Email sent from Function One:', response);
                })
                .catch(error => {
                    console.error('Error sending email from Function One:', error);
                });
        } catch (err) {
            await newManager.deleteOne();
            return res.status(500).json({ message: "Failed to delete old manager. New manager was removed to avoid duplication." });
        }

        const managers = await Manager.find()
            .select('-password')
            .sort({ area: 1, firstName: 1, lastName: 1 })
            .lean();

        sendEmail(email, `You joined as the principal of a driving school in the area ${manager1.area}}`, `Hello  ${firstName}  ${lastName}! \n
                You joined as the principal of a driving school in the area ${manager1.area}\n
                your password is:  ${password}. \n
                The password is valid for 60 minutes, you must log in to your personal area and change it.\n
                The username will be sent to you at the phone number:${phone} `)
            .then(response => {
                console.log('Email sent from Function One:', response);
            })
            .catch(error => {
                console.error('Error sending email from Function One:', error);
            });

        return res.status(200).json({
            message: "Manager deleted successfully and teacher created in their place",
            password,
            managers
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while processing the request" });
    }
};




const getManagerById = async (req, res) => {
    const { _id, role } = req.user//של המבקש
    const { id } = req.params//של הסטודנט
    if (!_id || !role || !id) {
        return res.status(400).json({ message: "files are required" })
    }
    if (role !== 'M' && role !== 'A') {

        return res.status(400).json({ message: "no accsess" })
    }


    const manager = await Manager.findOne({ _id }, { password: 0 }).lean()
    if (!manager) {
        return res.status(400).json({ message: "no accsess" })
    }

    return res.status(200).json({ manager: manager });
}



module.exports = {
    addManager,
    getAllManagers,
    updateManager,
    getRequestsByManagerId,
    removeReqest,
    changePassword,
    deleteManager,
    getManagerById

}