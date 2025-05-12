
const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
const Admin = require("../models/Admin")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../nodemailer');
const validateUserDetails = require("../validation")


const addStudent = async (req, res) => {
    const { firstName, lastName, userName, numberID, dateOfBirth, phone, email, password } = req.body
    if (!firstName || !lastName || !userName || !numberID || !dateOfBirth || !phone || !email || !password) {
        return res.status(400).json({ message: "files are required" })
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
    const { _id, role } = req.user;

    if (!_id || !role) {
        return res.status(400).json({ message: "files are required" });
    }

    if (role === 'T') {
        const foundT = await Teacher.findOne({ _id }).lean();
        if (foundT) {
            console.log(_id);
            const studentsT = await Student.find({ myTeacher: _id }).sort({ firstName: 1, lastName: 1 }).lean();
            if (!studentsT?.length) {
                return res.status(400).json({ message: 'No students found' });
            }
            return res.json(studentsT);
        }
    }

    if (role === 'M') {
        const foundM = await Manager.findOne({ _id }).lean();
        if (foundM) {
            console.log(foundM.area);
            const allStudents = await Student.find({ area: foundM.area }, { password: 0 }).sort({ firstName: 1, lastName: 1 }).lean();
            if (!allStudents?.length) {
                return res.status(400).json({ message: 'No students found' });
            }
            return res.status(200).json(allStudents); 
        }
    }


    return res.status(400).json({ message: 'No Access' });
};



const updateStudent = async (req, res) => {
    const { _id } = req.user
    const { firstName, lastName, userName, phone, email } = req.body

    if (!_id || !firstName || !lastName || !userName || !phone || !email) {
        return res.status(400).json({ message: 'fields are required' })
    }
    if (!validateUserDetails(phone, email)) {
        return res.status(400).json({ message: "The details are invalid." })
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
    if (doubleUserNameT || doubleUserNameM || doubleUserNameS || doubleUserNameA || userExistsInRequests) {
        return res.status(400).json({ message: "doubleUserName" })
    }

    student.firstName = firstName,
        student.lastName = lastName,
        student.userName = userName,
        student.phone = phone,
        student.email = email,


        await student.save()
   
    const SInfo = {
        _id: student._id,
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


const getstudentById = async (req, res) => {
    const { _id, role } = req.user
    const { id } = req.params
    if (!_id || !role || !id) {
        return res.status(400).json({ message: "files are required" })
    }
    const student = await Student.findById(_id, { password: 0 }).lean()
    if (!student) {
        return res.status(400).json({ message: "student not found" })
    }
    if (role === 'S' && id !== _id) {
        return res.status(400).json({ message: "no accsess" })
    }
    if (role === 'T' && student.myTeacher !== _id) {
        return res.status(400).json({ message: "no accsess" })
    }
    if (role === 'M') {
        const manager = await Manager.findById(_id, { password: 0 }).lean()
        if (!manager || manager.area !== student.area) {
            return res.status(400).json({ message: "no accsess" })
        }
    }
    console.log(student.myTeacher);

    return res.status(200).json({ student: student });
}



const teacherSelection = async (req, res) => {
    const { _id, role } = req.user
    console.log("1");


    const { teacherId } = req.body
    if (!teacherId || !_id || !role) {
        console.log("2");
        return res.status(400).json({ message: "files are required" })
    }
    if (role != 'S') {
        console.log("3");
        return res.status(400).json({ message: 'only for students' })
    }
    const teacher = await Teacher.findById({ _id: teacherId }, { password: 0 }).exec()
    const student = await Student.findById({ _id }, { password: 0 }).exec()
    if (!teacher || !student) {
        console.log("4");
        return res.status(400).json({ message: 'No teacher found' })
    }
    if (teacher.listOfStudent.length > 3) {
        console.log("5");
        return res.status(400).json({ message: 'The teacher is not available to accept new students' })
    }
    teacher.listOfStudent = [...teacher.listOfStudent, _id]
    await teacher.save()
    student.myTeacher = teacherId
    student.area = teacher.area
    await student.save()
    res.status(200).json({ student, teacher })

}


const addRecommendation = async (req, res) => {
    const { _id, role } = req.user
    const { rec } = req.body
    if (!rec || !_id || !role) {
        return res.status(400).json({ message: "files are required" })
    }
    if (role != 'S') {
        return res.status(400).json({ message: 'only for students' })
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
    const { _id, role } = req.user
    const { date, hour } = req.body
    if (!_id || !date || !hour || !role) {
        return res.status(400).json({ message: "files are required" })
    }
    if (role != 'S') {
        return res.status(400).json({ message: 'only for students' })
    }
    const student = await Student.findById({ _id }, { password: 0 }).exec()
    if (!student) {
        return res.status(400).json({ message: 'No student found' })
    }
    if (student.lessonsRemaining <= 0) {
        return res.status(400).json({ message: 'You dont need any more lessons.' })
    }
    const teacherId = student.myTeacher
    const teacher = await Teacher.findById({ _id: teacherId }, { password: 0 }).exec()
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' })
    }
    if ((new Date(date) - new Date()) < 3 * 24 * 60 * 60 * 1000) {//התאריך עוד פחות מ3 ימים
        return res.status(400).json({ message: "too late" })
    }
    if ((new Date(date) - new Date()) < 0) {//התאריך כבר עבר
        return res.status(400).json({ message: "too late" })
    }



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
    searchH.studentId = _id
    console.log("Id", searchH.studentId);
    await teacher.save()

    const newDateAndHour = { date: date, hour: hour, typeOfHour: "Lesson" }
    student.dateforLessonsAndTest = [...student.dateforLessonsAndTest, newDateAndHour]
    student.lessonsRemaining = student.lessonsRemaining - 1
    student.lessonsLearned = student.lessonsLearned + 1
    await student.save()
    return res.status(200).json({ teacher, student })

}

const cancellationLesson = async (req, res) => {
    const { _id, role } = req.user
    const { date, hour } = req.body
    if (!_id || !date || !hour || !role) {
        return res.status(400).json({ message: "files are required" })
    }
    if (role != 'S') {
        return res.status(400).json({ message: 'only for students' })
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
    if ((new Date(date) - new Date()) < 3 * 24 * 60 * 60 * 1000) {//התאריך עוד פחות מ3 ימים
        return res.status(400).json({ message: "too late" })
    }
    if ((new Date(date) - new Date()) < 0) {//התאריך כבר עבר
        return res.status(400).json({ message: "too late" })
    }


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
    searchH.studentId = null
    await teacher.save()

   
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

    const { _id, role } = req.user
    const { date } = req.body
    if (!_id || !date || !role) {
        return res.status(400).json({ message: "files are required" })
    }
    if (role != 'S') {
        return res.status(400).json({ message: 'only for students' })
    }
    const student = await Student.findById({ _id }, { password: 0 }).exec()
    if (!student) {
        return res.status(400).json({ message: 'No student found' })
    }
    if(student.lessonsRemaining>0){
        return res.status(400).json({ message: 'You havent yet determined all the lessons you need to learn' })
    }
    if(student.test!=='false'){
        console.log(student.test);

        if(student.test==='test') 
            return res.status(400).json({ message: 'You have already been scheduled for a test' })
        else
        return res.status(400).json({ message: 'You already requested a test' })
    }
    const teacherId = student.myTeacher
    const teacher = await Teacher.findById(teacherId, { password: 0 }).exec()
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' })
    }
    if ((new Date(date) - new Date()) < 7 * 24 * 60 * 60 * 1000) {//התאריך עוד פחות משבוע
        return res.status(400).json({ message: "too late" })
    }
    if ((new Date(date) - new Date()) < 0) {//התאריך כבר עבר
        return res.status(400).json({ message: "too late" })
    }

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
    student.test = 'request'
    await student.save()
    return res.status(200).json(teacher)

}


const deleteStudent = async (req, res) => {
    try {
        const { _id, role } = req.user; 
        const { studentID } = req.params; 
        if (!_id || !role || !studentID) {
            return res.status(400).json({ message: "files are required" })
        }
        if (role != 'T' && role != 'M') {
            return res.status(400).json({ message: 'no accsess' })
        }
      
        const student = await Student.findById(studentID, { password: 0 }).exec();
        if (!student) {
            return res.status(400).json({ message: 'Student not found.' });
        }

        const manager = await Manager.findById(_id, { password: 0 }).exec();
        const teacher = await Teacher.findById(_id, { password: 0 }).exec();

        if (teacher && student.myTeacher?.toString() !== _id.toString()) {
            return res.status(400).json({ message: 'Teacher does not have access to this student.' });
        }
        if (manager && student.area !== manager.area) {
            return res.status(400).json({ message: 'Manager does not have access to this student.' });
        }

 
        if (student.myTeacher != null) {
            const teacherID = student.myTeacher;

        
            const teacher1 = await Teacher.findById(teacherID, { password: 0 }).exec();
            if (!teacher1) {
                return res.status(400).json({ message: 'Teacher not found.' });
            }

            const currentDate = new Date();

            // עדכון השיעורים של המורה
            teacher1.dateforLessonsAndTests.forEach((lesson) => {
                // בדיקת תאריך
                if (new Date(lesson.date) > currentDate) {
                    lesson.hours.forEach((hour) => {
                        // בדיקת חפיפה לפי שעה ותאריך
                        student.dateforLessonsAndTest.forEach((studentLesson) => {
                            if (
                                studentLesson.date.toISOString() === lesson.date.toISOString() &&
                                studentLesson.hour === hour.hour
                            ) {
                                hour.full = false; // סימון השעה כפנויה
                            }
                        });
                    });
                }
            });


            teacher1.listOfStudent = teacher1.listOfStudent.filter(
                (item) => item.toString() !== student._id.toString()
            );

            await teacher1.save();
        }

        const thisMyTeacher = student.myTeacher?.toString();
        await student.deleteOne();

        sendEmail(email, `You left the school`, `Hello  ${firstName}  ${lastName}! \n
           You are no longer registered with the driving school in the Jerusalem ${area} area\n
           Best of luck in the future! \n`)
            .then(response => {
                console.log('Email sent from Function One:', response);
            })
            .catch(error => {
                console.error('Error sending email from Function One:', error);
            });


        const teachersInArea = await Teacher.find({ area: student.area }, { password: 0 }).lean();
        const studentInArea = await Student.find({ area: student.area }, { password: 0 }).lean();
        const studentByTeacher = thisMyTeacher
            ? await Student.find({ myTeacher: thisMyTeacher }, { password: 0 }).lean()
            : [];

        return res.status(200).json({
            message: 'Student deleted successfully.',
            teachersInArea,
            studentInArea,
            studentByTeacher,
        });
    } catch (error) {
        console.error('Error in deleteStudent:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
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


const getTestDetails = async (req, res) => {
    const { _id, role } = req.user;

 
    if (!_id || !role) {
        return res.status(400).json({ message: "files are required" });
    }

 
    if (role !== 'S') {
        return res.status(400).json({ message: 'only for students' });
    }

    try {
      
        const student = await Student.findById({ _id }, { password: 0 }).lean();
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const status = student.test;

 
        if (status === 'false' || status === 'request') {
            return res.status(200).json({ status });
        }

    
        if (status === 'test') {
            const testDetails = student.dateforLessonsAndTest.find(entry => entry.typeOfHour === 'Test');

            if (testDetails) {
                return res.status(200).json({
                    status,
                    testDate: testDetails.date,
                    testHour: testDetails.hour
                });
            } else {
                return res.status(404).json({ message: "Test details not found" });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    addStudent,
    getAllStudents,
    updateStudent,
    getstudentById,
    teacherSelection,
    addRecommendation,
    settingLesson,
    cancellationLesson,
    testRequest,
    deleteStudent,
    changePassword,
    getTestDetails

}