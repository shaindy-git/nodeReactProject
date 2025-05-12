const Student = require("../models/Student")
const Manager = require("../models/Manager")
const Teacher = require("../models/Teacher")
const Admin = require("../models/Admin")
const { format, hoursToMinutes, getDate } = require("date-fns")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../nodemailer');
const validateUserDetails = require("../validation")



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
    if (!validateUserDetails(phone, email, dateOfBirth, numberID)) {
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
        const teachers = await Teacher.find({ area: maneger.area }, { password: 0 }).sort({ firstNane: 1, lastName: 1 }).lean()



        sendEmail(email, `Congratulations, you have been accepted as a teacher at the school in the ${area} area.`, `                      
    Hello  ${firstName}  ${lastName}! \n
            your application to become a teacher in the ${area} area has been accepted \n
            You can log in to your personal area using the username you set and the password that was sent to you \n
            We recommend changing your password upon first logging into your personal area `)
            .then(response => {
                console.log('Email sent from Function One:', response);
            })
            .catch(error => {
                console.error('Error sending email from Function One:', error);
            });


        return res.status(200).json({ teacher: teacher, teachers: teachers })
    } else {
        return res.status(400).json({ message: 'Invalid Teacher ' })
    }

}




const getAllTeachers = async (req, res) => {
    const { _id, role } = req.user;
    const { gender, area } = req.query; 

    if (!_id || !role) {
        return res.status(400).json({ message: "files are required" });
    }

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

  
    if (role === 'T') {
        return res.status(400).json({ message: 'No Access for Teachers' });
    }

 
    if (role === 'M') {
        const foundM = await Manager.findOne({ _id }).lean();
        if (!foundM) {
            return res.status(400).json({ message: "No Access" });
        }

 
        const teachers = await Teacher.find({ area: foundM.area }, { password: 0 })
            .sort({ firstName: 1, lastName: 1 })
            .lean();

        if (!teachers?.length) {
            return res.status(400).json({ message: 'No teachers found for your area' });
        }

        return res.status(200).json(teachers);
    }

    return res.status(400).json({ message: "No Access" });
};


