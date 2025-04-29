import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ListBox } from 'primereact/listbox';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import TShowStudent from './TShowStudent';
import { Calendar } from 'primereact/calendar';
import TShowHours from './TShowHours';

import './THome.css'; // Ensure this points to the correct path of your CSS file


const THome = () => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const ID = decoded ? decoded.numberID : null;
    const [changeStudents, setChangeStudents] = useState([]);
    const [selectstudent, setSelectedstudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [relevantstudent, setRelevantstudent] = useState(null);
    const [visibleS, setVisibleS] = useState(false);
    const [date, setDate] = useState(null);
    const [visibleD, setVisibleD] = useState(false);
    const [fullHours, setFullHours] = useState([]);
    const toast = useRef(null);


    const specialDates = ['2025-04-03', '2025-05-10', '2025-05-15'];

    

    const itemTemplatestudent = (student) => (
        <div>{student.firstName} {student.lastName}</div>
    );

    const itemTemplateEmpty = (label) => (
        <div style={{ color: 'gray', fontStyle: 'italic', textAlign: 'center' }}>{label}</div>
    );

    const removeStudentFromList = (idToRemove) => {
        setStudents(prev => prev.filter(s => s._id !== idToRemove));
    };
    const dateTemplate = (dateMeta) => {
        const formattedDate = dateMeta.year + '-' + String(dateMeta.month + 1).padStart(2, '0') + '-' + String(dateMeta.day).padStart(2, '0');

        if (specialDates.includes(formattedDate)) {
            // Add a custom class to special dates
            return (
                <span className="custom-special-date">
                    {dateMeta.day}
                </span>
            );
        }

        // Return default rendering for other dates
        return dateMeta.day;
    };

    useEffect(() => {
        if (!accesstoken) return;
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


        // הפונקציות ירוצו רק אם יש טוקן תקף

        Student();


    }, [accesstoken,changeStudents]); // הוספת accesstoken לתלות



    return (
        <>
            <Toast ref={toast} />
            <div className="card" style={{ display: 'flex', height: '75vh' }}>
                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <ListBox
                        dir='ltr'
                        filter
                        filterPlaceholder="Search Student"
                        value={selectstudent}
                        onChange={(e) => {
                            setSelectedstudent(e.value);
                            setRelevantstudent(e.value ?? relevantstudent);
                            setVisibleS(true);
                        }}
                        options={Array.isArray(students) && students.length > 0 ? students : [{ label: 'No Students Available', value: null }]}
                        itemTemplate={Array.isArray(students) && students.length > 0 ? itemTemplatestudent : () => itemTemplateEmpty('No Students Available')}
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '57vh' }}
                        filterBy={["firstName", "lastName"]}
                    />
                    {visibleS ? <TShowStudent
                        setChangeStudents={setChangeStudents}
                        setVisibleS={setVisibleS}
                        visibleS={visibleS}
                        student={relevantstudent}
                        setRelevantstudent={setRelevantstudent}
                        removeStudent={removeStudentFromList}
                        setStudents={setStudents}
                    /> : <></>}
                </div>
                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <div className="card flex justify-content-center">
                        <Calendar
                            value={date}
                            onChange={(e) => {
                                console.log("Selected date:", e.value);
                                setDate(e.value); // Save the date
                                setVisibleD(true);
                            }}
                            dateTemplate={dateTemplate} // Use the custom date template
                            inline
                            showWeek
                        />

                        <TShowHours
                            setVisibleD={setVisibleD}
                            visibleD={visibleD}
                            date={date}
                            setFullHours={setFullHours}
                            fullHours={fullHours}
                        />
                    </div>
                </div>
                <div className="flex-item" style={{ flex: 1, margin: '20px' }}></div>
            </div>
        </>
    );
};

export default THome;



