const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
const Admin = require("../models/Admin")
const { format, hoursToMinutes, getDate } = require("date-fns")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const addTeacher = async (req, res) => {
    //הפונקציה הזו רושמת את המורה עם הסיסמא המוצפנת שלו , כשהו הגיש את בקשת הרשמות קודדה הסיסמא לכן כעת לא
    const { _id, role } = req.user
    if (!_id || !role) {
        return res.status(400).json({ message: "files are required" })
    }
    if (role != 'M') {
        return res.status(400).json({ message: 'no accsess' })
    }
    const maneger = await Manager.findOne({ _id: _id }).exec()
    if (!maneger) {
        return res.status(400).json({ message: "maneger not found" })
    }

    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, password, area, gender } = req.body

    if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !password || !area || !gender) {
        return res.status(400).json({ message: "files are required" })
    }
    // const cities = ["Jerusalem - Talpiot", "Jerusalem - Beit Hakerem", "Jerusalem - Ramot",
    //     "Jerusalem - Pisgat Zeev", "Tel Aviv - Center", "Tel Aviv - Arlozorov",
    //     "Tel Aviv - Dizengoff", "Tel Aviv - Balfour", "Petah Tikva - Center",
    //     "Herzliya - Pituach", "Netivot", "Haifa - Bat Galim", "Haifa - Kiryot", "Safed - David Elazar",
    //     "Tel Aviv - Kikar Hamedina", "Holon", "Beer Sheva", "Beit Shemesh - Ha'ir", "Bat Yam - Allenby", "Ramat Gan - Begin"]

    const genders = ["male", "female"]

    // if (!cities.includes(area)) {
    //     return res.status(400).json({ message: 'This area is not validate' })
    // }
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
        const teachers = await Teacher.find({area:maneger.area}, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
        // console.log({ maneger, teachers })
        return res.status(200).json({ teacher: teacher, teachers: teachers })
    } else {
        return res.status(400).json({ message: 'Invalid Teacher ' })
    }

}



// const getAllTeachers = async (req, res) => {

//     const { _id } = req.user
//     const { gender, area } = req.body
//     const foundM = await Manager.findOne({ _id }).lean()
//     const foundT = await Teacher.findOne({ _id }).lean()
//     const foundS = await Student.findOne({ _id }).lean()

//     if (foundS) {
//         if (gender&&area) {
//             const teachers = await Teacher.find({ area: area, gender: gender }, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
//             if (!teachers?.length) {
//                 return res.status(400).json({ message: 'No teachers found' })
//             }
//             res.status(200).json(teachers)
//         }
//         const teachers = await Teacher.find({ area: area }, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
//         if (!teachers?.length) {
//             return res.status(400).json({ message: 'No teachers found' })
//         }
//         res.status(200).json(teachers)
//     }
//     if (foundT) {

//         return res.status(400).json({ message: 'No Access for Teachers' })
//     }
//     if (!foundM) {
//         return res.status(400).json({ message: "No Access" })
//     }
//     // if (!area) {
//     //     return res.status(400).json({ message: "files are required" })
//     // }
//     const teachers = await Teacher.find({ area: foundM.area }, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
//     if (!teachers?.length) {
//         return res.status(400).json({ message: 'No teachers found' })
//     }
//     res.status(200).json(teachers)
// }

