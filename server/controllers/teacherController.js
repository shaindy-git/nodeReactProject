const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
const { format, hoursToMinutes, getDate } = require("date-fns")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const addTeacher = async (req, res) => {
    //הפונקציה הזו רושמת את המורה עם הסיסמא המוצפנת שלו , כשהו הגיש את בקשת הרשמות קודדה הסיסמא לכן כעת לא
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

    // const doubleUserNameT = await Teacher.findOne({ userName: userName }).lean()
    //     const doubleUserNameM = await Manager.findOne({ userName: userName }).lean()
    //     const doubleUserNameS = await Student.findOne({ userName: userName }).lean()
    //     const allManagers = await Manager.find().exec();

    //     if (doubleUserNameT || doubleUserNameM || doubleUserNameS ) {
    //         return res.status(400).json({ message: "doubleUserName" })
    //     }
    if ((new Date() - new Date(dateOfBirth)) > 60 * 31536000000 || (new Date() - new Date(dateOfBirth)) < 40 * 31536000000) {//מציג את 1/1000 השניה בשנה
        return res.status(400).json({ message: "The age is not appropriate" })
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


    if (!foundItem) {

        return res.status(400).json({ message: "not reqest" })
    }
    console.log(foundItem);

    const teacher = await Teacher.create({
        firstName, lastName, userName, numberID, dateOfBirth, phone, email, password, area, gender
    })
    if (teacher) {

        maneger.RequestList = maneger.RequestList.filter(item => item !== foundItem);
        await maneger.save();
        const teachers = await Teacher.find({}, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
        // console.log({ maneger, teachers })
        return res.status(200).json(teacher)
    } else {
        return res.status(400).json({ message: 'Invalid Teacher ' })
    }

}



const getAllTeachers = async (req, res) => {

    const { _id, area } = req.user
    const foundM = await Manager.findOne({ _id }).lean()
    const foundT = await Teacher.findOne({ _id }).lean()
    const foundS = await Student.findOne({ _id }).lean()

    if (foundS) {
        return res.status(400).json({ message: 'No Access for Students' })
    }
    if (foundT) {

        return res.status(400).json({ message: 'No Access for Teachers' })
    }
    if (!foundM) {
        return res.status(400).json({ message: "No Access" })
    }
    if (!area) {
        return res.status(400).json({ message: "files are required" })
    }
    const teachers = await Teacher.find({ area: area }, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
    if (!teachers?.length) {
        return res.status(400).json({ message: 'No teachers found' })
    }
    res.status(200).json(teachers)
}


// const deleteTeacher = async (req, res) => {
//     const { _id } = req.user
//     const { idTeacher } = req.body

//     const manneger = await Manager.findById({ _id }, { password: 0 }).exec()
//     const teacher = await Teacher.findById({ _id: idTeacher }, { password: 0 }).exec()

//     if (!manneger) {
//         return res.status(400).json({ message: 'manneger not found' })
//     }

//     if (!teacher) {
//         return res.status(400).json({ message: 'teacher not found' })
//     }
//     if (teacher.area != manneger.area) {
//         return res.status(400).json({ message: 'No Access for this manneger' })
//     }
//     if (teacher.listOfStudent?.length) {
//         const newteacher = await Teacher.findOne({ area: { $eq: teacher.area }, _id: { $ne: teacher._id } }, { _id: 1, listOfStudent: 1 }).exec()

//         console.log(newteacher._id);
//         const student = await Student.find({ myTeacher: idTeacher }).sort({ firstNane: 1, lastName: 1 }).exec()
//         if (student?.length) {
//             const student_id = await Student.find({ myTeacher: idTeacher }, { _id: 1 }).sort({ firstNane: 1, lastName: 1 }).lean()
//             console.log(student_id)


//             student.map(async s => {
//                 newteacher.listOfStudent.push(s._id)
//                 s.myTeacher = newteacher
//                 lesonns = s.dateforLessonsAndTest
//                 lesonns.forEach(async l => {
//                     if (((l.date)) > ((new Date()))) {
//                         s.lessonsLearned = s.lessonsLearned - 1
//                         s.lessonsRemaining = s.lessonsRemaining + 1

//                     }
//                 });
//                 s.dateforLessonsAndTest = [];
//                 await s.save()

//             });

//         }

//         await newteacher.save()
//     }

//     await teacher.deleteOne()
//     res.status(200).json(await Teacher.find({ area: manneger.area }, { password: 0 }).lean())

// }


const deleteTeacher = async (req, res) => {
    try {
        const { _id } = req.user;
        const { idTeacher } = req.body;

        const manneger = await Manager.findById(_id, { password: 0 }).exec();
        if (!manneger) {
            return res.status(400).json({ message: 'Manager not found' });
        }

        const teacher = await Teacher.findById(idTeacher, { password: 0 }).exec();
        if (!teacher) {
            return res.status(400).json({ message: 'Teacher not found' });
        }

        if (teacher.area !== manneger.area) {
            return res.status(403).json({ message: 'No access to this teacher' });
        }

        // אם יש לתלמיד תלמידים, חובה לבדוק האם יש מורה חילופי
        if (teacher.listOfStudent?.length) {
            const newteacher = await Teacher.findOne({
                area: teacher.area,
                _id: { $ne: teacher._id },
            }, { _id: 1, listOfStudent: 1 }).exec();

            if (!newteacher) {
                return res.status(400).json({ message: 'Cannot delete teacher: No alternative teacher available for student transfer.' });
            }

            const students = await Student.find({ myTeacher: idTeacher }).sort({ firstName: 1, lastName: 1 }).exec();

            for (const s of students) {
                newteacher.listOfStudent.push(s._id);
                s.myTeacher = newteacher._id;


                if (Array.isArray(s.dateforLessonsAndTest)) {
                    s.dateforLessonsAndTest = s.dateforLessonsAndTest.filter(l => {
                        const isFuture = new Date(l.date) > new Date();
                        if (isFuture) {
                            s.lessonsLearned -= 1;
                            s.lessonsRemaining += 1;
                        }
                        return false;
                    });
                }

                await s.save();
            }

            await newteacher.save();
        }

        await teacher.deleteOne();

        const teachersInArea = await Teacher.find({ area: manneger.area }, { password: 0 }).lean();
        return res.status(200).json(teachersInArea);

    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Unexpected server error' });
    }
};


const updateTeacher = async (req, res) => {
    const { _id } = req.user
    const { firstName, lastName, userName, phone, email } = req.body

    if (!_id || !firstName || !lastName || !userName || !phone || !email) {

        return res.status(400).json({ message: 'fields are required' })
    }
    let teacher = await Teacher.findById(_id).exec()
    if (!teacher) {
        return res.status(400).json({ message: 'Teacher not found' })
    }

    const doubleUserNameT = await Teacher.findOne({
        userName: userName,
        _id: { $ne: _id }
    }).lean()
    const doubleUserNameM = await Manager.findOne({ userName: userName }).lean()
    const doubleUserNameS = await Student.findOne({ userName: userName }).lean()
    const allManagers = await Manager.find().exec();
    const userExistsInRequests = allManagers.some(manager =>
        manager.RequestList.some(request => request.userName === userName)
    );
    if (doubleUserNameT || doubleUserNameM || doubleUserNameS || userExistsInRequests) {
        return res.status(400).json({ message: "doubleUserName" })
    }

    teacher.firstName = firstName,
        teacher.lastName = lastName,
        teacher.userName = userName,
        teacher.phone = phone,
        teacher.email = email,


        await teacher.save()
    teacher = await Teacher.findById({ _id }, { password: 0 }).exec()
    const teachers = await Teacher.find({}, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
    console.log({ teachers, role: 'Teacher' })
    return res.status(200).json(teacher)

}

const getTeacherById = async (req, res) => {
    const { id } = req.params
    const teacher = await Teacher.findById(id, { password: 0 }).lean()

    if (!teacher) {
        return res.status(400).json({ message: 'teacher not found' })
    }
    console.log(teacher.firstName);

    return res.status(200).json({ firstName: teacher.firstName, lastName: teacher.lastName });
}

// const addAvailableClasses = async (req, res) => {
//     const { _id } = req.user
//     const { date, hour } = req.body
//     if (!_id || !date || !hour) {
//         return res.status(400).json({ message: "files are required" })
//     }
//     const teacher = await Teacher.findById({ _id }, { password: 0 }).exec()
//     if (!teacher) {
//         return res.status(400).json({ message: 'No teacher found' })
//     }
//     // const search = await teacher.dateforLessonsAndTests.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
//     const search = await teacher.dateforLessonsAndTests.find((e) => (e.date) === (new Date(date)))
//     // אם התאריך כבר קיים תוסיף את השעה לתאריך הנוכחי
//     if (search) {
//         console.log("serch");
//         const h = search.hours.find((e) => ((e.hour).toString()) === (hour))
//         console.log(h, "The day alredy");
//         if (!h) {
//             console.log("inc");
//             search.hours = [...search.hours, { hour: hour }]

//         } else {
//             console.log("The day and Hour alredy")
//         }

//     }
//     //אם התאריך לא קיים תיצור את התאריך ותוסיף לו את השעה
//     else {
//         const newDateAndHour = { date: date, hours: [{ hour: hour }] }
//         console.log(newDateAndHour);
//         teacher.dateforLessonsAndTests = [...teacher.dateforLessonsAndTests, newDateAndHour]
//     }
//     await teacher.save()
//     return res.status(200).json(teacher)
// }

const addAvailableClasses = async (req, res) => {
    const { _id } = req.user;
    const { date, hour } = req.body;

    if (!_id || !date || !hour) {
        return res.status(400).json({ message: "files are required" });
    }

    const teacher = await Teacher.findById({ _id }, { password: 0 }).exec();
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' });
    }

    // כאן תשתמש באובייקט Date מהשדה שנשלח
    const validDate = new Date(date);

    const search = teacher.dateforLessonsAndTests.find((e) => e.date.toISOString() === validDate.toISOString());

    if (search) {
        const h = search.hours.find((e) => e.hour.toString() === hour);
        if (!h) {
            search.hours.push({ hour: hour });
        }
    } else {
        const newDateAndHour = { date: validDate, hours: [{ hour: hour }] }
        teacher.dateforLessonsAndTests.push(newDateAndHour);
    }

    await teacher.save();
    return res.status(200).json(teacher);
}

const getClasses = async (req, res) => {
    const { _id } = req.user;

    if (!_id) {
        return res.status(400).json({ message: "files are required" });
    }

    const teacher = await Teacher.findById({ _id }, { password: 0 }).exec();
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' });
    }
    
    return res.status(200).json(teacher.dateforLessonsAndTests);
}

const settingTest = async (req, res) => {
    const { _id } = req.user
    const { studentId, date, hour } = req.body
    if (!studentId || !date || !hour) {
        return res.status(400).json({ message: "files are required" })
    }
    const student = await Student.findById({ _id: studentId }, { password: 0 }).exec()
    if (!student) {
        return res.status(400).json({ message: 'No student found' })
    }
    const teacher = await Teacher.findById({ _id }, { password: 0 }).exec()
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' })
    }
    if (student.myTeacher != _id) {
        return res.status(400).json({ message: 'No Access' })
    }
    const listreq = teacher.listOfRequires
    let req1
    const searchD = await teacher.dateforLessonsAndTests.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
    if (!searchD) {
        return res.status(400).json({ message: 'No Date found' })
    }
    const oneOnDay = await student.dateforLessonsAndTest.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))

    if (oneOnDay) {
        listreq.forEach(r => {
            if (r.studentId === studentId && r.date === date) {
                req1 = r
                return
            }
        });

        const tmp = teacher.listOfRequires.indexOf(req1)
        teacher.listOfRequires.splice(tmp, 1)
        await teacher.save()
        return res.status(400).json({ message: 'The student had alrady lesson in this day' })
    }
    const searchH = searchD.hours.find((e) => ((e.hour).toString()) === (hour))
    if (!searchH) {
        listreq.forEach(r => {
            if (r.studentId === studentId && r.date === date) {
                req1 = r
                return
            }
        });

        const tmp = teacher.listOfRequires.indexOf(req1)
        teacher.listOfRequires.splice(tmp, 1)
        await teacher.save()
        return res.status(400).json({ message: 'No Hour found in this Date' })
    }
    if (searchH.full === true) {
        return res.status(400).json({ message: 'The Hour is full' })
    }
    searchH.full = true
    searchH.typeOfHour = "Test"


    const newDateAndHour = { date: date, hour: hour, typeOfHour: "Test" }
    student.dateforLessonsAndTest = [...student.dateforLessonsAndTest, newDateAndHour]


    listreq.forEach(r => {
        if (r.studentId === studentId && r.date === date) {
            req1 = r
            return
        }
    });

    const tmp = teacher.listOfRequires.indexOf(req1)
    teacher.listOfRequires.splice(tmp, 1)
    await teacher.save()
    await student.save()


    res.status(200).json({ teacher, student })

}
const addLessonToStudent = async (req, res) => {
    const { _id } = req.user
    const { studentId } = req.body
    if (!_id || !studentId) {
        return res.status(400).json({ message: "files are required" })
    }
    const student = await Student.findById(studentId).exec()
    if (!student) {
        return res.status(400).json({ message: "student is not found" })
    }
    if (student.myTeacher != _id) {
        return res.status(400).json({ message: "No Access" })
    }
    student.lessonsRemaining = student.lessonsRemaining + 1
    student.save()
    return res.status(200).json(student)


}

module.exports = {
    addTeacher,
    getAllTeachers,
    deleteTeacher,
    updateTeacher,
    getTeacherById,
    addAvailableClasses, //לא מימשנו
    settingTest, //לא מימשנו
    addLessonToStudent,
    getClasses



}