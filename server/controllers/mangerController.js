const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
const Admin = require("../models/Admin")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generatePassword = require('generate-password');


// const addManager = async (req, res) => {
//     const {role}=req.user
//     if(role!='A'){
//         return res.status(400).json({ message: "No accsess" })
//     }
//     const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, area } = req.body
//     if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !area) {
//         return res.status(400).json({ message: "files are required" })
//     }
  
//     const doubleUserNameT = await Teacher.findOne({ userName: userName }).lean()
//     const doubleUserNameM = await Manager.findOne({ userName: userName }).lean()
//     const doubleUserNameS = await Student.findOne({ userName: userName }).lean()
//     const doubleUserNameA = await Admin.findOne({ userName: userName }).lean()
//     const allManagers = await Manager.find().exec();
//     const userExistsInRequests = allManagers.some(manager =>
//         manager.RequestList.some(request => request.userName === userName)
//     );
//     if (doubleUserNameT || doubleUserNameM || doubleUserNameS || doubleUserNameA || userExistsInRequests) {
//         return res.status(400).json({ message: "doubleUserName" })
//     }
//     const doublarea = await Manager.findOne({ area: area }).lean()
//     if (doublarea) {
//         return res.status(400).json({ message: "doublarea" })
//     }

//     const password = generatePassword.generate({
//         length: 12, // אורך הסיסמה
//         numbers: true, // כולל מספרים
//         symbols: true, // כולל סימנים מיוחדים
//         uppercase: true, // כולל אותיות גדולות
//         lowercase: true, // כולל אותיות קטנות
//     });
    
    
//     const hashedPwd = await bcrypt.hash(password, 10)
//     const manager = await Manager.create({
//         firstName, lastName, userName, numberID, dateOfBirth, phone, email, password: hashedPwd, area
//     })

//     if (manager) {
//         const managers = await Manager.find()
//         .sort({ firstName: 1, lastName: 1 })
//         .select('-password') // לא כולל את הסיסמה בתוצאות
//         .lean();

//         console.log('Generated Password:aaa', password);
//         return res.status(200).json({ managers })
//     } else {
//         return res.status(400).json({ message: 'Invalid Manager ' })
//     }

// }

const addManager = async (req, res) => {
    const { role } = req.user; // בדיקת תפקיד המשתמש המחובר
    if (role !== 'A') {
        return res.status(400).json({ message: "No access" }); // אין הרשאות
    }

    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, area } = req.body;

    // בדיקת שדות חובה
    if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !area) {
        return res.status(400).json({ message: "Fields are required" });
    }

    // בדיקת כפילות בשם משתמש
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

    // בדיקת כפילות באזור
    const doublarea = await Manager.findOne({ area: area }).lean();
    if (doublarea) {
        return res.status(400).json({ message: "Area already assigned" });
    }

    // יצירת סיסמה אקראית
    const password = "RandomPassword"+ generatePassword.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
    });

    // הצפנת הסיסמה
    const hashedPwd = await bcrypt.hash(password, 10);

    // יצירת המנהל
    const manager = await Manager.create({
        firstName, lastName, userName, numberID, dateOfBirth, phone, email, password: hashedPwd, area
    });

    if (manager) {
        // שליפת רשימת המנהלים המעודכנת
        const managers = await Manager.find()
            .sort({ firstName: 1, lastName: 1 })
            .select('-password') // לא להחזיר את הסיסמאות
            .lean();

        console.log('Generated Password:', password); // הדפסת הסיסמה לקונסולה
        return res.status(200).json({ managers });
    } else {
        return res.status(400).json({ message: 'Invalid Manager' });
    }
};
const updateManager = async (req, res) => {
    const { _id } = req.user
    console.log(_id)
    const { firstName, lastName, userName, phone, email } = req.body

    if (!_id || !firstName || !lastName || !userName || !phone || !email) {
        return res.status(400).json({ message: 'fields are required' })
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
    // const managers = await Manager.find({}, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
    // return res.status(200).json({ managers, role: 'Manager' })

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
    if(role!='M'){
        return res.status(400).json({ message: "No accsess" })
    }
    const manager = await Manager.findById(_id, { password: 0 });

    if (!manager) {
        return res.status(400).json({ message: 'no manager found' });
    }

    // מחזיר את רשימת הבקשות
    res.status(200).json(manager.RequestList);


};

const removeReqest = async (req, res) => {
    //איתור הבקשה
    const { _id, role } = req.user
    if(role!='M'){
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

    //res
    return res.status(200).json({ message: 'The deletion was successful' })

}

const changePassword = async (req, res) => {
    const { _id , role} = req.user
    if(role!='M'){
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

        // בדיקה אם מאפיינים חיוניים חסרים
        if (!role || !id) {
            return res.status(400).json({ message: "Role and ID are required" });
        }

        // בדיקה אם למשתמש יש הרשאות
        if (role !== 'A') {
            return res.status(403).json({ message: "No access" });
        }

        // בדיקה אם המנהל קיים
        const manager = await Manager.findById(id).exec();
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        // מחיקת המנהל
        await manager.deleteOne();

        // שליפת כל המנהלים ללא השדה `password`
        const managers = await Manager.find()
            .select('-password') // החרגת שדה הסיסמה
            .sort({ firstName: 1 })
            .lean();

        return res.status(200).json({ 
            message: "Manager deleted successfully", 
            managers: managers 
        });
    } catch (error) {
        // טיפול בשגיאות
        console.error(error);
        return res.status(500).json({ message: "An error occurred while deleting the manager" });
    }
};



module.exports = {
    addManager,
    updateManager,
    getRequestsByManagerId,
    removeReqest,
    changePassword,
    deleteManager

}