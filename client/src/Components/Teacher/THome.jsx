import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ListBox } from 'primereact/listbox';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import TShowStudent from './TShowStudent';
import { Calendar } from 'primereact/calendar';
import TShowHours from './TShowHours';




const THome = () => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const ID = decoded ? decoded.numberID : null;

    const [selectstudent, setSelectedstudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [relevantstudent, setRelevantstudent] = useState(null);
    const [visibleS, setVisibleS] = useState(false);
    const [date, setDate] = useState(null);
    const [visibleD, setVisibleD] = useState(false);
    const [fullHours, setFullHours] = useState([]);
    const toast = useRef(null);

    

    const itemTemplatestudent = (student) => (
        <div>{student.firstName} {student.lastName}</div>
    );

    const itemTemplateEmpty = (label) => (
        <div style={{ color: 'gray', fontStyle: 'italic', textAlign: 'center' }}>{label}</div>
    );

    const removeStudentFromList = (idToRemove) => {
        setStudents(prev => prev.filter(s => s._id !== idToRemove));
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="card" style={{ display: 'flex', height: '75vh' }}>
                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <ListBox
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
                    <TShowStudent
                        setVisibleS={setVisibleS}
                        visibleS={visibleS}
                        student={relevantstudent}
                        setRelevantstudent={setRelevantstudent}
                        removeStudent={removeStudentFromList}
                        setStudents={setStudents}
                    />
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
                            inline
                            showWeek
                        />
                        <TShowHours
                            setVisibleD={setVisibleD}
                            visibleD={visibleD}
                            date={date}
                            setFullHours ={setFullHours}
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



