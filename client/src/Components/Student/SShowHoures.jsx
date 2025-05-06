// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';
// import { Toast } from 'primereact/toast';
// import { Dialog } from 'primereact/dialog';

// const SShowHoures = (props) => {
//     // קבלת ה-token מה-Redux
//     const accesstoken = useSelector((state) => state.token.token);
//     // פענוח ה-token כדי לקבל מידע על המשתמש
//     const decoded = accesstoken ? jwtDecode(accesstoken) : null;

//     // הפניה ל-Toast להצגת הודעות
//     const toast = useRef(null);

//     // מצב לשמירת השעות עבור תאריך מסוים
//     const [selectedHoursByDate, setSelectedHoursByDate] = useState([]);
//     // מצב לשמירת השעה שנבחרה על ידי התלמיד
//     const [mySelectedHour, setMySelectedHour] = useState(null);

//     // רשימת כל השעות ביום
//     const hours = [
//         "01:00", "02:00", "03:00", "04:00", "05:00",
//         "06:00", "07:00", "08:00", "09:00", "10:00",
//         "11:00", "12:00", "13:00", "14:00", "15:00",
//         "16:00", "17:00", "18:00", "19:00", "20:00",
//         "21:00", "22:00", "23:00", "24:00"
//     ];

//     // חישוב התאריך הנוכחי מתוך props.date
//     console.log("props.date",props.date);
    
//     const currentDate = props.date instanceof Date ? props.date : new Date(props.date);
//     // בדיקה אם התאריך חוקי
//     const isValidDate = currentDate && !isNaN(currentDate);

//     // חישוב השעות עבור התאריך הנוכחי
//     const selectedHoursForCurrentDate =
//         isValidDate
//             ? selectedHoursByDate[currentDate.toLocaleDateString()] || { hoursFull: [], hoursEmpty: [] }
//             : { hoursFull: [], hoursEmpty: [] };

//     // קריאה לשרת להבאת השעות עבור התאריך הנוכחי
//     useEffect(() => {
//         // if (!accesstoken || !props.date || !isValidDate) return;

//         const fetchSelectedHours = async () => {

//             try {
//                 const formattedDate = currentDate.toISOString().split('T')[0];

//                 console.log('Formatted Date:', formattedDate); // הוסף שורה זו לבדיקה

//                 const HourRes = await axios({
//                     method: 'get',
//                     url: `http://localhost:7000/teacher/getClassesByDate/${formattedDate}`,
//                     headers: { Authorization: "Bearer " + accesstoken },
//                 });

//                 if (HourRes.status === 200) {
//                     console.log(HourRes.data);

//                     const { hoursFull, hoursEmpty } = HourRes.data;
//                     setSelectedHoursByDate((prev) => ({
//                         ...prev,
//                         [currentDate.toLocaleDateString()]: { hoursFull, hoursEmpty },
//                     }));
//                     setMySelectedHour(hoursFull); // השעות המלאות הן השעות שהתלמיד בחר
//                 }
//             } catch (e) {
//                 if (e.response?.status === 404) {
//                     setSelectedHoursByDate((prev) => ({
//                         ...prev,
//                         [currentDate.toLocaleDateString()]: { hoursFull: [], hoursEmpty: [] },
//                     }));
//                 } else {
//                     toast.current?.show({
//                         severity: 'error',
//                         summary: 'Error',
//                         detail: 'Failed to fetch hours',
//                     });
//                 }
//             }
//         };

//         fetchSelectedHours();
//     }, [accesstoken, props.date, isValidDate]);

//     // פונקציה לטיפול בלחיצה על שעה אדומה
//     const handleHourClick = async (hour) => {
//         if (!isValidDate) {
//             return;
//         }

//         const selectedDate = currentDate;

//         try {
//             const HourRes = await axios({
//                 method: 'post',
//                 url: 'http://localhost:7000/student/settingLesson',
//                 headers: { Authorization: "Bearer " + accesstoken },
//                 data: {
//                     date: selectedDate.toISOString(),
//                     hour: hour,
//                 },
//             });

//             if (HourRes.status === 200) {
//                 toast.current.show({
//                     severity: 'success',
//                     summary: 'Success',
//                     detail: 'Hour selected successfully',
//                 });

//                 // עדכון השעות לאחר בחירה מוצלחת
//                 setSelectedHoursByDate((prev) => ({
//                     ...prev,
//                     [currentDate.toLocaleDateString()]: {
//                         ...prev[currentDate.toLocaleDateString()],
//                         hoursFull: [...prev[currentDate.toLocaleDateString()].hoursFull, hour],
//                         hoursEmpty: prev[currentDate.toLocaleDateString()].hoursEmpty.filter(h => h !== hour),
//                     },
//                 }));
//                 setMySelectedHour((prev) => [...(prev || []), hour]);
//             }
//         } catch (e) {
//             toast.current.show({
//                 severity: 'error',
//                 summary: 'Error',
//                 detail: e.response?.data?.message || 'An error occurred',
//             });
//         }
//     };

//     return (
//         <div className="card flex justify-content-center">
//             <Toast ref={toast} />
//             <Dialog
//                 header={`${isValidDate ? currentDate.toLocaleDateString() : 'Invalid Date'}`}
//                 visible={props.visible}
//                 style={{ width: '15vw', height: 'auto' }}
//                 onHide={() => {
//                     props.setVisible(false);
//                 }}
//                 dir="ltr"
//                 footer={null}
//             >
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '10px' }}>
//                     {hours.map((hour) => {
//                         const isMyHour = mySelectedHour?.includes(hour); // שעות שהתלמיד בחר
//                         const isEmpty = selectedHoursForCurrentDate.hoursEmpty.includes(hour); // שעות ריקות