const deleteTeacher = async (req, res) => {
    try {
        const { _id, role } = req.user; 
        const { idTeacher } = req.params; 
        if (!_id || !role || !idTeacher) {
            return res.status(400).json({ message: "files are required" })
        }
        if (role != 'M') {
            return res.status(400).json({ message: 'no accsess' })
        }
     
        const manager = await Manager.findById(_id, { password: 0 }).exec();
        if (!manager) {
            return res.status(400).json({ message: 'Manager not found' });
        }

        const teacher = await Teacher.findById(idTeacher, { password: 0 }).exec();
        if (!teacher) {
            return res.status(400).json({ message: 'Teacher not found' });
        }

    
        if (teacher.area !== manager.area) {
            return res.status(403).json({ message: 'No access to this teacher' });
        }

       
        if (teacher.listOfStudent?.length) {
            const alternativeTeacher = await Teacher.findOne({
                area: teacher.area,
                _id: { $ne: teacher._id },
            })
                .sort({ listOfStudent: 1 }) 
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
    if (!validateUserDetails(phone, email)) {
        return res.status(400).json({ message: "The details are invalid." })
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
    const { _id, role } = req.user
    const { id } = req.params
    if (!_id || !role || !id) {
        return res.status(400).json({ message: "files are required" })
    }
    if (role === 'S') {
        const student = await Student.findOne({ _id: _id, myTeacher: id }, { password: 0 }).lean()
        if (!student) {
            return res.status(400).json({ message: "no accsess" })
        }
    }
    const teacher = await Teacher.findById(id)
        .populate({
            path: 'listOfRequires.studentId', 
            select: 'firstName lastName _id'
        });
    if (!teacher) {
        return res.status(400).json({ message: 'teacher not found' })
    }
    if (role === 'M') {
        const manager = await Manager.findOne({ _id: _id, area: teacher.area }, { password: 0 }).lean()
        if (!manager) {
            return res.status(400).json({ message: "no accsess" })
        }
    }
    if (role === 'T' && teacher._id != id) {
        return res.status(400).json({ message: "no accsess" })
    }



    return res.status(200).json({ teacher: teacher });
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

const getAllDatesWithClasses = async (req, res) => {
    const { _id, role } = req.user;

    if (!_id || !role) {
        console.log("1");
        console.error("files are is required");
        return res.status(400).json({ message: "files are is required" });
    }
    let teacherId
    if (role === 'S') {
        const student = await Student.findById(_id, { password: 0 }).lean();
        if (!student) {
            return res.status(400).json({ message: "no accsess" })
        }
        teacherId = student.myTeacher
    }
    else if (role === 'T') {
        teacherId = _id

    }
    else {
        return res.status(400).json({ message: "no accsess" })
    }

    const teacher = await Teacher.findById(teacherId, { dateforLessonsAndTests: 1 }).lean();
    if (!teacher) {
        console.log("2");
        console.error("Teacher not found:", _id);
        return res.status(404).json({ message: "Teacher not found" });
    }

   
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
    const { _id, role } = req.user; 
    const { date } = req.params; 

   
    if (!_id || !date || !role) {
        return res.status(400).json({ message: "files are required" });
    }

    if (role !== 'T' && role !== 'S') {
        return res.status(400).json({ message: "no access" });
    }

    if (role === 'T') {
        const teacher = await Teacher.findById(_id, { dateforLessonsAndTests: 1 }).exec();
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher found' });
        }

   
        const lessonsOnDate = teacher.dateforLessonsAndTests.filter((e) => {
            const dbDate = new Date(e.date).toISOString().split('T')[0]; 
            const requestDate = new Date(date).toISOString().split('T')[0]; 
            return dbDate === requestDate;
        });

     
        if (!lessonsOnDate || lessonsOnDate.length === 0) {
            return res.status(404).json({ message: 'No lessons or tests found on this date' });
        }

      
        const hoursFull = lessonsOnDate
            .flatMap(e => e.hours.filter(h => h.full === true).map(h => h.hour));
        const hoursEmpty = lessonsOnDate
            .flatMap(e => e.hours.filter(h => h.full === false).map(h => h.hour));

        return res.status(200).json({ hoursFull: hoursFull, hoursEmpty: hoursEmpty });
    }

    if (role === 'S') {
    
        const student = await Student.findById(_id).populate('myTeacher', 'dateforLessonsAndTests').exec();
        if (!student) {
            return res.status(404).json({ message: 'No student found' });
        }

        const teacher = student.myTeacher;
        if (!teacher) {
            return res.status(404).json({ message: 'No teacher assigned to this student' });
        }

   
        const lessonsOnDate = teacher.dateforLessonsAndTests.filter((e) => {
            const dbDate = new Date(e.date).toISOString().split('T')[0]; // רק התאריך
            const requestDate = new Date(date).toISOString().split('T')[0]; // רק התאריך
            return dbDate === requestDate;
        });

  
        if (!lessonsOnDate || lessonsOnDate.length === 0) {
            return res.status(404).json({ message: 'No lessons or tests found on this date' });
        }

        const hoursEmpty = lessonsOnDate
            .flatMap(e => e.hours.filter(h => h.full === false).map(h => h.hour)); // שעות ריקות
        const hoursFull = lessonsOnDate
            .flatMap(e => e.hours.filter(h => h.studentId?.toString() === _id.toString()).map(h => h.hour)); // שעות שתלמיד זה תפס

        const hoursLessons = lessonsOnDate
            .flatMap(lesson => lesson.hours
                .filter(hour => hour.typeOfHour === 'Lesson') 
                .map(hour => hour.hour));

        const hoursTests = lessonsOnDate
            .flatMap(lesson => lesson.hours
                .filter(hour => hour.typeOfHour === 'Test') // פילטור שיעורים מסוג "Test"
                .map(hour => hour.hour));

        const result = {
            hoursFull: hoursFull,
            hoursEmpty: hoursEmpty,
            hoursLessons: hoursLessons, 
            hoursTests: hoursTests, 
        };

        return res.status(200).json(result);
    }
};


const settingTest = async (req, res) => {
    try {
        const { _id, role } = req.user; 
        const { studentId, date } = req.body; 

        if (!studentId || !date || !_id || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (role != 'T') {
            return res.status(400).json({ message: "no accsess" })
        }
     
        const student = await Student.findById(studentId).exec();
        if (!student) {
            return res.status(400).json({ message: 'No student found' });
        }

        const teacher = await Teacher.findById(_id).exec();
        if (!teacher) {
            return res.status(400).json({ message: 'No teacher found' });
        }

        if (student.myTeacher.toString() !== _id.toString()) {
            return res.status(403).json({ message: 'No Access' });
        }

        const currentDate = new Date();
        const requestedDate = new Date(date);

      
        if ((requestedDate - currentDate) < 7 * 24 * 60 * 60 * 1000) {
            return res.status(400).json({ message: "The date is too close" });
        }

     
        if (requestedDate < currentDate) {
            return res.status(400).json({ message: "The date has already passed" });
        }

      
        const searchD = teacher.dateforLessonsAndTests.find((e) =>
            new Date(e.date).toISOString().split('T')[0] === requestedDate.toISOString().split('T')[0]
        );

        if (!searchD) {
            return res.status(400).json({ message: 'No available date found for the teacher' });
        }

    
        const oneOnDay = student.dateforLessonsAndTest.find((e) =>
            new Date(e.date).toISOString().split('T')[0] === requestedDate.toISOString().split('T')[0]
        );

        if (oneOnDay) {
            return res.status(400).json({ message: 'The student already has a lesson on this day' });
        }

       
        const availableHour = searchD.hours.find((hour) => !hour.full);
        if (!availableHour) {
            return res.status(400).json({ message: 'No available hours on this date' });
        }

     
        availableHour.full = true;
        availableHour.typeOfHour = "Test";
        availableHour.studentId = studentId;

        student.dateforLessonsAndTest.push({
            date: requestedDate,
            hour: availableHour.hour,
            typeOfHour: "Test",
        });

        student.test = "test"; 

        teacher.listOfRequires = teacher.listOfRequires.filter(req =>
            req.studentId.toString() !== studentId || new Date(req.date).toISOString() !== requestedDate.toISOString()
        );

        await teacher.save();
        await student.save();


        sendEmail(email, `A test has been scheduled for you`, `                      
            Hello  ${firstName}  ${lastName}! \n
                    Your request to schedule a test has been accepted. \n
                    The test will take place on: ${date} \n
                   Mostly successful!!`)
            .then(response => {
                console.log('Email sent from Function One:', response);
            })
            .catch(error => {
                console.error('Error sending email from Function One:', error);
            });

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

    if (!studentId || !date || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (role != 'T') {
        return res.status(400).json({ message: "no accsess" })
    }


    const student = await Student.findById(studentId).exec();
    if (!student) {
        return res.status(400).json({ message: 'No student found' });
    }


    const teacher = await Teacher.findById(_id).exec();
    if (!teacher) {
        return res.status(400).json({ message: 'No teacher found' });
    }


    if (student.myTeacher.toString() !== _id) {
        return res.status(403).json({ message: 'No Access' });
    }


    const requestDate = new Date(date);

    teacher.listOfRequires = teacher.listOfRequires.filter(req =>
        req.studentId.toString() !== studentId || new Date(req.date).toISOString() !== requestDate.toISOString()
    );


    await teacher.save();

    student.test = "false"
    await student.save()

    sendEmail(email, `Your request was not accepted`, `                      
        Hello  ${firstName}  ${lastName}! \n
                Your request to schedule a test has been rejected. \n
                You can try to schedule a different date later  `)
        .then(response => {
            console.log('Email sent from Function One:', response);
        })
        .catch(error => {
            console.error('Error sending email from Function One:', error);
        });



    res.status(200).json({ listOfRequires: teacher.listOfRequires });
};



const addLessonToStudent = async (req, res) => {
    const { _id, role } = req.user
    const { studentId } = req.body
    if (!_id || !studentId || !role) {
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
    const { _id, role } = req.user;
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

    return res.status(200).json({ listOfRequires: teacher.listOfRequires });
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


    const requestedDate = new Date(date);


    const relevantDateforLessonsAndTests = teacher.dateforLessonsAndTests
        .filter(r => new Date(r.date).toISOString().split('T')[0] === requestedDate.toISOString().split('T')[0])
        .map(r => ({
            date: r.date,
            hours: r.hours.filter(hour => hour.full === true)
        }))
        .filter(d => d.hours.length > 0);
    console.log("aaaaa", relevantDateforLessonsAndTests);

    return res.status(200).json({ relevantDateforLessonsAndTests: relevantDateforLessonsAndTests });
};

module.exports = {
    addTeacher,
    getAllTeachers,
    deleteTeacher,
    updateTeacher,
    getTeacherById,
    addAvailableClasses,
    settingTest,
    cancelTestRequest,
    addLessonToStudent,
    getAllDatesWithClasses,
    getClassesByDate,
    changePassword,
    getAllRecommendations,
    getDateforLessonsAndTests,
    getRequests
}