import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';

const TShowHours = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;

    const toast = useRef(null);
    const overlayPanel = useRef(null);

    const [selectedHourDetails, setSelectedHourDetails] = useState(null);
    const [selectedHoursByDate, setSelectedHoursByDate] = useState([]);
    const [alllessonsAndTest, setAlllessonsAndTest] = useState([]);

    const showDetails = (event, hour) => {
        overlayPanel.current.toggle(event);

        console.log(alllessonsAndTest);
        
        // מציאת הפרטים של השעה הספציפית
        const spesipicHour = alllessonsAndTest.find(h => h.hour === hours.hour);
console.log(spesipicHour);

        if (!spesipicHour) {
            console.error("Hour details not found");
            return;
        }

        // מציאת הסטודנט לפי ID

       console.log(props.students);
        
        const student = props.students.find(student => student._id === spesipicHour.hours.studentId);

        if (!student) {
            console.error("Student not found");
            return;
        }

        console.log(spesipicHour.hour,
            spesipicHour.type,
            student.firstName,
            student.lastName,);


        // עדכון הנתונים של השעה הנבחרת
        setSelectedHourDetails({
            hour: spesipicHour.hour,
            type: spesipicHour.type,
            studentFirstName: student.firstName,
            studentLastName: student.lastName,
        });
    };


    const hours = [
        "01:00", "02:00", "03:00", "04:00", "05:00",
        "06:00", "07:00", "08:00", "09:00", "10:00",
        "11:00", "12:00", "13:00", "14:00", "15:00",
        "16:00", "17:00", "18:00", "19:00", "20:00",
        "21:00", "22:00", "23:00", "24:00"
    ];

    const currentDate = props.date instanceof Date ? props.date : new Date(props.date);
    const isValidDate = currentDate && !isNaN(currentDate);

    const selectedHoursForCurrentDate =
        isValidDate
            ? selectedHoursByDate[currentDate.toLocaleDateString()] || { hoursFull: [], hoursEmpty: [] }
            : { hoursFull: [], hoursEmpty: [] };

    useEffect(() => {
        if (!accesstoken || !props.date || !isValidDate) return;

        const fetchSelectedHours = async () => {
            try {
                const formattedDate = currentDate.toISOString().split('T')[0];

                const HourRes = await axios({
                    method: 'get',
                    url: `http://localhost:7000/teacher/getClassesByDate/${formattedDate}`,
                    headers: { Authorization: "Bearer " + accesstoken },
                });

                if (HourRes.status === 200) {
                    const { hoursFull, hoursEmpty } = HourRes.data;
                    setSelectedHoursByDate((prev) => ({
                        ...prev,
                        [currentDate.toLocaleDateString()]: { hoursFull, hoursEmpty },
                    }));
                }
            } catch (e) {
                if (e.response?.status === 404) {
                    setSelectedHoursByDate((prev) => ({
                        ...prev,
                        [currentDate.toLocaleDateString()]: { hoursFull: [], hoursEmpty: [] },
                    }));
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to fetch hours',
                    });
                }
            }
        };


        const getDateforLessonsAndTests = async () => {
            try {
                const formattedDate = currentDate.toISOString().split('T')[0];
                

                const HourRes = await axios({
                    method: 'get',
                    url: `http://localhost:7000/teacher/getDateforLessonsAndTests/${formattedDate}`,
                    headers: { Authorization: "Bearer " + accesstoken },
                });
                

                if (HourRes.status === 200) {
                    setAlllessonsAndTest(HourRes.data.relevantDateforLessonsAndTests);
                }
            } catch (e) {
                if (e.response?.status === 404) {
                    setAlllessonsAndTest([]);
                    ;
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to fetch hours',
                    });
                }
            }
        };


        fetchSelectedHours();
        getDateforLessonsAndTests()
    }, [accesstoken, props.date, isValidDate]);

    const handleHourClick = async (hour) => {
        if (!isValidDate) {
            return;
        }

        const now = new Date();
        const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
        const selectedDate = currentDate;

        if (selectedDate < now) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Cannot schedule lessons for a past date.',
            });
            return;
        }

        if (selectedDate - now < oneWeekInMillis) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Cannot schedule lessons for a date less than a week in advance.',
            });
            return;
        }

        const currentSelection = selectedHoursForCurrentDate || { hoursFull: [], hoursEmpty: [] };

        if (currentSelection.hoursFull.includes(hour) || currentSelection.hoursEmpty.includes(hour)) {
            return;
        }

        try {
            const HourRes = await axios({
                method: 'put',
                url: 'http://localhost:7000/teacher/addAvailableClasses',
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    date: selectedDate.toISOString(),
                    hour: hour,
                },
            });

            if (HourRes.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Hour added successfully',
                });
                props.setChangeDate(Date.now());
            }
        } catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred',
            });
        }

        setSelectedHoursByDate((prev) => ({
            ...prev,
            [currentDate.toLocaleDateString()]: {
                ...currentSelection,
                hoursEmpty: [...currentSelection.hoursEmpty, hour],
            },
        }));
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog
                header={`${isValidDate ? currentDate.toLocaleDateString() : 'Invalid Date'}`}
                visible={props.visibleD}
                style={{ width: '15vw', height: 'auto' }}
                onHide={() => {
                    props.setVisibleD(false);
                }}
                dir="ltr"
                footer={null}
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '10px' }}>
                    {hours.map((hour) => {
                        const isFull = selectedHoursForCurrentDate.hoursFull.includes(hour);
                        const isEmpty = selectedHoursForCurrentDate.hoursEmpty.includes(hour);

                        return (
                            <div
                                key={hour}
                                style={{
                                    color: isFull ? 'red' : isEmpty ? 'blue' : 'black',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    padding: '5px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                                onClick={(e) => {
                                    if (isFull) {
                                        showDetails(e, { hour });
                                    } else {
                                        handleHourClick(hour);
                                    }
                                }}
                            >
                                {hour}
                                {isFull && (
                                    <OverlayPanel ref={overlayPanel} style={{ width: '300px', padding: '1rem', textAlign: 'left' }}>
                                        <div>
                                            <h4>Lesson Details</h4>
                                            <p><strong>Hour:</strong> {selectedHourDetails?.hour}</p>
                                            <p><strong>Type:</strong> {selectedHourDetails?.type}</p>
                                            <p><strong>Student:</strong> {selectedHourDetails?.studentFirstNAme}   {selectedHourDetails?.student.lastName}</p>
                                        </div>
                                    </OverlayPanel>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Dialog>
        </div>
    );
};

export default TShowHours;
