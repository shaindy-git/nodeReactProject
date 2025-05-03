
const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
const Admin = require("../models/Admin")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const addStudent = async (req, res) => {
    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, password } = req.body
    if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !password) {
        return res.status(400).json({ message: "files are required" })
    }
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

    if ((new Date() - new Date(dateOfBirth)) > 70 * 31536000000 || (new Date() - new Date(dateOfBirth)) < 18 * 31536000000) {//מציג את 1/1000 השניה בשנה
        return res.status(400).json({ message: "The age is not appropriate" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const student = await Student.create({
        firstName, lastName, userName, numberID, dateOfBirth, phone, email, password: hashedPwd
    })

    if (student) {
        const students = await Student.find().sort({ firstNane: 1, lastName: 1 }).lean()
        return res.status(200).json({ students, role: 'Student' })
    } else {
        return res.status(400).json({ message: 'Invalid Student ' })
    }

}

const getAllStudents = async (req, res) => {
    const { _id } = req.user
    const foundM = await Manager.findOne({ _id }).lean()
    const foundT = await Teacher.findOne({ _id }).lean()
    const foundS = await Student.findOne({ _id }).lean()

    if (foundS) {
        return res.status(400).json({ message: 'No Access for Students' })
    }
    if (foundT) {
        console.log(_id);
        const studentsT = await Student.find({ myTeacher: _id }).sort({ firstNane: 1, lastName: 1 }).lean()
        if (!studentsT?.length) {
            return res.status(400).json({ message: 'No students found' })

        }
        return res.json(studentsT)
    }
    console.log(foundM.area);
    const allStudents = await Student.find({ area: foundM.area }, { password: 0 }).sort({ firstName: 1, lastName: 1 }).lean()
    if (!allStudents?.length) {
        return res.status(400).json({ message: 'No students found' })

    }
    res.status(200).json(allStudents)
}



const updateStudent = async (req, res) => {
    const { _id } = req.user
    const { firstName, lastName, userName, phone, email } = req.body

    if (!_id || !firstName || !lastName || !userName || !phone || !email) {
        return res.status(400).json({ message: 'fields are required' })
    }
    const student = await Student.findById(_id).exec()
    if (!student) {
        return res.status(400).json({ message: 'Student not found' })
    }

    const doubleUserNameT = await Teacher.findOne({ userName: userName }).lean()
    const doubleUserNameM = await Manager.findOne({ userName: userName }).lean()
    const doubleUserNameA = await Admin.findOne({ userName: userName }).lean()
    const doubleUserNameS = await Student.findOne({
        userName: userName,
        _id: { $ne: _id }
    }).lean()
    const allManagers = await Manager.find().exec();
    const userExistsInRequests = allManagers.some(manager =>
        manager.RequestList.some(request => request.userName === userName)
    );
    if (doubleUserNameT || doubleUserNameM || doubleUserNameS || doubleUserNameA||userExistsInRequests) {
        return res.status(400).json({ message: "doubleUserName" })
    }

    student.firstName = firstName,
        student.lastName = lastName,
        student.userName = userName,
        student.phone = phone,
        student.email = email,


        await student.save()
    //student=await Student.findById({_id},{password:0}).exec()
    // const students = await Student.find({}, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
    // console.log({ students, role: 'Student' })
    // return res.status(200).json(student)
    const SInfo = {
        _id: foundS._id,
        firstName: student.firstName,
        lastName: student.lastName,
        userName: student.userName,
        numberID: student.numberID,
        dateOfBirth: student.dateOfBirth,
        phone: student.phone,
        email: student.email,
        myTeacher: student.myTeacher,
        lessonsRemaining: student.lessonsRemaining,
        lessonsLearned: student.lessonsLearned,
        dateforLessonsAndTest: student.dateforLessonsAndTest,
        role: "S"
    }
    const accessToken = jwt.sign(SInfo, process.env.ACCESS_TOKEN_SECRET)
    return res.status(200).json({ accessToken: accessToken, role: SInfo.role })

}

// const choosingArea = async (req, res) => {
//     const { _id } = req.user
//     const { area } = req.body

//     const cities = ["Jerusalem - Talpiot", "Jerusalem - Beit Hakerem", "Jerusalem - Ramot",
//         "Jerusalem - Pisgat Zeev", "Tel Aviv - Center", "Tel Aviv - Arlozorov",
//         "Tel Aviv - Dizengoff", "Tel Aviv - Balfour", "Petah Tikva - Center",
//         "Herzliya - Pituach", "Netivot", "Haifa - Bat Galim", "Haifa - Kiryot", "Safed - David Elazar",
//         "Tel Aviv - Kikar Hamedina", "Holon", "Beer Sheva", "Beit Shemesh - Ha'ir", "Bat Yam - Allenby", "Ramat Gan - Begin"]



//     if (!area || !_id) {
//         return res.status(400).json({ message: 'fields are required' })
//     }
//     if (!cities.includes(area)) {
//         return res.status(400).json({ message: 'This area is not validate' })
//     }
//     const student = await Student.findById(_id).exec()
//     if (!student) {
//         return res.status(400).json({ message: 'Student not found' })
//     }
//     if (student.area != null) {
//         return res.status(400).json({ message: 'You cant move area' })
//     }
//     student.area = area
//     await student.save()
//     // const students = await Student.find({},{password:0}).sort({ firstNane: 1, lastName: 1 }).lean()
//     // console.log({ area })
//     return res.status(200).json(student)

// }


//לא בדקנו
const getstudentById = async (req, res) => {
    // const { _id } = req.user
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "files are required" })
    }

    const student = await Student.findById(id,{password:0}).lean()
    // if(_id!=id && _id!=)
    if (!student) {
        return res.status(400).json({ message: 'No student found' })
    }
    return res.status(200).json(student)
}