const getAllTeachers = async (req, res) => {
    const { _id, role } = req.user;
    const { gender, area } = req.query; // area כאן לא נדרש למנהל

    if (!_id || !role) {
        return res.status(400).json({ message: "files are required" });
    }

    // אם המשתמש הוא תלמיד
    if (role === 'S') {
        const foundS = await Student.findOne({ _id }).lean();
        if (foundS) {
            let query = {};
            if (gender) query.gender = gender;
            if (area) query.area = area;

            const teachers = await Teacher.find(query, { password: 0 })
                .sort({ firstName: 1, lastName: 1 })
                .lean();

            if (!teachers?.length) {
                return res.status(400).json({ message: 'No teachers found' });
            }
            return res.status(200).json(teachers);
        }
    }

    // אם המשתמש הוא מורה
    if (role === 'T') {
        return res.status(400).json({ message: 'No Access for Teachers' });
    }

    // אם המשתמש הוא מנהל
    if (role === 'M') {
        const foundM = await Manager.findOne({ _id }).lean();
        if (!foundM) {
            return res.status(400).json({ message: "No Access" });
        }

        // שליפת מורים רק מהאזור של המנהל המחובר
        const teachers = await Teacher.find({ area: foundM.area }, { password: 0 })
            .sort({ firstName: 1, lastName: 1 })
            .lean();

        if (!teachers?.length) {
            return res.status(400).json({ message: 'No teachers found for your area' });
        }

        return res.status(200).json(teachers);
    }

    // אם התפקיד אינו מוכר
    return res.status(400).json({ message: "No Access" });
};

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


// const deleteTeacher = async (req, res) => {
//     try {
//         const { _id } = req.user;
//         const { idTeacher } = req.params;

//         const manneger = await Manager.findById(_id, { password: 0 }).exec();
//         if (!manneger) {
//             return res.status(400).json({ message: 'Manager not found' });
//         }

//         const teacher = await Teacher.findById(idTeacher, { password: 0 }).exec();
//         if (!teacher) {
//             return res.status(400).json({ message: 'Teacher not found' });
//         }

//         if (teacher.area !== manneger.area) {
//             return res.status(403).json({ message: 'No access to this teacher' });
//         }

//         // אם יש לתלמיד תלמידים, חובה לבדוק האם יש מורה חילופי
//         if (teacher.listOfStudent?.length) {
//             const newteacher = await Teacher.findOne({
//                 area: teacher.area,
//                 _id: { $ne: teacher._id },
//             }, { _id: 1, listOfStudent: 1 }).exec();

//             if (!newteacher) {
//                 return res.status(400).json({ message: 'Cannot delete teacher: No alternative teacher available for student transfer.' });
//             }

//             const students = await Student.find({ myTeacher: idTeacher }).sort({ firstName: 1, lastName: 1 }).exec();

//             for (const s of students) {
//                 newteacher.listOfStudent.push(s._id);
//                 s.myTeacher = newteacher._id;


//                 if (Array.isArray(s.dateforLessonsAndTest)) {
//                     s.dateforLessonsAndTest = s.dateforLessonsAndTest.filter(l => {
//                         const isFuture = new Date(l.date) > new Date();
//                         if (isFuture) {
//                             s.lessonsLearned -= 1;
//                             s.lessonsRemaining += 1;
//                         }
//                         return false;
//                     });
//                 }

//                 await s.save();
//             }

//             await newteacher.save();
//         }

//         await teacher.deleteOne();

//         const teachersInArea = await Teacher.find({ area: manneger.area }, { password: 0 }).lean();
//         const studentInArea = await Student.find({ area: manneger.area }, { password: 0 }).lean();
//         return res.status(200).json({ teachersInArea: teachersInArea, studentInArea: studentInArea });

//     } catch (err) {
//         console.error('Unexpected error:', err);
//         return res.status(500).json({ message: 'Unexpected server error' });
//     }
// };


