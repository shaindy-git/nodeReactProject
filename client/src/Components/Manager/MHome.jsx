import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListBox } from 'primereact/listbox';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Button } from 'primereact/button';
import MShowteacher from './MShowteacher';
import MShowstudent from './MShowstudent';
import MShowreq from './MShowreq';
import { useRef } from 'react';
import { Toast } from 'primereact/toast'; // Toast להודעות


const MHome = () => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const ID = decoded ? decoded.numberID : null;
    const Reqlist = decoded ? decoded.RequestList : null;

    const [selectteacher, setSelectedteacher] = useState(null);
    const [selectstudent, setSelectedstudent] = useState(null);
    const [selectques, setSelectedques] = useState(null);

    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [ques, setQues] = useState(Reqlist);

    const [relevantteacher, setRelevantteacher] = useState(null);
    const [relevantstudent, setRelevantstudent] = useState(null);
    const [relevantques, setRelevantques] = useState(null);

    const [visibleT, setVisibleT] = useState(false);
    const [visibleS, setVisibleS] = useState(false);
    const [visibleQ, setVisibleQ] = useState(false);

    const toast = useRef(null);


    useEffect(() => {


        const Techer = async () => {
            try {
                const teacherRes = await axios({
                    method: 'get',
                    url: 'http://localhost:7000/teacher/getAllTeachers',
                    headers: { Authorization: "Bearer " + accesstoken },
                });
                if (teacherRes.status === 200) {
                    setTeachers(teacherRes.data);
                }
            } catch (e) {
                if (e.response && e.response.status === 400) {
                    setTeachers([]);
                } else {
                    console.error(e);
                    alert("Unauthorized user - T / MHome");
                }
            }
        }

        const Student = async () => {

            try {
                const studentRes = await axios({
                    method: 'get',
                    url: 'http://localhost:7000/student/getAllStudents',
                    headers: { Authorization: "Bearer " + accesstoken },
                });
                if (studentRes.status === 200) {
                    setStudents(studentRes.data);
                }
            } catch (e) {
                if (e.response && e.response.status === 400) {
                    setStudents([]);
                } else {
                    console.error(e);
                    alert("Unauthorized user - S / MHome");
                }
            }
        }

        if (Reqlist) {
            setQues(Reqlist);
        }

        Techer();
        Student();

    }, [ID]); // עדכון לתלות ב-ID וב-decoded


    const itemTemplateteacher = (teacher) => {
        return (
            <div>
                <div>{teacher.firstName} {teacher.lastName}</div>
            </div>
        );
    };


    const itemTemplatestudent = (student) => {
        return (
            <div>
                <div>{student.firstName} {student.lastName}</div>
            </div>
        );
    };


    const itemTemplateques = (ques) => {
        return (
            <div>
                {/* צריך להוסיף כאן מה שרוצים להציג */}
                <div>{ques.firstName} {ques.lastName} </div>
            </div>
        );
    };

    const itemTemplateEmpty = (label) => {
        return (
            <div style={{ color: 'gray', fontStyle: 'italic', textAlign: 'center' }}>
                {label}
            </div>
        );
    };

    const removeTeacherFromList = (idToRemove) => {
        setTeachers(prev => prev.filter(t => t._id !== idToRemove));
    };

    const removeStudentFromList = (idToRemove) => {
        setStudents(prev => prev.filter(s => s._id !== idToRemove));
    };

    //דרוש בדיקה
    const removeQuesFromList = (idToRemove) => {
        setQues(prev => prev.filter(q => q._id !== idToRemove));
    };



    return (
        <>
            <Toast ref={toast} />
            <div className="card" style={{ display: 'flex', height: '70vh' }}>
                <div className="flex-item" style={{ flex: 1, margin: '5px' }}>
                    <ListBox
                        filter
                        value={selectteacher}
                        onChange={(e) => {
                            setSelectedteacher(e.value);
                            setRelevantteacher((e.value) === null ? relevantteacher : e.value);
                            setVisibleT(true);
                        }}
                        options={teachers.length > 0 ? teachers : [{ label: 'No Teachers Available', value: null }]}
                        itemTemplate={teachers.length > 0 ? itemTemplateteacher : () => itemTemplateEmpty('No Teachers Available')}
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '60vh' }}  // הגבלת גובה עם גלילה
                        filterBy="firstName"
                    />
                    {<MShowteacher
                        setVisibleT={setVisibleT}
                        visibleT={visibleT}
                        teacher={relevantteacher}
                        removeTeacher={removeTeacherFromList}
                        setStudents={setStudents}
                    />}
                </div>

                <div className="flex-item" style={{ flex: 1, margin: '5px' }}>
                    <ListBox
                        filter
                        value={selectstudent}
                        onChange={(e) => {
                            setSelectedstudent(e.value);
                            setRelevantstudent((e.value) === null ? relevantstudent : e.value);
                            setVisibleS(true);
                        }}
                        options={students.length > 0 ? students : [{ label: 'No Students Available', value: null }]}
                        itemTemplate={students.length > 0 ? itemTemplatestudent : () => itemTemplateEmpty('No Students Available')}
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '60vh' }}  // הגבלת גובה עם גלילה
                        filterBy="firstName"
                    />
                    <MShowstudent
                        setVisibleS={setVisibleS}
                        visibleS={visibleS}
                        student={relevantstudent}
                        removeStudent={removeStudentFromList}
                        setTeachers={setTeachers}

                    />
                </div>

                

                <div className="flex-item" style={{ flex: 1, margin: '5px' }}>
                    <ListBox
                        filter
                        value={selectques}
                        onChange={(e) => {
                            setSelectedques(e.value);
                            setRelevantques((e.value) === null ? relevantques : e.value);
                            setVisibleQ(true);
                        }}
                        options={ques.length > 0 ? ques : [{ label: 'No Requests Available', value: null }]}
                        itemTemplate={ques.length > 0 ? itemTemplateques : () => itemTemplateEmpty('No Requests Available')}
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '60vh' }}
                        filterBy="firstName"
                    />
                    <MShowreq
                        setVisibleQ={setVisibleQ}
                        visibleQ={visibleQ}
                        req={relevantques}
                        removeQues={removeQuesFromList}
                        setQues={setQues}
                        oldtoken={decoded}
                        
                    />
                </div>
            </div>
        </>

    );
}
export default MHome;