const teacherSelection = async (req, res) => {
    const { _id } = req.user
    const { teacherId } = req.body
    if (!teacherId || !_id) {
        return res.status(400).json({ message: "files are required" })
    }
    const teacher = await Teacher.findById({ _id: teacherId }, { password: 0 }).exec()
    const student = await Student.findById({ _id }, { password: 0 }).exec()
    if (!teacher || !student) {
        return res.status(400).json({ message: 'No teacher found' })
    }
    if (teacher.listOfStudent.length > 3) {
        return res.status(400).json({ message: 'The teacher is not available to accept new students' })
    }
    teacher.listOfStudent = [...teacher.listOfStudent, _id]
    await teacher.save()
    student.myTeacher = teacherId
    student.area = teacher.area
    await student.save()
    res.status(200).json({ student, teacher })

}

const getmyteacher = async (req, res) => {
    const { _id } = req.user
    if (!_id) {
        return res.status(400).json({ message: "files are required" })
    }
    const student = await Student.findById({ _id }, { password: 0 }).lean()
    teacherId = student.myTeacher
    const teacher = await Teacher.findById({ _id: teacherId }, { password: 0 }).lean()
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' })
    }
    return res.status(200).json(teacher)

}

const addRecommendation = async (req, res) => {
    const { _id } = req.user
    const { rec } = req.body
    if (!rec || !_id) {
        return res.status(400).json({ message: "files are required" })
    }
    const student = await Student.findById({ _id }, { password: 0 }).lean()
    if (!student) {
        return res.status(400).json({ message: 'No student found' })
    }
    const teacherId = student.myTeacher
    const teacher = await Teacher.findById({ _id: teacherId }, { password: 0 }).exec()
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' })
    }
    const recommend = { name: student.firstName + " " + student.lastName, rec }
    teacher.recommendations = [...teacher.recommendations, recommend]
    await teacher.save()
    return res.status(200).json({ teacher, recommend: rec })

}

