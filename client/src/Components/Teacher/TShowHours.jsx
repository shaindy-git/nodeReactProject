import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const TShowHours = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const toast = useRef(null);

    // נוודא שה-state מאותחל
    const [selectedHoursByDate, setSelectedHoursByDate] = useState({});

    const hours = [
        "01:00", "02:00", "03:00", "04:00", "05:00",
        "06:00", "07:00", "08:00", "09:00", "10:00",
        "11:00", "12:00", "13:00", "14:00", "15:00",
        "16:00", "17:00", "18:00", "19:00", "20:00",
        "21:00", "22:00", "23:00", "24:00"
    ];

    // הפיכת ה-date לאובייקט Date אם הוא לא כבר כזה
    const currentDate = props.date instanceof Date ? props.date : new Date(props.date);

    // בדיקה אם התאריך תקין
    const isValidDate = currentDate && !isNaN(currentDate);

    // שליפת שעות עבור תאריך נוכחי או ברירת מחדל
    const selectedHoursForCurrentDate =
        isValidDate
            ? selectedHoursByDate[currentDate.toLocaleDateString()] || { hoursFull: [], hoursEmpty: [] }
            : { hoursFull: [], hoursEmpty: [] };

    useEffect(() => {
        if (!accesstoken || !props.date || !isValidDate) return;

        const fetchSelectedHours = async () => {
            try {
                // יצירת פורמט תאריך מתאים לשרת
                const formattedDate = currentDate.toISOString().split('T')[0];
                console.log("Fetching hours for date:", formattedDate);

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
                    // אם אין נתונים עבור התאריך, מאותחל עם מערכים ריקים
                    console.warn(`No data found for date: ${currentDate}`);
                    setSelectedHoursByDate((prev) => ({
                        ...prev,
                        [currentDate.toLocaleDateString()]: { hoursFull: [], hoursEmpty: [] },
                    }));
                } else {
                    console.error("Error fetching hours:", e);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to fetch hours',
                    });
                }
            }
        };

        fetchSelectedHours();
    }, [accesstoken, props.date, isValidDate]);

    const handleHourClick = async (hour) => {
        if (!isValidDate) {
            return;
        }
    
        const now = new Date(); // הזמן הנוכחי
        const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // שבוע במילישניות
        const selectedDate = currentDate;
    
        // בדיקה אם התאריך כבר עבר
        if (selectedDate < now) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Cannot schedule lessons for a past date.',
            });
            return;
        }
    
        // בדיקה אם התאריך הוא פחות משבוע קדימה
        if (selectedDate - now < oneWeekInMillis) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Cannot schedule lessons for a date less than a week in advance.',
            });
            return;
        }
    
        // בדיקות נוספות (כמו האם השעה כבר קיימת וכו')
        const currentSelection = selectedHoursForCurrentDate || { hoursFull: [], hoursEmpty: [] };
    
        if (currentSelection.hoursFull.includes(hour) || currentSelection.hoursEmpty.includes(hour)) {
            return; // אם השעה כבר נבחרה, אל תעשה כלום
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
            if (e.response?.status === 400) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Bad request',
                });
            } else {
                console.error("Error in TShowHours");
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'An error occurred',
                });
            }
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
                        let color = 'black'; // ברירת מחדל
                        if (selectedHoursForCurrentDate.hoursFull.includes(hour)) {
                            color = 'red'; // שעות מלאות
                        } else if (selectedHoursForCurrentDate.hoursEmpty.includes(hour)) {
                            color = 'blue'; // שעות ריקות
                        }

                        return (
                            <div
                                key={hour}
                                style={{
                                    color: color,
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    padding: '5px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                                onClick={() => handleHourClick(hour)}
                            >
                                {hour}
                            </div>
                        );
                    })}
                </div>
            </Dialog>
        </div>
    );
};

export default TShowHours;
