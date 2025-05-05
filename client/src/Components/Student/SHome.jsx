// import React, { useState, useRef } from "react";
// import { Menu } from "primereact/menu";
// import { OverlayPanel } from "primereact/overlaypanel"; // רכיב להצגת מידע מתחת לשדה
// import { Editor } from "primereact/editor";
// import { Button } from "primereact/button";
// import { Toast } from "primereact/toast";
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';

// const SHome = () => {
//     const [showEditor, setShowEditor] = useState(false); // מצב להצגת האדיטור
//     const [text, setText] = useState(''); // טקסט שמוזן באדיטור
//     const accesstoken = useSelector((state) => state.token.token); // טוקן עבור הרשאות
//     const toast = useRef(null); // הפניה ל-Toast
//     const overlayPanel = useRef(null); // הפניה ל-OverlayPanel
//     const decoded = accesstoken ? jwtDecode(accesstoken) : null;
//     const [teacher, setTeacher] = useState(decoded.myTeacher);
//     const [myTeacher, setMyTeacher] = useState({}); // שמירת פרטי המורה
//     const [lessonsLearned, setLessonsLearned] = useState(0); // מספר שיעורים שנלמדו
//     const [lessonsRemaining, setLessonsRemaining] = useState(0); // מספר שיעורים שנותרו
//     const [overlayContent, setOverlayContent] = useState(null); // תוכן דינמי עבור OverlayPanel

//     // פונקציה ששולחת את ההמלצה לשרת
//     const sendRecommendation = async () => {
//         try {
//             const res = await axios({
//                 method: 'put',
//                 url: 'http://localhost:7000/student/addRecommendation',
//                 headers: { Authorization: "Bearer " + accesstoken },
//                 data: {
//                     "rec": text // שליחת התוכן של המשתנה text
//                 }
//             });
//             if (res.status === 200) {
//                 toast.current.show({ severity: 'success', summary: 'Success', detail: 'Recommendation sent successfully!', life: 3000 });
//             }
//         } catch (e) {
//             console.error("Error:", e.response?.status || "Unknown error");
//             toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to send recommendation. Please try again.', life: 3000 });
//         }
//     };

//     // פונקציה שמביאה את המורה מהשרת
//     const getMyTeacher = async (event) => {
//         try {
//             const res = await axios({
//                 method: 'get',
//                 url: 'http://localhost:7000/student/getmyteacher',
//                 headers: { Authorization: "Bearer " + accesstoken },
//             });
//             if (res.status === 200) {
//                 setMyTeacher(res.data); // שמירת הנתונים של המורה
//                 setOverlayContent(
//                     <div>
//                         <p><strong>Teacher Name:</strong> {res.data.firstName} {res.data.lastName}</p>
//                         <p><strong>Email:</strong> {res.data.email}</p>
//                     </div>
//                 );
//                 overlayPanel.current.toggle(event); // פתיחת החלון
//             }
//         } catch (e) {
//             console.error("Error:", e.response?.status || "Unknown error");
//             toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load teacher', life: 3000 });
//         }
//     };

//     // פונקציה שמביאה את מספר השיעורים שנלמדו
//     const getLessonsLearned = async (event) => {
//         try {
//             const res = await axios({
//                 method: 'get',
//                 url: 'http://localhost:7000/student/getLessonsLearned',
//                 headers: { Authorization: "Bearer " + accesstoken },
//             });
//             if (res.status === 200) {
//                 setLessonsLearned(res.data.lessonsLearned); // שמירת מספר השיעורים שנלמדו
//                 setOverlayContent(
//                     <p><strong>Lessons Learned:</strong> {res.data.lessonsLearned}</p>
//                 );
//                 overlayPanel.current.toggle(event); // פתיחת החלון
//             }
//         } catch (e) {
//             console.error("Error:", e.response?.status || "Unknown error");
//             toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load lessons learned', life: 3000 });
//         }
//     };