const deleteTeacher = async (req, res) => {
    try {
        const { _id, role } = req.user; // מזהה המנהל
        const { idTeacher } = req.params; // מזהה המורה למחיקה
        if (!_id || !role || !idTeacher) {
            return res.status(400).json({ message: "files are required" })
        }
        if (role != 'M') {
            return res.status(400).json({ message: 'no accsess' })
        }
        // בדיקת קיום מנהל
        const manager = await Manager.findById(_id, { password: 0 }).exec();
        if (!manager) {
            return res.status(400).json({ message: 'Manager not found' });
        }

        // בדיקת קיום המורה
        const teacher = await Teacher.findById(idTeacher, { password: 0 }).exec();
        if (!teacher) {
            return res.status(400).json({ message: 'Teacher not found' });
        }

        // בדיקת הרשאות: האם המורה באותו אזור של המנהל
        if (teacher.area !== manager.area) {
            return res.status(403).json({ message: 'No access to this teacher' });
        }

        // טיפול במקרה של מורה עם תלמידים
        if (teacher.listOfStudent?.length) {
            const alternativeTeacher = await Teacher.findOne({
                area: teacher.area,
                _id: { $ne: teacher._id },
            })
                .sort({ listOfStudent: 1 }) // למצוא את המורה עם הכי מעט תלמידים
                .exec();

            if (!alternativeTeacher) {
                return res.status(400).json({ message: 'Cannot delete teacher: No alternative teacher available for student transfer.' });
            }

            const students = await Student.find({ myTeacher: idTeacher }).exec();

            for (const student of students) {
                alternativeTeacher.listOfStudent.push(student._id);
                student.myTeacher = alternativeTeacher._id;

                if (Array.isArray(student.dateforLessonsAndTest)) {
                    const futureLessons = student.dateforLessonsAndTest.filter((lesson) => {
                        const isFuture = new Date(lesson.date) > new Date();
                        if (isFuture && lesson.typeOfHour === 'Lesson') {
                            student.lessonsRemaining += 1;
                            student.lessonsLearned -= 1;
                        }
                        return false;
                    });

                    student.dateforLessonsAndTest = [];
                }

                student.test = 'false';
                await student.save();
            }

            await alternativeTeacher.save();
        }

        await teacher.deleteOne();

        const teachersInArea = await Teacher.find({ area: manager.area }, { password: 0 }).lean();
        const studentsInArea = await Student.find({ area: manager.area }, { password: 0 }).lean();

        return res.status(200).json({
            message: 'Teacher successfully deleted',
            teachersInArea: teachersInArea,
            studentsInArea: studentsInArea
        });
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
    const doubleUserNameA = await Admin.findOne({ userName: userName }).lean()
    const allManagers = await Manager.find().exec();
    const userExistsInRequests = allManagers.some(manager =>
        manager.RequestList.some(request => request.userName === userName)
    );
    if (doubleUserNameT || doubleUserNameM || doubleUserNameS || doubleUserNameA || userExistsInRequests) {
        return res.status(400).json({ message: "doubleUserName" })
    }

    teacher.firstName = firstName,
        teacher.lastName = lastName,
        teacher.userName = userName,
        teacher.phone = phone,
        teacher.email = email,


        await teacher.save()
    teacher = await Teacher.findById({ _id }, { password: 0 }).exec()
    // const teachers = await Teacher.find({}, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()
    // console.log({ teachers, role: 'Teacher' })
    // return res.status(200).json(teacher)
    const TInfo = {
        _id: teacher._id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        userName: teacher.userName,
        numberID: teacher.numberID,
        dateOfBirth: teacher.dateOfBirth,
        phone: teacher.phone,
        email: teacher.email,
        area: teacher.area,
        gender: teacher.gender,
        role: "T"
    }
    const accessToken = jwt.sign(TInfo, process.env.ACCESS_TOKEN_SECRET)
    return res.status(200).json({ accessToken: accessToken, role: TInfo.role })

}

const getTeacherById = async (req, res) => {
    const { _id, role } = req.user//של המבקש
    const { id } = req.params//של הסטודנט
    if (!_id || !role || !id) {
        return res.status(400).json({ message: "files are required" })
    }
    if (role === 'S') {
        const student = await Student.findOne({ _id: _id, myTeacher: id },{password:0}).lean()
        if (!student) {
            return res.status(400).json({ message: "no accsess" })
        }
    }
    const teacher = await Teacher.findById(id, { password: 0 }).lean()
    if (!teacher) {
        return res.status(400).json({ message: 'teacher not found' })
    }
    if (role === 'M') {
        const manager = await Manager.findOne({ _id: _id, area: teacher.area },{password:0}).lean()
        if (!manager) {
            return res.status(400).json({ message: "no accsess" })
        }
    }
    if (role === 'T' && teacher._id != id) {
        return res.status(400).json({ message: "no accsess" })
    }
    console.log(teacher.firstName);

    return res.status(200).json({teacher:teacher, firstName: teacher.firstName, lastName: teacher.lastName });
}


const addAvailableClasses = async (req, res) => {
    const { _id, role } = req.user;
    const { date, hour } = req.body;

    if (!_id || !date || !hour || !role) {
        return res.status(400).json({ message: "files are required" });
    }
    if (role != 'T') {
        return res.status(400).json({ message: "no accsess" })
    }

    const teacher = await Teacher.findById(_id, { password: 0 }).exec();
    if (!teacher) {
        console.log("1");

        return res.status(404).json({ message: 'No teacher found' });
    }

    if ((new Date(date) - new Date()) < 7 * 24 * 60 * 60 * 1000) {//התאריך עוד פחות משבוע
        return res.status(400).json({ message: "too late" })
    }
    if ((new Date(date) - new Date()) < 0) {//התאריך כבר עבר
        return res.status(400).json({ message: "too late" })
    }

    const validDate = new Date(date);
    if (isNaN(validDate)) {
        console.log("2");
        return res.status(400).json({ message: "Invalid date format" });
    }

    const search = teacher.dateforLessonsAndTests.find((e) =>
        new Date(e.date).toISOString().split('T')[0] === validDate.toISOString().split('T')[0]
    );

    if (search) {
        const hourExists = search.hours.find((e) => e.hour === hour);
        if (!hourExists) {
            search.hours.push({ hour: hour });
        }
    } else {
        const newDateAndHour = { date: validDate, hours: [{ hour: hour }] };
        teacher.dateforLessonsAndTests.push(newDateAndHour);
    }

    await teacher.save();
    return res.status(200).json(teacher);

};


// const getAllDatesWithClasses = async (req, res) => {
//     const { _id } = req.user;

//     if (!_id) {
//         return res.status(400).json({ message: "Teacher ID is required" });
//     }


//     const teacher = await Teacher.findById(_id, { dateforLessonsAndTests: 1 }).lean();
//     if (!teacher) {
//         return res.status(404).json({ message: "Teacher not found" });
//     }

//     // שליפת כל התאריכים
//     const selectedDates = teacher.dateforLessonsAndTests.map(e => e.date);
//     if (!selectedDates) {
//         return res.status(400).json({ message: "Not Lessons" })
//     }

//     return res.status(200).json({ dates: selectedDates });



// };


const getAllDatesWithClasses = async (req, res) => {
    const { _id, role } = req.user;



    if (!_id || !role) {
        console.log("1");
        console.error("files are is required");
        return res.status(400).json({ message: "files are is required" });
    }
    if (role != 'T') {
        return res.status(400).json({ message: "no accsess" })
    }

    const teacher = await Teacher.findById(_id, { dateforLessonsAndTests: 1 }).lean();
    if (!teacher) {
        console.log("2");
        console.error("Teacher not found:", _id);
        return res.status(404).json({ message: "Teacher not found" });
    }

    // שליפת כל התאריכים
    if (!Array.isArray(teacher.dateforLessonsAndTests)) {
        console.log("3");
        console.error("dateforLessonsAndTests is not an array:", teacher.dateforLessonsAndTests);
        return res.status(400).json({ message: "Not Lessons" });
    }

    const selectedDates = teacher.dateforLessonsAndTests.map(e => e.date);
    if (!selectedDates || selectedDates.length === 0) {
        console.log("4");
        console.error("No dates found in dateforLessonsAndTests");
        return res.status(400).json({ message: "No Lessons or Tests Found" });
    }

    console.log("Selected dates:", selectedDates);
    return res.status(200).json({ dates: selectedDates });
};


const getClassesByDate = async (req, res) => {
    const { _id ,role} = req.user; // מזהה המורה מהמשתמש המחובר
    const { date } = req.params; // תאריך שנשלח בבקשה

    // בדיקת תקינות הפרמטרים
    if (!_id || !date||!role) {
        console.log("1");

        return res.status(400).json({ message: "files are required" });
    }
    if (role != 'T') {
        return res.status(400).json({ message: "no accsess" })
    }

    // שליפת המורה עם שדה dateforLessonsAndTests בלבד
    const teacher = await Teacher.findById(_id, { dateforLessonsAndTests: 1 }).exec();
    if (!teacher) {
        console.log("2");
        return res.status(404).json({ message: 'No teacher found' });
    }

    // חיפוש תאריך ספציפי במערך
    const lessonsOnDate = teacher.dateforLessonsAndTests.filter((e) => {
        const dbDate = new Date(e.date).toISOString().split('T')[0]; // רק התאריך
        const requestDate = new Date(date).toISOString().split('T')[0]; // רק התאריך
        return dbDate === requestDate;
    });

    // בדיקה אם נמצאו שיעורים
    if (!lessonsOnDate || lessonsOnDate.length === 0) {
        console.log("3");
        return res.status(404).json({ message: 'No lessons or tests found on this date' });
    }

    // חילוץ רשימת השעות מתוך השיעורים באותו יום
    const hoursFull = lessonsOnDate
        .flatMap(e => e.hours.filter(h => h.full === true).map(h => h.hour));
    const hoursEmpty = lessonsOnDate
        .flatMap(e => e.hours.filter(h => h.full === false).map(h => h.hour));
    console.log(hoursFull, hoursEmpty);

    // החזרת השעות בלבד
    if (!hoursFull || !hoursEmpty) {
        console.log("5");
        return res.status(404).json({ message: 'No lessons or tests found on this date' });
    }
    return res.status(200).json({ hoursFull: hoursFull, hoursEmpty: hoursEmpty });

};



// const settingTest = async (req, res) => {
//     const { _id } = req.user
//     const { studentId, date, hour } = req.body
//     if (!studentId || !date || !hour) {
//         return res.status(400).json({ message: "files are required" })
//     }
//     const student = await Student.findById({ _id: studentId }, { password: 0 }).exec()
//     if (!student) {
//         return res.status(400).json({ message: 'No student found' })
//     }
//     const teacher = await Teacher.findById({ _id }, { password: 0 }).exec()
//     if (!teacher) {
//         return res.status(400).json({ message: 'No teacher found' })
//     }
//     if (student.myTeacher != _id) {
//         return res.status(400).json({ message: 'No Access' })
//     }

//     if ((new Date(date) - new Date()) < 7 * 24 * 60 * 60 * 1000) {//התאריך עוד פחות משבוע
//         return res.status(400).json({ message: "too late" })
//     }
//     if ((new Date(date) - new Date()) < 0) {//התאריך כבר עבר
//         return res.status(400).json({ message: "too late" })
//     }
//     const listreq = teacher.listOfRequires
//     let req1
//     // const searchD = await teacher.dateforLessonsAndTests.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))
//     // if (!searchD) {
//     //     return res.status(400).json({ message: 'No Date found' })
//     // }
//     // const oneOnDay = await student.dateforLessonsAndTest.find((e) => ((e.date).toISOString()) === ((new Date(date)).toISOString()))

//     const searchD = teacher.dateforLessonsAndTests.find((e) =>
//         new Date(e.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
//     );
//     if (!searchD) {
//         return res.status(400).json({ message: 'No Date found' });
//     }

//     const oneOnDay = student.dateforLessonsAndTest.find((e) =>
//         new Date(e.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
//     );
//     if (oneOnDay) {
//         return res.status(400).json({ message: 'You already had a lesson on this day' });
//     }

//     if (oneOnDay) {
//         listreq.forEach(r => {
//             if (r.studentId === studentId && r.date === date) {
//                 req1 = r
//                 return
//             }
//         });

//         const tmp = teacher.listOfRequires.indexOf(req1)
//         teacher.listOfRequires.splice(tmp, 1)
//         await teacher.save()
//         return res.status(400).json({ message: 'The student had alrady lesson in this day' })
//     }
//     const searchH = searchD.hours.find((e) => ((e.hour).toString()) === (hour))
//     if (!searchH) {
//         listreq.forEach(r => {
//             if (r.studentId === studentId && r.date === date) {
//                 req1 = r
//                 return
//             }
//         });

//         const tmp = teacher.listOfRequires.indexOf(req1)
//         teacher.listOfRequires.splice(tmp, 1)
//         await teacher.save()
//         return res.status(400).json({ message: 'No Hour found in this Date' })
//     }
//     if (searchH.full === true) {
//         return res.status(400).json({ message: 'The Hour is full' })
//     }
//     searchH.full = true
//     searchH.typeOfHour = "Test"


//     const newDateAndHour = { date: date, hour: hour, typeOfHour: "Test" }
//     student.dateforLessonsAndTest = [...student.dateforLessonsAndTest, newDateAndHour]


//     listreq.forEach(r => {
//         if (r.studentId === studentId && r.date === date) {
//             req1 = r
//             return
//         }
//     });

//     const tmp = teacher.listOfRequires.indexOf(req1)
//     teacher.listOfRequires.splice(tmp, 1)
//     await teacher.save()
//     await student.save()


//     res.status(200).json({ teacher, student })

// }

// const settingTest = async (req, res) => {
//     const { _id } = req.user;
//     const { studentId, date } = req.body;

//     if (!studentId || !date) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     const student = await Student.findById({ _id: studentId }).exec();
//     if (!student) {
//         return res.status(400).json({ message: 'No student found' });
//     }

//     const teacher = await Teacher.findById({ _id }).exec();
//     if (!teacher) {
//         return res.status(400).json({ message: 'No teacher found' });
//     }

//     if (student.myTeacher != _id) {
//         return res.status(403).json({ message: 'No Access' });
//     }

//     const currentDate = new Date();
//     const requestedDate = new Date(date);

//     if ((requestedDate - currentDate) < 7 * 24 * 60 * 60 * 1000) {
//         return res.status(400).json({ message: "The date is too close" });
//     }

//     if (requestedDate < currentDate) {
//         return res.status(400).json({ message: "The date has already passed" });
//     }

//     const searchD = teacher.dateforLessonsAndTests.find((e) =>
//         new Date(e.date).toISOString().split('T')[0] === requestedDate.toISOString().split('T')[0]
//     );

//     if (!searchD) {
//         return res.status(400).json({ message: 'No available date found for the teacher' });
//     }

//     const oneOnDay = student.dateforLessonsAndTest.find((e) =>
//         new Date(e.date).toISOString().split('T')[0] === requestedDate.toISOString().split('T')[0]
//     );

//     if (oneOnDay) {
//         return res.status(400).json({ message: 'The student already has a lesson on this day' });
//     }

//     const searchH = searchD.hours.find((e) => e.hour === hour);
//     if (!searchH || searchH.full) {
//         return res.status(400).json({ message: 'The hour is unavailable' });
//     }

//     // Update hour
//     searchH.full = true;
//     searchH.typeOfHour = "Test";
//     searchH.studentId=studentId;

//     // Add the lesson/test to the student's schedule
//     student.dateforLessonsAndTest.push({
//         date: requestedDate,
//         hour: hour,
//         typeOfHour: "Test",
//     });

//     student.test="test"

//     // Remove the request from the teacher's list
//     teacher.listOfRequires = teacher.listOfRequires.filter(req =>
//         req.studentId.toString() !== studentId || new Date(req.date).toISOString() !== requestedDate.toISOString()
//     );

//     await teacher.save();
//     await student.save();

//     res.status(200).json({listOfRequires:teacher.listOfRequires});
// };

const settingTest = async (req, res) => {
    try {
        const { _id ,role} = req.user; // מזהה המורה
        const { studentId, date } = req.body; // מזהה התלמיד והתאריך המבוקש

        if (!studentId || !date||!_id||!role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (role != 'T') {
            return res.status(400).json({ message: "no accsess" })
        }
        // מציאת התלמיד
        const student = await Student.findById(studentId).exec();
        if (!student) {
            return res.status(400).json({ message: 'No student found' });
        }

        // מציאת המורה
        const teacher = await Teacher.findById(_id).exec();
        if (!teacher) {
            return res.status(400).json({ message: 'No teacher found' });
        }

        // בדיקת הרשאות: האם התלמיד שייך למורה
        if (student.myTeacher.toString() !== _id.toString()) {
            return res.status(403).json({ message: 'No Access' });
        }

        const currentDate = new Date();
        const requestedDate = new Date(date);

        // בדיקה: האם התאריך קרוב מדי (פחות משבוע)
        if ((requestedDate - currentDate) < 7 * 24 * 60 * 60 * 1000) {
            return res.status(400).json({ message: "The date is too close" });
        }

        // בדיקה: האם התאריך כבר עבר
        if (requestedDate < currentDate) {
            return res.status(400).json({ message: "The date has already passed" });
        }

        // חיפוש יום פנוי בלוח הזמנים של המורה
        const searchD = teacher.dateforLessonsAndTests.find((e) =>
            new Date(e.date).toISOString().split('T')[0] === requestedDate.toISOString().split('T')[0]
        );

        if (!searchD) {
            return res.status(400).json({ message: 'No available date found for the teacher' });
        }

        // בדיקה: האם התלמיד כבר קבע שיעור באותו היום
        const oneOnDay = student.dateforLessonsAndTest.find((e) =>
            new Date(e.date).toISOString().split('T')[0] === requestedDate.toISOString().split('T')[0]
        );

        if (oneOnDay) {
            return res.status(400).json({ message: 'The student already has a lesson on this day' });
        }

        // מציאת שעה פנויה באותו היום
        const availableHour = searchD.hours.find((hour) => !hour.full);
        if (!availableHour) {
            return res.status(400).json({ message: 'No available hours on this date' });
        }

        // עדכון השעה כמלאה
        availableHour.full = true;
        availableHour.typeOfHour = "Test";
        availableHour.studentId = studentId;

        // הוספת טסט ללוח הזמנים של התלמיד
        student.dateforLessonsAndTest.push({
            date: requestedDate,
            hour: availableHour.hour,
            typeOfHour: "Test",
        });

        student.test = "test"; // עדכון מצב הטסט לתלמיד

        // הסרת הבקשה מרשימת הבקשות של המורה
        teacher.listOfRequires = teacher.listOfRequires.filter(req =>
            req.studentId.toString() !== studentId || new Date(req.date).toISOString() !== requestedDate.toISOString()
        );

        // שמירת המורה והתלמיד
        await teacher.save();
        await student.save();

        res.status(200).json({
            message: "Test scheduled successfully",
            hour: availableHour.hour,
            date: requestedDate.toISOString(),
            listOfRequires: teacher.listOfRequires
        });
    } catch (error) {
        console.error("Error in settingTest:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




const cancelTestRequest = async (req, res) => {
    const { _id, role } = req.user;
    const { studentId, date } = req.body;

    if (!studentId || !date||!role) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (role != 'T') {
        return res.status(400).json({ message: "no accsess" })
    }

    // Find the student
    const student = await Student.findById(studentId).exec();
    if (!student) {
        return res.status(400).json({ message: 'No student found' });
    }

    // Find the teacher
    const teacher = await Teacher.findById(_id).exec();
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' });
    }

    // Check teacher authorization
    if (student.myTeacher.toString() !== _id) {
        return res.status(403).json({ message: 'No Access' });
    }

    // Ensure the date is properly parsed
    const requestDate = new Date(date);

    // Remove the request from the teacher's list
    teacher.listOfRequires = teacher.listOfRequires.filter(req =>
        req.studentId.toString() !== studentId || new Date(req.date).toISOString() !== requestDate.toISOString()
    );

    // Save the changes in the teacher
    await teacher.save();

    student.test = "false"
    await student.save()

    // Respond with success
    res.status(200).json({ listOfRequires: teacher.listOfRequires });
};



const addLessonToStudent = async (req, res) => {
    const { _id ,role} = req.user
    const { studentId } = req.body
    if (!_id || !studentId||!role) {
        return res.status(400).json({ message: "files are required" })
    }
    if (role != 'T') {
        return res.status(400).json({ message: "no accsess" })
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
    const students = await Student.find({ myTeacher: _id }, { password: 0 }).lean()
    console.log(students);
    return res.status(200).json({ students: students, student: student })


}

const changePassword = async (req, res) => {
    const { _id } = req.user
    const { oldPassword, newPassword } = req.body
    const teacher = await Teacher.findById(_id).exec();
    if (!teacher) {
        return res.status(400).json({ message: 'teacher not found' });
    }
    const match = await bcrypt.compare(oldPassword, teacher.password)
    if (!match) return res.status(401).json({ message: 'Incorrect password' })
    teacher.password = await bcrypt.hash(newPassword, 10)
    await teacher.save()
    return res.status(200).json({ message: 'Password changed successfully.' })
}

const getAllRecommendations = async (req, res) => {

    const { _id } = req.user
    const teacher = await Teacher.findById(_id).lean();
    if (!teacher) {
        return res.status(400).json({ message: 'teacher not found' });
    }
    if (!teacher.recommendations) {
        return res.status(400).json({ message: 'no recommndations' });
    }
    return res.status(200).json({ recommendations: teacher.recommendations })
}

const getRequests = async (req, res) => {
    const { _id , role} = req.user;
    if (role != 'T') {
        return res.status(400).json({ message: "no accsess" })
    }
    const teacher = await Teacher.findById(_id)
        .populate({
            path: 'listOfRequires.studentId',
            select: 'firstName lastName'
        })
        .lean();

    if (!teacher) {
        return res.status(400).json({ message: 'teacher not found' });
    }

    if (!teacher.listOfRequires) {
        return res.status(400).json({ message: 'no requests' });
    }

    return res.status(200).json({ listOfRequires: teacher.listOfRequires, });
};

const getDateforLessonsAndTests = async (req, res) => {
    const { _id, role } = req.user;
    const { date } = req.params;
    if (role != 'T') {
        return res.status(400).json({ message: "no accsess" })
    }
    const teacher = await Teacher.findById(_id).lean();

    if (!teacher) {
        return res.status(400).json({ message: 'teacher not found' });
    }

    if (!teacher.dateforLessonsAndTests) {
        return res.status(400).json({ message: 'no dateforLessonsAndTests' });
    }

    // המרת התאריך שהתקבל ל-Date
    const requestedDate = new Date(date);

    // בדיקת התאמה לתאריך הספציפי
    const relevantDateforLessonsAndTests = teacher.dateforLessonsAndTests
        .filter(r => new Date(r.date).toISOString().split('T')[0] === requestedDate.toISOString().split('T')[0]) // סינון לפי תאריך
        .map(r => ({
            date: r.date,
            hours: r.hours.filter(hour => hour.full === true) // סינון שעות שבהן full === true
        }))
        .filter(d => d.hours.length > 0); // שמירת תאריכים עם שעות מתאימות בלבד
    console.log("aaaaa", relevantDateforLessonsAndTests);

    return res.status(200).json({ relevantDateforLessonsAndTests: relevantDateforLessonsAndTests });
};

module.exports = {
    addTeacher,
    getAllTeachers,
    deleteTeacher,
    updateTeacher,
    getTeacherById,
    addAvailableClasses, // לא מימשנו
    settingTest,
    cancelTestRequest,
    addLessonToStudent,
    getAllDatesWithClasses,
    getClassesByDate,
    changePassword,
    getAllRecommendations,
    getDateforLessonsAndTests,
    getRequests,//לא ממשנו



}