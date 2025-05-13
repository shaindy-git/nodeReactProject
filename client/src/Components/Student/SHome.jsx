import React, { useState, useRef, useEffect } from "react";
import { Menu } from "primereact/menu";
import { OverlayPanel } from "primereact/overlaypanel"; 
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Calendar } from "primereact/calendar";
// import SSelectionTeatcher from "./SSelectionTeatcher";
import SShowHoures from "./SShowHoures"
import { Route, Routes, useNavigate } from "react-router-dom";
import { Image } from 'primereact/image';

import './SHome.css';

const SHome = () => {
    const [showEditor, setShowEditor] = useState(false);
    const [text, setText] = useState(''); 
    const accesstoken = useSelector((state) => state.token.token); 
    const toast = useRef(null); 
    const overlayPanel = useRef(null); 
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const [teacher, setTeacher] = useState(null); 
    const [myTeacher, setMyTeacher] = useState(null); 
    const [lessonsLearned, setLessonsLearned] = useState(0); 
    const [lessonsRemaining, setLessonsRemaining] = useState(0); 
    const [area, setArea] = useState();
    const [test, setTest] = useState();
    const [overlayContent, setOverlayContent] = useState(); 
    const [date, setDate] = useState(null);
    const navigate = useNavigate(); 
    const [status, setStatus] = useState()
 
    const [visible, setVisible] = useState(false);
    const [specialDates, setSpecialDates] = useState([]);
    const [changeDate, setChangeDate] = useState(Date.now());
 
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [newdate, setNewdate] = useState(""); 
    const [dateInput, setDateInput] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 

    const dateTemplate = (dateMeta) => {
        const formattedDate = `${dateMeta.year}-${String(dateMeta.month + 1).padStart(2, '0')}-${String(dateMeta.day).padStart(2, '0')}`;


        if (specialDates.includes(formattedDate)) {
            return <span className="custom-special-date">{dateMeta.day}</span>;
        }

        return dateMeta.day;
    };



    const isValidDate = (date) => {
        const regex = /^\d{4}\/\d{2}\/\d{2}$/; 
        return regex.test(date);
    };
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };


    useEffect(() => {
        console.log("dateInput עודכן:", dateInput);
        
    }, [dateInput]);

    const SaveDate = (savedate) => {
        debugger


        console.log("SaveDate111", dateInput);

        if (!isValidDate(savedate)) {
            setErrorMessage("תאריך לא תקין. יש להזין תאריך בפורמט YYYY/MM/DD");
            return; 
        }

      
        setNewdate(savedate);
        setErrorMessage(""); 
        console.log("Test confirmed with date:", savedate);

       
        overlayPanel.current.hide(); 

        setIsButtonEnabled(true); 
    };

    useEffect(() => {
        const getStudentById = async () => {
            if (decoded) {
                console.log(decoded._id);

                try {
                    const StudentById = await axios({
                        method: 'get',
                        url: `http://localhost:7000/student/getStudentById/${decoded._id}`,
                        headers: { Authorization: "Bearer " + accesstoken },
                    });
                    if (StudentById.status === 200) {
                        setTeacher(StudentById.data.student.myTeacher || null); 
                        setArea(StudentById.data.student.area || null);
                        setLessonsRemaining(StudentById.data.student.lessonsRemaining || 0);
                        setLessonsLearned(StudentById.data.student.lessonsLearned || 0);

                    }
                } catch (e) {
                    if (e.response?.status === 400) {
                        console.error("Error:", e.response?.status || "Unknown error");
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch teacher details', life: 3000 });
                    } else {
                        console.error("Unauthorized user - R / THome 8");
                    }
                }
            }
        };

     
        getStudentById();
    }, [accesstoken, decoded]); 

    useEffect(() => {
        if (teacher) {
            const getTeacher = async () => {
                try {
                    const MyTeacher = await axios({
                        method: 'get',
                        url: `http://localhost:7000/teacher/getTeacherById/${teacher}`,
                        headers: { Authorization: "Bearer " + accesstoken },
                    });
                    console.log("ooooo", MyTeacher.data.teacher);

                    if (MyTeacher.status === 200) {
                        console.log("here");
                        setMyTeacher(MyTeacher.data.teacher || null);
                    }
                } catch (e) {
                    if (e.response?.status === 400);
                    else console.error("Unauthorized user - R / MHome");
                }
            };

            getTeacher();
        }
    }, [teacher]); 




 
    const sendRecommendation = async () => {
        try {
            const res = await axios({
                method: 'put',
                url: 'http://localhost:7000/student/addRecommendation',
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    "rec": text 
                }
            });
            if (res.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Recommendation sent successfully!', life: 3000 });
            }
        } catch (e) {
            console.error("Error:", e.response?.status || "Unknown error");
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to send recommendation. Please try again.', life: 3000 });
        }
    };

   
    const showAreaDetails = (event) => {
        if (area) {
            setOverlayContent(
                <div>
                    <p><strong>Area:</strong> {area}</p> 
                </div>
            );
            overlayPanel.current.toggle(event); 
        } else {
            toast.current.show({ severity: 'info', summary: 'Info', detail: 'No area information available.', life: 3000 });
        }
    };



    const showTetcherDetails = (event) => {

        if (myTeacher) {
            setOverlayContent(
                <div>
                    <p><strong>Teacher Name:</strong> {myTeacher.firstName} {myTeacher.lastName} </p>
                    <p><strong>Email:</strong> {myTeacher.email}</p>
                </div>
            );
            overlayPanel.current.toggle(event); 
        } else {
            toast.current.show({ severity: 'info', summary: 'Info', detail: 'No teacher information available.', life: 3000 });
        }
    };






 
    const getLessonsLearned = async (event) => {
        setOverlayContent(
            <p><strong>Lessons Learned:</strong> {lessonsLearned}</p>
        );
        overlayPanel.current.toggle(event); 
    };
    const getLessonsRemaining = async (event) => {
        setOverlayContent(
            <p><strong>Lessons Learned:</strong> {lessonsRemaining}</p>
        );
        overlayPanel.current.toggle(event);
    };






    const getTest = async (event) => {
        try {
            const res = await axios({
                method: 'get',
                url: 'http://localhost:7000/student/getTestDetails',
                headers: { Authorization: "Bearer " + accesstoken },
            });

            if (res.status === 200) {
                const { status, testDate, testHour } = res.data;
                setStatus(status);

                if (status === 'false') {
                    let formattedDate;
                    setOverlayContent(
                        <div>
                            <p><strong>Test Status:</strong> You have not yet applied for a test</p>

                           
                            <div className="flex gap-2 mb-4 items-end">
                                <div className="flex-grow">

                                    <label htmlFor="dateInput" className="text-sm font-medium mb-1"></label>
                                    <Calendar

                                        id="dateInput"
                                        value={dateInput}
                                        onChange={(e) => {
                                            debugger
                                            formattedDate = formatDate(e.value);
                                            console.log("formatDate(e.value)", formatDate(e.value));
                                          

                                        }}
                                        dateFormat="yy/mm/dd"
                                        showIcon
                                        className="w-full"
                                        touchUI
                                        placeholder="Select a date"
                                    />
                                </div>

                                <div style={{ width: "100px" }}>
                                    <Button
                                        label="Confirm"
                                        icon="pi pi-check"
                                        onClick={() => SaveDate(formattedDate)}
                                        className="p-button"
                                        style={{
                                            width: "100%",
                                            backgroundColor: "#4CAF50",
                                            color: "#fff",
                                            fontSize: "0.9rem",
                                            textTransform: "none",
                                            borderRadius: "12px",
                                            border: "none",
                                            height: "40px"
                                        }}
                                    />
                                </div>
                            </div>

                           
                            <div>
                                <Button
                                    label="Apply for Test"
                                    icon="pi pi-send"
                                    onClick={applyForTest}
                                    className="p-button"
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#000",
                                        color: "#fff",
                                        fontSize: "0.9rem",
                                        textTransform: "none",
                                        borderRadius: "12px",
                                        border: "none",
                                        height: "40px"
                                    }}
                                    disabled={!isButtonEnabled}
                                />
                            </div>
                        </div>
                    );

                } else if (status === 'request') {
                    setOverlayContent(
                        <p><strong>Test Status:</strong> A request has been submitted and will be processed as soon as possible</p>
                    );
                } else if (status === 'test') {
                    const dateOnly = new Date(testDate).toISOString().split('T')[0];
                    setOverlayContent(
                        <div>
                            <p><strong>Test Status:</strong> {status}</p>
                            <p><strong>Date:</strong> {dateOnly}</p>
                            <p><strong>Hour:</strong> {testHour}</p>
                        </div>
                    );
                }

                overlayPanel.current.toggle(event); 
            }
        } catch (e) {
            console.error("Error:", e.response?.status || "Unknown error");
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load test details8989', life: 3000 });
        }
    };



   
    const applyForTest = async () => {


        if (lessonsRemaining > 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'You havent yet determined all the lessons you need to learn', life: 3000 });
            return;
        }
        try {
            const selectedDate = new Date(newdate); 

            if (isNaN(selectedDate)) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid date format', life: 3000 });
                return;
            }

            const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

            const res = await axios({
                method: 'put',
                url: 'http://localhost:7000/student/testRequest',
                headers: { Authorization: "Bearer " + accesstoken },
                data: { date: formattedDate }
            });

            if (res.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Test application sent successfully!', life: 3000 });
            }
        } catch (e) {
            console.error("Error:", e.response?.status || "Unknown error");
            toast.current.show({ severity: 'error', summary: 'Error', detail: e.response.message, life: 3000 });
        }
    };


   
    const renderHeader = () => {
        return (
            <span className="ql-formats">
              
                <select className="ql-size" aria-label="Font Size">
                    <option value="small">Small</option>
                    <option defaultValue>Normal</option>
                    <option value="large">Large</option>
                </select>

              
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-strike" aria-label="Strike-through"></button> 

                
                <select className="ql-color" aria-label="Text Color"></select>
                <select className="ql-background" aria-label="Highlight"></select> 

              
                <select className="ql-align" aria-label="Text Alignment">
                    <option defaultValue></option>
                    <option value="center"></option>
                    <option value="right"></option>
                    <option value="justify"></option>
                </select>

                
                <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
            </span>
        );
    };

    const header = renderHeader();

 
    let items = [
        ...(teacher ? [{
            label: 'MyTeacher',
            icon: 'pi pi-user',
            command: (event) => showTetcherDetails(event.originalEvent),
        }, {
            label: 'Area',
            icon: 'pi pi-map-marker',
            command: (event) => showAreaDetails(event.originalEvent), 
        },
        ] : [
            {
                label: 'Selection Teacher',
                icon: 'pi pi-filter',
                command: () => {
                    navigate('/Student/SSelectionTeatcher');
                },
            },
        ]),
        {
            label: 'Test',
            icon: 'pi pi-car',
            command: (event) => getTest(event.originalEvent)
           
        },
        {
            label: 'LessonsLearned',
            icon: 'pi pi-chevron-circle-left',
            command: (event) => getLessonsLearned(event.originalEvent), 
        },
        {
            label: 'LessonsRemaining',
            icon: 'pi pi-chevron-circle-right',
            command: (event) => getLessonsRemaining(event.originalEvent), 
        },

        {
            template: () => (
                <hr style={{
                    border: "0",
                    height: "1px",
                    background: "linear-gradient(to right, #ccc, #eee, #ccc)",
                    margin: "0.5rem 0"
                }} />
            )
        },
        {
            label: 'Add Recommendation To Your Teacher',
            icon: 'pi pi-plus-circle',
        },
    ];

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




    

    return (
        <div className="card flex justify-content-end" style={{ position: "relative", backgroundColor: 'rgba(5,5,5,0)' }}>

           

            <div className="card flex justify-content-center" style={{ marginLeft: "33%", marginTop: "5%" }}>
                <Calendar
                    value={date}
                    onChange={(e) => {
                        const selectedDate = e.value;
                        const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(1, '0')}`;

                        setDate(formattedDate);
                        setDate(e.value);
                        setVisible(true);
                    }}
                    dateTemplate={dateTemplate}
                    inline
                    showWeek
                />
                {visible && (
                    <SShowHoures
                        date={date}
                        setVisible={setVisible}
                        visible={visible}
                        setChangeDate={setChangeDate}
                        setSpecialDates={setSpecialDates}
                        specialDates={specialDates}
                    />
                )}
            </div>
            <Menu model={items} className="w-full md:w-15rem" dir="ltr" style={{ background: 'transparent', padding: '0' }} />

            <Toast ref={toast} />
            <OverlayPanel ref={overlayPanel} style={{ width: '300px' }}>
                <div dir="ltr">{overlayContent}</div>
            </OverlayPanel>

            <div style={{ position: "absolute", right: "15", top: "70%", width: "11.2%" }}>
                <Editor
                    value={text}
                    onTextChange={(e) => setText(e.htmlValue || '')}
                    headerTemplate={header}
                    style={{ height: "300px", backgroundColor: "white" }}
                />
                <Button
                    label="Add Recommendation"
                    icon="pi pi-check"
                    onClick={sendRecommendation}
                    className="p-button"
                    style={{
                        marginTop: "0.5rem",
                        width: "100%",
                        backgroundColor: "#000",
                        color: "#fff",
                        fontSize: "0.8rem",
                        textTransform: "none",
                        borderRadius: "12px",
                        border: "none",
                    }}
                />
            </div>
        </div>
    );
};

export default SHome;
