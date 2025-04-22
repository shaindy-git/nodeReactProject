
const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
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
    if (doubleUserNameT || doubleUserNameM || doubleUserNameS) {
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
    const allStudents = await Student.find({ area: foundM.area }, { password: 0 }).sort({ firstName: 1, lastName: 1 }).lean()
    if (!allStudents?.length) {
        return res.status(400).json({ message: 'No students found' })

    }
    res.status(200).json(allStudents)
}



const updateStudent = async (req, res) => {
    const { _id } = req.user
    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, password } = req.body

    if (!_id || !firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !password) {
        return res.status(400).json({ message: 'fields are required' })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const student = await Student.findById(_id).exec()
    if (!student) {
        return res.status(400).json({ message: 'Student not found' })
    }

    student.firstName = firstName,
        student.lastName = lastName,
        student.userName = userName,
        student.numberID = numberID,
        student.dateOfBirth = dateOfBirth,
        student.phone = phone,
        student.email = email,
        student.password = hashedPwd,

        await student.save()
    //student=await Student.findById({_id},{password:0}).exec()
    const students = await Student.find({}, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
    console.log({ students, role: 'Student' })
    return res.status(200).json(student)

}

const choosingArea = async (req, res) => {
    const { _id } = req.user
    const { area } = req.body

    const cities = ["Jerusalem - Talpiot", "Jerusalem - Beit Hakerem", "Jerusalem - Ramot",
        "Jerusalem - Pisgat Zeev", "Tel Aviv - Center", "Tel Aviv - Arlozorov",
        "Tel Aviv - Dizengoff", "Tel Aviv - Balfour", "Petah Tikva - Center",
        "Herzliya - Pituach", "Netivot", "Haifa - Bat Galim", "Haifa - Kiryot", "Safed - David Elazar",
        "Tel Aviv - Kikar Hamedina", "Holon", "Beer Sheva", "Beit Shemesh - Ha'ir", "Bat Yam - Allenby", "Ramat Gan - Begin"]



    if (!area || !_id) {
        return res.status(400).json({ message: 'fields are required' })
    }
    if (!cities.includes(area)) {
        return res.status(400).json({ message: 'This area is not validate' })
    }
    const student = await Student.findById(_id).exec()
    if (!student) {
        return res.status(400).json({ message: 'Student not found' })
    }
    if (student.area != null) {
        return res.status(400).json({ message: 'You cant move area' })
    }
    student.area = area
    await student.save()
    // const students = await Student.find({},{password:0}).sort({ firstNane: 1, lastName: 1 }).lean()
    console.log({ area })
    return res.status(200).json(student)

}
//לא בדקנו
// const getstudentById = async (req, res) => {
//     const { _id } = req.user
//     const { id } = req.params
//     if (!id) {
//         return res.status(400).json({ message: "files are required" })
//     }

//     const student = await Student.findById({id},{password:0}).lean()
//     if(_id!=id && _id!=)
//     if (!student) {
//         return res.status(400).json({ message: 'No student found' })
//     }
//     res.json(student)
// }

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
    await student.save()
    res.json({ student, teacher })

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
    res.json(teacher)

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
    res.json({ teacher, recommend: rec })

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
    const searchD = await teacher.dateforLessonsAndTests.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
    if (!searchD) {
        return res.status(400).json({ message: 'No Date found' })
    }
    const oneOnDay = student.dateforLessonsAndTest.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
    if (oneOnDay) {
        return res.status(400).json({ message: 'You had alrady lesson in this day' })
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
    await teacher.save()

    const newDateAndHour = { date: date, hour: hour, typeOfHour: "Lesson" }
    student.dateforLessonsAndTest = [...student.dateforLessonsAndTest, newDateAndHour]
    student.lessonsRemaining = student.lessonsRemaining - 1
    student.lessonsLearned = student.lessonsLearned + 1
    await student.save()
    res.json({ teacher, student })

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
    const searchD = await teacher.dateforLessonsAndTests.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
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
    await teacher.save()

    const searchD2 = await student.dateforLessonsAndTest.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
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
    const finddate = teacher.dateforLessonsAndTests.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
    if (!finddate) {
        return res.status(400).json({ message: 'No date found' })
    }
    const oneOnDay = await student.dateforLessonsAndTest.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
    if (oneOnDay) {
        return res.status(400).json({ message: 'You had alrady lesson in this day' })
    }
    const newreq = { studentId: _id, date }
    teacher.listOfRequires = [...teacher.listOfRequires, newreq]
    await teacher.save()
    res.json(teacher)

}


//לבדוק את מחיקת השעות מהמורה!!!!
const deleteStudent = async (req, res) => {

    const { _id } = req.user;
    const { studentID } = req.body;

    const student = await Student.findById(studentID, { password: 0 }).exec();
    if (!student) {
        return res.status(400).json({ message: 'student not found' });
    }

    const manager = await Manager.findById(_id, { password: 0 }).exec();
    const teacher = await Teacher.findById(_id, { password: 0 }).exec();
    //מור ה אבל לא של התלמיד
    if (teacher && student.myTeacher.toString() !== _id.toString()) {
        return res.status(400).json({ message: 'teacher not access' });
    }
    //מנהל אבל לא של התלמיד
    if (manager && student.area !== manager.area) {
        return res.status(400).json({ message: 'manager not access' });
    }

    // if (!manager && !teacher && _id.toString() !== studentID.toString()) {
    //     return res.status(400).json({ message: 'no access' });
    // }

    if (student.myTeacher != null) {
        const teacherID = student.myTeacher;
        const teacher1 = await Teacher.findById(teacherID, { password: 0 }).exec();

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
    }



    await student.deleteOne();
    res.status(200).json({ message: 'Student deleted successfully' });

};

module.exports = {
    addStudent,
    getAllStudents,
    updateStudent,
    choosingArea,
    //getstudentById,
    teacherSelection,
    getmyteacher,
    addRecommendation,
    settingLesson,
    cancellationLesson,
    testRequest,
    deleteStudent

}