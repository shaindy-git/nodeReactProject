import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ListBox } from 'primereact/listbox';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import TShowStudent from './TShowStudent';
import { Calendar } from 'primereact/calendar';
import TShowHours from './TShowHours';
import { Card } from 'primereact/card';
import { Paginator } from 'primereact/paginator';

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
    const [specialDates, setspecialDates] = useState([]);
    const [changeDate, setChangeDate] = useState(Date.now());
    const [first, setFirst] = useState(0);
    const [recommendations, setRecommendations ]= useState([]);
    const toast = useRef(null);


    const removeStudentFromList = (idToRemove) => {
        setStudents((prev) => prev.filter((s) => s._id !== idToRemove));
    };

    const dateTemplate = (dateMeta) => {
        const formattedDate = `${dateMeta.year}-${String(dateMeta.month + 1).padStart(2, '0')}-${String(dateMeta.day).padStart(2, '0')}`;

        if (specialDates.includes(formattedDate)) {
            return <span className="custom-special-date">{dateMeta.day}</span>;
        }

        return dateMeta.day;
    };

    const onPageChange = (event) => {
        if (event.first < recommendations.length) {
            setFirst(event.first);
        }
    };

    useEffect(() => {
        if (!accesstoken) return;

        const fetchStudents = async () => {
            try {
                const studentRes = await axios.get('http://localhost:7000/student/getAllStudents', {
                    headers: { Authorization: "Bearer " + accesstoken },
                });
                if (studentRes.status === 200) setStudents(studentRes.data);
            } catch (e) {
                if (e.response?.status === 400) setStudents([]);
                else console.error("Unauthorized user - fetchStudents");
            }
        };

        fetchStudents();
    }, [accesstoken, changeStudents]);

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const datesRes = await axios.get('http://localhost:7000/teacher/getAllDatesWithClasses', {
                    headers: { Authorization: "Bearer " + accesstoken },
                });

                if (datesRes.status === 200 && datesRes.data.dates) {
                    const formattedDates = datesRes.data.dates.map((date) => date.split('T')[0]);
                    setspecialDates(formattedDates);
                }
            } catch (e) {
                if (e.response?.status === 400) setspecialDates([]);
                else console.error("Error fetching dates:", e);
            }
        };

        fetchDates();
    }, [accesstoken, changeDate]);


    useEffect(() => {

        console.log(decoded.recommendations);
        
        const fetchRecommendations = async () => {
            try {
                const recommendationsRes = await axios.get('http://localhost:7000/teacher/getAllRecommendations', {
                    headers: { Authorization: "Bearer " + accesstoken },
                });
    
                if (recommendationsRes.status === 200 && recommendationsRes.data.recommendations) {
                    setRecommendations(recommendationsRes.data.recommendations);
                }
            } catch (e) {
                console.error("Error fetching recommendations:", e);
            }
        };
    
        if (accesstoken) {
            fetchRecommendations();
        }
    }, [accesstoken]); 

    return (
        <>
            <Toast ref={toast} />
            <div className="card" style={{ display: 'flex', height: '75vh' }}>
                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <ListBox
                        dir="ltr"
                        filter
                        filterPlaceholder="Search Student"
                        value={selectstudent}
                        onChange={(e) => {
                            setSelectedstudent(e.value);
                            setRelevantstudent(e.value ?? relevantstudent);
                            setVisibleS(true);
                        }}
                        options={students.map((student) => ({
                            label: `${student.firstName} ${student.lastName}`,
                            value: student
                        }))}
                        itemTemplate={(student) => <div>{student.label}</div>}
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '57vh' }}
                        filterBy="label"
                    />
                    {visibleS && (
                        <TShowStudent
                            setChangeStudents={setChangeStudents}
                            setVisibleS={setVisibleS}
                            visibleS={visibleS}
                            student={relevantstudent}
                            setRelevantstudent={setRelevantstudent}
                            removeStudent={removeStudentFromList}
                            setStudents={setStudents}
                        />
                    )}
                </div>

                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <Calendar
                        value={date}
                        onChange={(e) => {
                            const selectedDate = e.value;
                            const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
                            setDate(formattedDate);
                            setVisibleD(true);
                        }}
                        dateTemplate={dateTemplate}
                        inline
                        showWeek
                    />
                    {visibleD && (
                        <TShowHours
                            setVisibleD={setVisibleD}
                            visibleD={visibleD}
                            date={date}
                            setFullHours={setFullHours}
                            fullHours={fullHours}
                            setChangeDate={setChangeDate}
                        />
                    )}
                </div>

                <div className="flex-item" style={{ flex: 1, margin: '20px' }}></div>
            </div>

            <div className="card">
                <Paginator
                    first={first}
                    rows={1}
                    totalRecords={recommendations.length}
                    onPageChange={onPageChange}
                    template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                />
               <div className="p-3 text-center">
    {recommendations[first] ? (
        <Card
            title={recommendations[first].name}
            subTitle="Recommendation"
            className="shadow-2 border-round max-w-full"
        >
            <p>{recommendations[first].rec}</p>
        </Card>
    ) : (
        <p>No recommendation available.</p>
        
    )}
</div>
            </div>
        </>
    );
};

export default THome;