//                         return (
//                             <div
//                                 key={hour}
//                                 style={{
//                                     color: isMyHour
//                                         ? 'green' // שעות שהתלמיד בחר
//                                         : isEmpty
//                                             ? 'red' // שעות ריקות
//                                             : 'black', // שעות שתלמידים אחרים בחרו
//                                     cursor: isEmpty ? 'pointer' : 'not-allowed',
//                                     fontSize: '16px',
//                                     textAlign: 'center',
//                                     padding: '5px',
//                                     border: '1px solid #ddd',
//                                     borderRadius: '5px',
//                                 }}
//                                 onClick={() => {
//                                     if (isEmpty) {
//                                         handleHourClick(hour);
//                                     }
//                                 }}
//                             >
//                                 {hour}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </Dialog>
//         </div>
//     );
// };

// export default SShowHoures;

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const SShowHoures = (props) => {
    // קבלת ה-token מה-Redux
    const accesstoken = useSelector((state) => state.token.token);
    // פענוח ה-token כדי לקבל מידע על המשתמש
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;

    // הפניה ל-Toast להצגת הודעות
    const toast = useRef(null);

    // מצב לשמירת השעות עבור תאריך מסוים
    const [selectedHoursByDate, setSelectedHoursByDate] = useState([]);
    // מצב לשמירת השעה שנבחרה על ידי התלמיד
    const [mySelectedHour, setMySelectedHour] = useState(null);

    // רשימת כל השעות ביום
    const hours = [
        "01:00", "02:00", "03:00", "04:00", "05:00",
        "06:00", "07:00", "08:00", "09:00", "10:00",
        "11:00", "12:00", "13:00", "14:00", "15:00",
        "16:00", "17:00", "18:00", "19:00", "20:00",
        "21:00", "22:00", "23:00", "24:00"
    ];

    // חישוב התאריך הנוכחי מתוך props.date
    console.log("props.date", props.date);
    
    const currentDate = props.date instanceof Date ? props.date : new Date(props.date);
    // המרת התאריך לפורמט YYYY-MM-DD
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    
    // בדיקה אם התאריך חוקי
    const isValidDate = currentDate && !isNaN(currentDate);

    // חישוב השעות עבור התאריך הנוכחי
    const selectedHoursForCurrentDate =
        isValidDate
            ? selectedHoursByDate[currentDate.toLocaleDateString()] || { hoursFull: [], hoursEmpty: [] }
            : { hoursFull: [], hoursEmpty: [] };

    // קריאה לשרת להבאת השעות עבור התאריך הנוכחי
    useEffect(() => {
        const fetchSelectedHours = async () => {
            try {
                console.log('Formatted Date:', formattedDate); // הוסף שורה זו לבדיקה

                const HourRes = await axios({
                    method: 'get',
                    url: `http://localhost:7000/teacher/getClassesByDate/${formattedDate}`,
                    headers: { Authorization: "Bearer " + accesstoken },
                });

                if (HourRes.status === 200) {
                    console.log(HourRes.data);

                    const { hoursFull, hoursEmpty } = HourRes.data;
                    setSelectedHoursByDate((prev) => ({
                        ...prev,
                        [currentDate.toLocaleDateString()]: { hoursFull, hoursEmpty },
                    }));
                    setMySelectedHour(hoursFull); // השעות המלאות הן השעות שהתלמיד בחר
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

        fetchSelectedHours();
    }, [accesstoken, props.date, isValidDate]);

    // פונקציה לטיפול בלחיצה על שעה אדומה
    const handleHourClick = async (hour) => {
        if (!isValidDate) {
            return;
        }

        const selectedDate = currentDate;

        try {
            const HourRes = await axios({
                method: 'post',
                url: 'http://localhost:7000/student/settingLesson',
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
                    detail: 'Hour selected successfully',
                });

                // עדכון השעות לאחר בחירה מוצלחת
                setSelectedHoursByDate((prev) => ({
                    ...prev,
                    [currentDate.toLocaleDateString()]: {
                        ...prev[currentDate.toLocaleDateString()],
                        hoursFull: [...prev[currentDate.toLocaleDateString()].hoursFull, hour],
                        hoursEmpty: prev[currentDate.toLocaleDateString()].hoursEmpty.filter(h => h !== hour),
                    },
                }));
                setMySelectedHour((prev) => [...(prev || []), hour]);
            }
        } catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: e.response?.data?.message || 'An error occurred',
            });
        }
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog
                header={`${isValidDate ? currentDate.toLocaleDateString() : 'Invalid Date'}`}
                visible={props.visible}
                style={{ width: '15vw', height: 'auto' }}
                onHide={() => {
                    props.setVisible(false);
                }}
                dir="ltr"
                footer={null}
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '10px' }}>
                    {hours.map((hour) => {
                        const isMyHour = mySelectedHour?.includes(hour); // שעות שהתלמיד בחר
                        const isEmpty = selectedHoursForCurrentDate.hoursEmpty.includes(hour); // שעות ריקות

                        return (
                            <div
                                key={hour}
                                style={{
                                    color: isMyHour
                                        ? 'green' // שעות שהתלמיד בחר
                                        : isEmpty
                                            ? 'blue' // שעות ריקות
                                            : 'black', // שעות שתלמידים אחרים בחרו
                                    cursor: isEmpty ? 'pointer' : 'not-allowed',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    padding: '5px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                                onClick={() => {
                                    if (isEmpty) {
                                        handleHourClick(hour);
                                    }
                                }}
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

export default SShowHoures;