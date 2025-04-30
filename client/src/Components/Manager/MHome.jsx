import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ListBox } from 'primereact/listbox';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import MShowteacher from './MShowteacher';
import MShowstudent from './MShowstudent';
import MShowreq from './MShowreq';

const MHome = () => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const ID = decoded ? decoded.numberID : null;

    const [selectteacher, setSelectedteacher] = useState(null);
    const [selectstudent, setSelectedstudent] = useState(null);
    const [selectreqs, setSelectreqs] = useState(null);

    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [req, setReq] = useState([]);

    const [relevantteacher, setRelevantteacher] = useState(null);
    const [relevantstudent, setRelevantstudent] = useState(null);
    const [relevantreq, setRelevantreq] = useState(null);

    const [visibleT, setVisibleT] = useState(false);
    const [visibleS, setVisibleS] = useState(false);
    const [visibleR, setVisibleR] = useState(false);

    const toast = useRef(null);

    useEffect(() => {
        if (!accesstoken || !ID) return;

        const Techer = async () => {
            try {
                const teacherRes = await axios({
                    method: 'get',
                    url: 'http://localhost:7000/teacher/getAllTeachers',
                    headers: { Authorization: "Bearer " + accesstoken },
                });
                if (teacherRes.status === 200) setTeachers(teacherRes.data);
            } catch (e) {
                if (e.response?.status === 400) setTeachers([]);
                else console.error("Unauthorized user - T / MHome"); // אפשר גם Toast
            }
        };

        const Student = async () => {
            try {
                const studentRes = await axios({
                    method: 'get',
                    url: 'http://localhost:7000/student/getAllStudents',
                    headers: { Authorization: "Bearer " + accesstoken },
                });
                if (studentRes.status === 200) setStudents(studentRes.data);
            } catch (e) {
                if (e.response?.status === 400) setStudents([]);
                else console.error("Unauthorized user - S / MHome");
            }
        };

        const Request = async () => {
            try {
                const reqRes = await axios({
                    method: 'get',
                    url: 'http://localhost:7000/manager/getRequestsByManagerId',
                    headers: { Authorization: "Bearer " + accesstoken },
                });
                if (reqRes.status === 200) setReq(reqRes.data);
            } catch (e) {
                if (e.response?.status === 400) setReq([]);
                else console.error("Unauthorized user - R / MHome");
            }
        };

        // הפונקציות ירוצו רק אם יש טוקן תקף
        Techer();
        Student();
        Request();

    }, [accesstoken, ID]); // הוספת accesstoken לתלות

    const itemTemplateteacher = (teacher) => (
        <div>{teacher.firstName} {teacher.lastName}</div>
    );

    const itemTemplatestudent = (student) => (
        <div>{student.firstName} {student.lastName}</div>
    );

    const itemTemplatereq = (req) => (
        <div>{req.firstName} {req.lastName}</div>
    );

    const itemTemplateEmpty = (label) => (
        <div style={{ color: 'gray', fontStyle: 'italic', textAlign: 'center' }}>{label}</div>
    );

    const removeTeacherFromList = (idToRemove) => {
        setTeachers(prev => prev.filter(t => t._id !== idToRemove));
    };

    const removeStudentFromList = (idToRemove) => {
        setStudents(prev => prev.filter(s => s._id !== idToRemove));
    };

    const removeReqFromList = (idToRemove) => {
        setReq(prev => prev.filter(q => q._id !== idToRemove));
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="card" style={{ display: 'flex', height: '70vh' }}>
                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <ListBox

                        filter
                        filterPlaceholder="Search Teacher"
                        filterInputProps={{
                            style: {
                                direction: 'ltr',
                                opacity: 0.5,
                                color: '#666'
                            }
                        }}
                        value={selectteacher}
                        onChange={(e) => {
                            setSelectedteacher(e.value);
                            setRelevantteacher(e.value ?? relevantteacher);
                            setVisibleT(true);
                        }}
                        options={teachers .map(teacher => ({
                            label: `${teacher.firstName} ${teacher.lastName}`, // יצירת תווית עם השם המלא
                            value: teacher
                        }))}
                        itemTemplate={(teacher) => <div>{teacher.label}</div>} // תבנית להצגת השדה
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '57vh' }}
                        filterBy="label" // החיפוש יתבצע על השדה המחובר "label"
                    />
                    <MShowteacher
                        setVisibleT={setVisibleT}
                        visibleT={visibleT}
                        teacher={relevantteacher}
                        removeTeacher={removeTeacherFromList}
                        setStudents={setStudents}
                        setTeachers={setTeachers}
                    />

                </div>

                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <ListBox

                        filter
                        filterPlaceholder="Search Student"
                        filterInputProps={{
                            style: {
                                direction: 'ltr',
                                opacity: 0.5,
                                color: '#666'
                            }
                        }}
                        value={selectstudent}
                        onChange={(e) => {
                            setSelectedstudent(e.value);
                            setRelevantstudent(e.value ?? relevantstudent);
                            setVisibleS(true);
                        }}
                        options={students.map(student => ({
                            label: `${student.firstName} ${student.lastName}`, // יצירת תווית עם השם המלא
                            value: student
                        }))}
                        itemTemplate={(student) => <div>{student.label}</div>} // תבנית להצגת השדה
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '57vh' }}
                        filterBy="label" // החיפוש יתבצע על השדה המחובר "label"
                    />
                    <MShowstudent
                        setVisibleS={setVisibleS}
                        visibleS={visibleS}
                        student={relevantstudent}
                        removeStudent={removeStudentFromList}
                        setTeachers={setTeachers}
                        setStudents={setStudents}
                    />
                </div>

                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <ListBox

                        filter
                        filterPlaceholder="Search Request"
                        filterInputProps={{
                            style: {
                                direction: 'ltr',
                                opacity: 0.5,
                                color: '#666'
                            }
                        }}
                        value={selectreqs}
                        onChange={(e) => {
                            setSelectreqs(e.value);
                            setRelevantreq(e.value ?? relevantreq);
                            setVisibleR(true);
                        }}
                        options={req .map(reqest => ({
                            label: `${reqest.firstName} ${reqest.lastName}`, // יצירת תווית עם השם המלא
                            value: reqest
                        }))}
                        itemTemplate={(reqest) => <div>{reqest.label}</div>} // תבנית להצגת השדה
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '57vh' }}
                        filterBy="label" // החיפוש יתבצע על השדה המחובר "label"
                    />
                    <MShowreq
                        setVisibleR={setVisibleR}
                        visibleR={visibleR}
                        req={relevantreq}
                        removeReq={removeReqFromList}
                        setReq={setReq}
                        setTeachers={setTeachers}
                    />
                </div>
            </div>
        </>
    );
};

export default MHome;