const settingLesson = async (req, res) => {
    const { _id } = req.user
    const { date, hour } = req.body
    if (!_id || !date || !hour) {
        return res.status(400).json({ message: "files are required" })
    }
    const student = await Student.findById({ _id }, { password: 0 }).exec()
    if (!student) {
        return res.status(400).json({ message: 'No student found' })
    }
    const teacherId = student.myTeacher
    const teacher = await Teacher.findById({ _id: teacherId }, { password: 0 }).exec()
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' })
    }
    if ( (new Date(date) - new Date()) <   3 * 24 * 60 * 60 * 1000) {//התאריך עוד פחות מ3 ימים
        return res.status(400).json({ message: "too late" })
    }
    if ( (new Date(date) - new Date()) < 0) {//התאריך כבר עבר
        return res.status(400).json({ message: "too late" })
    }
    // const searchD = await teacher.dateforLessonsAndTests.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
    // if (!searchD) {
    //     return res.status(400).json({ message: 'No Date found' })
    // }
    // const oneOnDay = student.dateforLessonsAndTest.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
    // if (oneOnDay) {
    //     return res.status(400).json({ message: 'You had alrady lesson in this day' })
    // }


    const searchD = teacher.dateforLessonsAndTests.find((e) => 
        new Date(e.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );
    if (!searchD) {
        return res.status(400).json({ message: 'No Date found' });
    }
    
    const oneOnDay = student.dateforLessonsAndTest.find((e) => 
        new Date(e.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );
    if (oneOnDay) {
        return res.status(400).json({ message: 'You already had a lesson on this day' });
    }


    const searchH = searchD.hours.find((e) => ((e.hour).toString()) === (hour))
    if (!searchH) {
        return res.status(400).json({ message: 'No Hour found in this Date' })
    }
    if (searchH.full === true) {
        return res.status(400).json({ message: 'The Hour is full' })
    }
    searchH.full = true
    searchH.typeOfHour = "Lesson"
    searchH.studentId=_id
    await teacher.save()

    const newDateAndHour = { date: date, hour: hour, typeOfHour: "Lesson" }
    student.dateforLessonsAndTest = [...student.dateforLessonsAndTest, newDateAndHour]
    student.lessonsRemaining = student.lessonsRemaining - 1
    student.lessonsLearned = student.lessonsLearned + 1
    await student.save()
    return res.status(200).json({ teacher, student })

}

const cancellationLesson = async (req, res) => {
    const { _id } = req.user
    const { date, hour } = req.body
    if (!_id || !date || !hour) {
        return res.status(400).json({ message: "files are required" })
    }
    const student = await Student.findById({ _id }, { password: 0 }).exec()
    if (!student) {
        return res.status(400).json({ message: 'No student found' })
    }
    const teacherId = student.myTeacher
    const teacher = await Teacher.findById({ _id: teacherId }, { password: 0 }).exec()
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' })
    }
    if ( (new Date(date) - new Date()) <   3 * 24 * 60 * 60 * 1000) {//התאריך עוד פחות מ3 ימים
        return res.status(400).json({ message: "too late" })
    }
    if ( (new Date(date) - new Date()) < 0) {//התאריך כבר עבר
        return res.status(400).json({ message: "too late" })
    }
    
    // const searchD = await teacher.dateforLessonsAndTests.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
    const searchD = await teacher.dateforLessonsAndTests.find((e) => 
        new Date(e.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );
    if (!searchD) {
        return res.status(400).json({ message: 'No Date found' })
    }
    const searchH = searchD.hours.find((e) => ((e.hour).toString()) === (hour))
    if (!searchH) {
        return res.status(400).json({ message: 'No Hour found in this Date' })
    }
    if (searchH.full === false) {
        return res.status(400).json({ message: 'This lesson already false' })
    }
    searchH.full = false
    searchH.studentId=null
    await teacher.save()

    // const searchD2 = await student.dateforLessonsAndTest.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))

    const searchD2 = student.dateforLessonsAndTest.find((e) => 
        new Date(e.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );
    if (!searchD2) {
        return res.status(400).json({ message: 'No Date found2' })
    }
    const searchH2 = (searchD2.hour).toString() === (hour)
    if (!searchH2) {
        return res.status(400).json({ message: 'No Hour found in this Date2' })
    }
    if (searchH2.full === false) {
        return res.status(400).json({ message: 'This lesson already false2' })
    }

    const tmp = student.dateforLessonsAndTest.indexOf(searchH2)
    student.dateforLessonsAndTest.splice(tmp, 1)
    student.lessonsRemaining = student.lessonsRemaining + 1
    student.lessonsLearned = student.lessonsLearned - 1
    await student.save()
    res.json({ teacher, student })


}

const testRequest = async (req, res) => {
    const { _id } = req.user
    const { date } = req.body
    if (!_id || !date) {
        return res.status(400).json({ message: "files are required" })
    }
    const student = await Student.findById({ _id }, { password: 0 }).lean()
    if (!student) {
        return res.status(400).json({ message: 'No student found' })
    }
    const teacherId = student.myTeacher
    const teacher = await Teacher.findById({ _id: teacherId }, { password: 0 }).exec()
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' })
    }
    if ( (new Date(date) - new Date()) <   7 * 24 * 60 * 60 * 1000) {//התאריך עוד פחות משבוע
        return res.status(400).json({ message: "too late" })
    }
    if ( (new Date(date) - new Date()) < 0) {//התאריך כבר עבר
        return res.status(400).json({ message: "too late" })
    }
    // const finddate = teacher.dateforLessonsAndTests.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
    // if (!finddate) {
    //     return res.status(400).json({ message: 'No date found' })
    // }
    // const oneOnDay = await student.dateforLessonsAndTest.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
    // if (oneOnDay) {
    //     return res.status(400).json({ message: 'You had alrady lesson in this day' })
    // }

    const finddate = teacher.dateforLessonsAndTests.find((e) => 
        new Date(e.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );
    if (!finddate) {
        return res.status(400).json({ message: 'No date found' });
    }
    
    const oneOnDay = student.dateforLessonsAndTest.find((e) => 
        new Date(e.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );
    if (oneOnDay) {
        return res.status(400).json({ message: 'You already had a lesson on this day' });
    }
    const newreq = { studentId: _id, date }
    teacher.listOfRequires = [...teacher.listOfRequires, newreq]
    await teacher.save()
    return res.status(200).json(teacher)

}


//לבדוק את מחיקת השעות מהמורה!!!!
const deleteStudent = async (req, res) => {
    const { _id } = req.user;
    const { studentID } = req.params;

    const student = await Student.findById(studentID, { password: 0 }).exec();
    if (!student) {
        return res.status(400).json({ message: 'student not found' });
    }

    const manager = await Manager.findById(_id, { password: 0 }).exec();
    const teacher = await Teacher.findById(_id, { password: 0 }).exec();

    if (teacher && student.myTeacher.toString() !== _id.toString()) {
        return res.status(400).json({ message: 'teacher not access' });
    }
    if (manager && student.area !== manager.area) {
        return res.status(400).json({ message: 'manager not access' });
    }

    if (student.myTeacher != null) {
        const teacherID = student.myTeacher;
        const teacher1 = await Teacher.findById(teacherID, { password: 0 }).exec();

        if (teacher1) {
            const currentDate = new Date();
            for (const d of student.dateforLessonsAndTest) {
                for (const l of teacher1.dateforLessonsAndTests) {
                    if (l.date > currentDate && d.date === l.date) {
                        for (const h of l.hours) {
                            if (h === d.hour) {
                                l.full = false;
                                await teacher1.save();
                            }
                        }
                    }
                }
            }

            teacher1.listOfStudent = teacher1.listOfStudent.filter(item => item.toString() !== student._id.toString());
            await teacher1.save();
        } else {
            return res.status(400).json({ message: 'Teacher not found' });
        }
    }
    const thisMyTeacher = student.myTeacher.toString()
    const teachersInArea = await Teacher.find({ area: student.area }, { password: 0 }).lean();
    await student.deleteOne();

    const studentInArea = await Student.find({ area: student.area }, { password: 0 }).lean();
    const studentByTeacher = await Student.find({ myTeacher: thisMyTeacher }, { password: 0 }).lean();

    return res.status(200).json({
        message: 'Student deleted successfully',
        teachersInArea: teachersInArea,
        studentInArea: studentInArea,
        studentByTeacher: studentByTeacher
    });
};

const changePassword = async (req, res) => {
    const { _id } = req.user
    const { oldPassword, newPassword } = req.body
    const student = await Student.findById(_id).exec();
    if (!student) {
        return res.status(400).json({ message: 'student not found' });
    }
    const match = await bcrypt.compare(oldPassword, student.password)
    if (!match) return res.status(401).json({ message: 'Incorrect password' })
    student.password = await bcrypt.hash(newPassword, 10)
    await student.save()
    return res.status(200).json({ message: 'Password changed successfully.' })
}


module.exports = {
    addStudent,
    getAllStudents,
    updateStudent,
    // choosingArea,
    getstudentById,
    teacherSelection,
    getmyteacher,
    addRecommendation,
    settingLesson,
    cancellationLesson,
    testRequest,
    deleteStudent,
    changePassword

}