//     // פונקציה שמביאה את מספר השיעורים שנותרו
//     const getLessonsRemaining = async (event) => {
//         try {
//             const res = await axios({
//                 method: 'get',
//                 url: 'http://localhost:7000/student/getLessonsRemaining',
//                 headers: { Authorization: "Bearer " + accesstoken },
//             });
//             if (res.status === 200) {
//                 setLessonsRemaining(res.data.lessonsRemaining); // שמירת מספר השיעורים שנותרו
//                 setOverlayContent(
//                     <p><strong>Lessons Remaining:</strong> {res.data.lessonsRemaining}</p>
//                 );
//                 overlayPanel.current.toggle(event); // פתיחת החלון
//             }
//         } catch (e) {
//             console.error("Error:", e.response?.status || "Unknown error");
//             toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load lessons remaining', life: 3000 });
//         }
//     };

//     // פונקציה שמייצרת את הכותרת של האדיטור (כפתורים לעיצוב)
//     const renderHeader = () => {
//         return (
//             <span className="ql-formats">
//                 {/* שינוי גודל טקסט */}
//                 <select className="ql-size" aria-label="Font Size">
//                     <option value="small">Small</option>
//                     <option defaultValue>Normal</option>
//                     <option value="large">Large</option>
//                 </select>

//                 {/* עיצוב טקסט */}
//                 <button className="ql-bold" aria-label="Bold"></button>
//                 <button className="ql-underline" aria-label="Underline"></button>
//                 <button className="ql-strike" aria-label="Strike-through"></button> {/* קו חוצה */}

//                 {/* צבע טקסט */}
//                 <select className="ql-color" aria-label="Text Color"></select>
//                 <select className="ql-background" aria-label="Highlight"></select> {/* הדגשה (רקע) */}

//                 {/* יישור טקסט */}
//                 <select className="ql-align" aria-label="Text Alignment">
//                     <option defaultValue></option>
//                     <option value="center"></option>
//                     <option value="right"></option>
//                     <option value="justify"></option>
//                 </select>

//                 {/* רשימה עם נקודות */}
//                 <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
//             </span>
//         );
//     };

//     const header = renderHeader(); // הכותרת של האדיטור

//     // פריטים בתפריט הניווט
//     let items = [
//         ...(teacher ? [{
//             label: 'MyTeacher',
//             icon: 'pi pi-user',
//             command: (event) => getMyTeacher(event.originalEvent), // הפעלת הפונקציה בלחיצה
//         },{
//             label: 'Area',
//             icon: 'pi pi-map-marker',
//         },] : [
//             {
//                 label: 'Selection Teacher',
//                 icon: 'pi pi-filter',
//             },
//         ]),
//         {
//             label: 'Test',
//             icon: 'pi pi-car',
//         },
//         {
//             label: 'LessonsLearned',
//             icon: 'pi pi-chevron-circle-left',
//             command: (event) => getLessonsLearned(event.originalEvent), // הפעלת הפונקציה בלחיצה
//         },
//         {
//             label: 'LessonsRemaining',
//             icon: 'pi pi-chevron-circle-right',
//             command: (event) => getLessonsRemaining(event.originalEvent), // הפעלת הפונקציה בלחיצה
//         },
//         {
//             template: () => (
//                 <hr style={{
//                     border: "0",
//                     height: "1px",
//                     background: "linear-gradient(to right, #ccc, #eee, #ccc)",
//                     margin: "0.5rem 0"
//                 }} />
//             )
//         },
//         {
//             label: 'Add Recommendation To Your Teacher',
//             icon: 'pi pi-plus-circle',
//         },
//     ];

//     return (
//         <div className="card flex justify-content-end" style={{ position: "relative" }}>
//             <Menu model={items} className="w-full md:w-15rem" dir="ltr" />
//             <Toast ref={toast} />
//             <OverlayPanel ref={overlayPanel} style={{ width: '300px' }}>
//                 <div dir="ltr">{overlayContent}</div>
//             </OverlayPanel>

//             <div
//                 style={{
//                     height: "130%",
//                     position: "absolute",
//                     right: "15",
//                     top: "100%",
//                     width: "11.2%",
//                 }}
//             >
//                 <Editor
//                     value={text}
//                     onTextChange={(e) => setText(e.htmlValue || '')}
//                     headerTemplate={header}
//                     style={{ height: "300px" }}
//                 />

