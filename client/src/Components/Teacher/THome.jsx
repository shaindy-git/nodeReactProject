import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ListBox } from 'primereact/listbox';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import TShowStudent from './TShowStudent';
import TShowRequest from './TShowRequest'; 
import { Calendar } from 'primereact/calendar';
import TShowHours from './TShowHours';
import { Card } from 'primereact/card';
import { Paginator } from 'primereact/paginator';
import { Button } from "primereact/button";

import './THome.css';

const THome = () => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const ID = decoded ? decoded.numberID : null;

    const [changeStudents, setChangeStudents] = useState([]);
    const [selectStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [relevantStudent, setRelevantStudent] = useState(null);
    const [visibleS, setVisibleS] = useState(false);
    const [date, setDate] = useState(null);
    const [visibleD, setVisibleD] = useState(false);
    const [fullHours, setFullHours] = useState([]);
    const [specialDates, setSpecialDates] = useState([]);
    const [changeDate, setChangeDate] = useState(Date.now());
    const [first, setFirst] = useState(0);
    const [recommendations, setRecommendations] = useState([]);
    const [requests, setRequests] = useState([]); 
    const [changeRequests, setChangeRequests] = useState([]); 
    const [selectedRequest, setSelectedRequest] = useState(null); 
    const [visibleR, setVisibleR] = useState(false); 
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
                    setSpecialDates(formattedDates);
                }
            } catch (e) {
                if (e.response?.status === 400) setSpecialDates([]);
                else console.error("Error fetching dates:", e);
            }
        };

        fetchDates();
    }, [accesstoken, changeDate]);

    
    useEffect(()=>{
        const getTeatcherById = async () => {
            try {
                const TeatcherById = await axios({
                    method: 'get',
                    url: `http://localhost:7000/teacher/getTeacherById/${decoded._id}`,
                    headers: { Authorization: "Bearer " + accesstoken },
                });
                if (TeatcherById.status === 200) {
                    setRecommendations(TeatcherById.data.teacher.recommendations?TeatcherById.data.teacher.recommendations:[])
                    setRequests(TeatcherById.data.teacher.listOfRequires?TeatcherById.data.teacher.listOfRequires:[])

                }

            } catch (e) {
                if (e.response?.status === 400) {
                    setRecommendations([])
                    setRequests([])
                }
                else console.error("Unauthorized user - R / THome");
            }
        };
        getTeatcherById()

    },[accesstoken,changeRequests])

   
    useEffect(() => {
        if (selectedRequest) {
            setVisibleR(true); 
        } else {
            setVisibleR(false); 
        }
    }, [selectedRequest]);

    const AddTest = async () => {
        if (!selectedRequest || !selectedRequest.studentId || !selectedRequest.date) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please select a valid request before proceeding.",
                life: 2000,
            });
            return;
        }

        console.log("Processing AddTest for:", selectedRequest);


        console.log(";;;",selectedRequest.studentId);
        try {
            const res = await axios({
                method: "PUT",
                url: "http://localhost:7000/teacher/settingTest",
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    "studentId": selectedRequest.studentId._id,
                    "date": selectedRequest.date,
                },
            });

            if (res.status === 200) {
                setChangeRequests((prev) => [...prev, res.data]);
                setRequests(res.data.listOfRequires);

                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Test was successfully added to the request!",
                    life: 2000,
                });
            }
        } catch (e) {
            console.error("Error in AddTest:", e);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: e.response?.data?.message || "Failed to add test.",
                life: 2000,
            });
        }
    };

    const cancelTestRequest = async () => {
        if (!selectedRequest || !selectedRequest.studentId || !selectedRequest.date) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please select a valid request before proceeding.",
                life: 2000,
            });
            return;
        }

        console.log("Processing AddTest for:", selectedRequest);
        
        try {
            const res = await axios({
                method: "PUT",
                url: "http://localhost:7000/teacher/cancelTestRequest",
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    "studentId": selectedRequest.studentId._id,
                    "date": selectedRequest.date,
                },
            });

            if (res.status === 200) {
                setChangeRequests((prev) => [...prev, res.data]);
                setRequests(res.data.listOfRequires);

                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Test was successfully remove to the request!",
                    life: 2000,
                });
            }
        } catch (e) {
            console.error("Error in cancelTestRequest:", e);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: e.response?.data?.message || "Failed to remove test.",
                life: 2000,
            });
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="card" style={{ display: 'flex', height: '60vh' }}>
                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <ListBox
                        dir="ltr"
                        filter
                        filterPlaceholder="Search Student"
                        value={selectStudent}
                        onChange={(e) => {
                            setSelectedStudent(e.value);
                            setRelevantStudent(e.value ?? relevantStudent);
                            setVisibleS(true);
                        }}
                        options={students.map((student) => ({
                            label: `${student.firstName} ${student.lastName}`,
                            value: student
                        }))}
                        itemTemplate={(student) => <div>{student.label}</div>}
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '39vh' }}
                        filterBy="label"
                    />
                    {visibleS && (
                        <TShowStudent
                            setChangeStudents={setChangeStudents}
                            setVisibleS={setVisibleS}
                            visibleS={visibleS}
                            student={relevantStudent}
                            setRelevantStudent={setRelevantStudent}
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
                            setChangeDate={setChangeDate}
                            students={students}
                        />
                    )}
                </div>

                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <ListBox
                        dir="ltr"
                        filter
                        filterPlaceholder="Search Requests"
                        value={selectedRequest}
                        onChange={(e) => setSelectedRequest(e.value)} 
                        options={
                            requests.length > 0
                                ? requests.map((request) => ({
                                    label: `${request.studentId?.firstName || 'Unknown'} ${request.studentId?.lastName || 'Unknown'} - ${new Date(request.date).toLocaleDateString()}`,
                                    value: request
                                }))
                                : [{ label: "No available options", value: null }]
                        }
                        itemTemplate={(request) => (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', borderBottom: '1px solid #ddd' }}>
                                <div style={{ flex: 1, wordBreak: 'break-word', marginRight: '10px' }}>{request.label}</div>
                                <div className="dialog-footer" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    {selectedRequest && (
                                        <Button
                                            icon="pi pi-calendar-plus"
                                            style={{
                                                width: "2.8rem",
                                                height: "2.8rem",
                                                borderRadius: "50%",
                                                backgroundColor: "#204392",
                                                border: "none",
                                                color: "white",
                                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "all 0.3s ease",
                                            }}
                                            aria-label="AddTest"
                                            onClick={()=>{AddTest()}}
                                         
                                        />



                                    )}

                                    {selectedRequest && (
                                        <Button
                                            icon="pi pi-trash"
                                            style={{
                                                width: "2.8rem",
                                                height: "2.8rem",
                                                borderRadius: "50%",
                                                backgroundColor: "#204392",
                                                border: "none",
                                                color: "white",
                                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "all 0.3s ease",
                                                marginLeft:'0.8rem'
                                            }}
                                            aria-label="AddTest"
                                            onClick={cancelTestRequest}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#163366"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#204392"}
                                        />



                                    )}
                                </div>
                            </div>


                        )}
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '39vh' }}
                        filterBy="label"
                    />
                </div>
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
                            
                            <div dangerouslySetInnerHTML={{ __html: recommendations[first].rec }} />
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