//                 <Button
//                     label="Add Recommendation"
//                     icon="pi pi-check"
//                     onClick={sendRecommendation}
//                     className="p-button"
//                     style={{
//                         marginTop: "0.5rem",
//                         width: "100%",
//                         backgroundColor: "#000",
//                         color: "#fff",
//                         fontSize: "0.8rem",
//                         textTransform: "none",
//                         borderRadius: "12px",
//                         border: "none",
//                     }}
//                 />
//             </div>
//         </div>
//     );
// };

// export default SHome;

import React, { useState, useRef, useEffect } from "react";
import { Menu } from "primereact/menu";
import { OverlayPanel } from "primereact/overlaypanel"; // רכיב להצגת מידע מתחת לשדה
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const SHome = () => {
    const [showEditor, setShowEditor] = useState(false); // מצב להצגת האדיטור
    const [text, setText] = useState(''); // טקסט שמוזן באדיטור
    const accesstoken = useSelector((state) => state.token.token); // טוקן עבור הרשאות
    const toast = useRef(null); // הפניה ל-Toast
    const overlayPanel = useRef(null); // הפניה ל-OverlayPanel
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const [teacher, setTeacher] = useState(null);
    const [myTeacher, setMyTeacher] = useState({}); // שמירת פרטי המורה
    const [lessonsLearned, setLessonsLearned] = useState(0); // מספר שיעורים שנלמדו
    const [lessonsRemaining, setLessonsRemaining] = useState(0); // מספר שיעורים שנותרו
    const [area, setArea] = useState()
    const [test, setTest] = useState()
    const [overlayContent, setOverlayContent] = useState(null); // תוכן דינמי עבור OverlayPanel

    // פונקציה ששולחת את ההמלצה לשרת
    const sendRecommendation = async () => {
        try {
            const res = await axios({
                method: 'put',
                url: 'http://localhost:7000/student/addRecommendation',
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    "rec": text // שליחת התוכן של המשתנה text
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

    // פונקציה שמביאה את המורה מהשרת
    const getMyTeacher = async (event) => {
        try {
            const res = await axios({
                method: 'get',
                url: 'http://localhost:7000/student/getmyteacher',
                headers: { Authorization: "Bearer " + accesstoken },
            });
            if (res.status === 200) {
                setMyTeacher(res.data); // שמירת הנתונים של המורה
                setArea(res.data.area)
                setOverlayContent(
                    <div>
                        <p><strong>Teacher Name:</strong> {res.data.firstName} {res.data.lastName}</p>
                        <p><strong>Email:</strong> {res.data.email}</p>
                    </div>
                );
                overlayPanel.current.toggle(event); // פתיחת החלון
            }
        } catch (e) {
            console.error("Error:", e.response?.status || "Unknown error");
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load teacher', life: 3000 });
        }
    };

    const showAreaDetails = (event) => {
        if (area) {
            setOverlayContent(
                <div>
                    <p><strong>Area:</strong> {area}</p> {/* הצגת האזור */}
                </div>
            );
            overlayPanel.current.toggle(event); // פתיחת החלון
        } else {
            toast.current.show({ severity: 'info', summary: 'Info', detail: 'No area information available.', life: 3000 });
        }
    };

    // פונקציה שמביאה את מספר השיעורים שנלמדו
    const getLessonsLearned = async (event) => {
        try {
            const res = await axios({
                method: 'get',
                url: 'http://localhost:7000/student/getLessonsLearned',
                headers: { Authorization: "Bearer " + accesstoken },
            });
            if (res.status === 200) {
                setLessonsLearned(res.data.lessonsLearned); // שמירת מספר השיעורים שנלמדו
                setOverlayContent(
                    <p><strong>Lessons Learned:</strong> {res.data.lessonsLearned}</p>
                );
                overlayPanel.current.toggle(event); // פתיחת החלון
            }
        } catch (e) {
            console.error("Error:", e.response?.status || "Unknown error");
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load lessons learned', life: 3000 });
        }
    };

    // פונקציה שמביאה את מספר השיעורים שנותרו
    const getLessonsRemaining = async (event) => {
        try {
            const res = await axios({
                method: 'get',
                url: 'http://localhost:7000/student/getLessonsRemaining',
                headers: { Authorization: "Bearer " + accesstoken },
            });
            if (res.status === 200) {
                setLessonsRemaining(res.data.lessonsRemaining); // שמירת מספר השיעורים שנותרו
                setOverlayContent(
                    <p><strong>Lessons Remaining:</strong> {res.data.lessonsRemaining}</p>
                );
                overlayPanel.current.toggle(event); // פתיחת החלון
            }
        } catch (e) {
            console.error("Error:", e.response?.status || "Unknown error");
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load lessons remaining', life: 3000 });
        }
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
    
                if (status === 'false' || status === 'request') {
                    setOverlayContent(
                        <p><strong>Test Status:</strong> {status}</p>
                    );
                } else if (status === 'test') {
                    setOverlayContent(
                        <div>
                            <p><strong>Test Status:</strong> {status}</p>
                            <p><strong>Date:</strong> {testDate}</p>
                            <p><strong>Hour:</strong> {testHour}</p>
                        </div>
                    );
                }
    
                overlayPanel.current.toggle(event); // פתיחת החלון
            }
        } catch (e) {
            console.error("Error:", e.response?.status || "Unknown error");
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load test details', life: 3000 });
        }
    };
    // פונקציה שמייצרת את הכותרת של האדיטור (כפתורים לעיצוב)
    const renderHeader = () => {
        return (
            <span className="ql-formats">
                {/* שינוי גודל טקסט */}
                <select className="ql-size" aria-label="Font Size">
                    <option value="small">Small</option>
                    <option defaultValue>Normal</option>
                    <option value="large">Large</option>
                </select>

                {/* עיצוב טקסט */}
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-strike" aria-label="Strike-through"></button> {/* קו חוצה */}

                {/* צבע טקסט */}
                <select className="ql-color" aria-label="Text Color"></select>
                <select className="ql-background" aria-label="Highlight"></select> {/* הדגשה (רקע) */}

                {/* יישור טקסט */}
                <select className="ql-align" aria-label="Text Alignment">
                    <option defaultValue></option>
                    <option value="center"></option>
                    <option value="right"></option>
                    <option value="justify"></option>
                </select>

                {/* רשימה עם נקודות */}
                <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
            </span>
        );
    };

    const header = renderHeader(); // הכותרת של האדיטור

    // פריטים בתפריט הניווט
    let items = [
        ...(teacher ? [{
            label: 'MyTeacher',
            icon: 'pi pi-user',
            command: (event) => getMyTeacher(event.originalEvent), // הפעלת הפונקציה בלחיצה
        },{
            label: 'Area',
            icon: 'pi pi-map-marker',
            command: (event) => showAreaDetails(event.originalEvent), // הפעלת הפונקציה להצגת פרטי האזור
        },
        ] : [
            {
                label: 'Selection Teacher',
                icon: 'pi pi-filter',
            },
        ]),
        {
            label: 'Test',
            icon: 'pi pi-car',
            command: (event) => getTest(event.originalEvent),
        },
        {
            label: 'LessonsLearned',
            icon: 'pi pi-chevron-circle-left',
            command: (event) => getLessonsLearned(event.originalEvent), // הפעלת הפונקציה בלחיצה
        },
        {
            label: 'LessonsRemaining',
            icon: 'pi pi-chevron-circle-right',
            command: (event) => getLessonsRemaining(event.originalEvent), // הפעלת הפונקציה בלחיצה
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
        if (decoded && decoded.myTeacher) {
            setTeacher(decoded.myTeacher);
        }
    }, [decoded]);
    return (
        <div className="card flex justify-content-end" style={{ position: "relative" }}>
            <Menu model={items} className="w-full md:w-15rem" dir="ltr" />
            <Toast ref={toast} />
            <OverlayPanel ref={overlayPanel} style={{ width: '300px' }}>
                <div dir="ltr">{overlayContent}</div>
            </OverlayPanel>

            <div
                style={{
                    height: "130%",
                    position: "absolute",
                    right: "15",
                    top: "100%",
                    width: "11.2%",
                }}
            >
                <Editor
                    value={text}
                    onTextChange={(e) => setText(e.htmlValue || '')}
                    headerTemplate={header}
                    style={{ height: "300px" }}
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