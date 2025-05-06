// //------------------------------------------
// import React, { useState, useEffect, useRef } from 'react';
// import { Button } from 'primereact/button';
// import ADFormgAdd from "./ADFormgAdd";
// import ADFormgChange from "./ADFormgChange";
// import axios from 'axios';
// import { ListBox } from 'primereact/listbox';
// import { useSelector } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';
// import { Toast } from 'primereact/toast';
// import { Calendar } from 'primereact/calendar';
// import { Card } from 'primereact/card';
// import { Paginator } from 'primereact/paginator';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';

// import './ADHome.css';

// const ADHome = () => {
//     const [visibleAdd, setVisibleAdd] = useState(false); // סטייט לניהול חלון הוספת מנהל
//     const [visibleChange, setVisibleChange] = useState(false); // סטייט לניהול חלון שינוי פרטים
//     const [managers, setManagers] = useState([]); // סטייט לניהול רשימת המנהלים
//     const accesstoken = useSelector((state) => state.token.token);
//     const decoded = accesstoken ? jwtDecode(accesstoken) : null;
//     const toast = useRef(null); // רפ למערכת התראות


//     useEffect(() => {

//         const getAllManagers = async () => {
//             try {
//                 const managerres = await axios.get('http://localhost:7000/manager/getAllManagers', {
//                     headers: { Authorization: "Bearer " + accesstoken },
//                 });
//                 if (managerres.status === 200) {
//                     console.log(managerres.data.managers);

//                     setManagers(managerres.data.managers);

//                     console.log("Managers fetched successfully:", managerres.data.managers);

//                 }
//             } catch (e) {
//                 if (e.response?.status === 400) { }
//                 else console.error("Unauthorized user - fetchStudents");
//             }
//         };


//         getAllManagers();
//     }, [accesstoken])

//     return (
//         <>
//             <Button
//                 label="Manager Register"
//                 icon="pi pi-user-plus"
//                 severity="success"
//                 className="w-10rem"
//                 onClick={() => {
//                     console.log("Opening Add Manager Dialog");
//                     setVisibleAdd(true);
//                 }}
//             />


//             <div className="card">

//                 <div
//                     style={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         height: '100vh', // מרכז אנכית
//                         padding: '1rem',
//                     }}
//                 >
//                     <DataTable
//                         value={managers}
//                         tableStyle={{
//                             width: '50%', // חצי רוחב העמוד
//                             maxWidth: '90%', // רספונסיבי למסכים קטנים יותר
//                             minWidth: '50rem', // מינימום רוחב
//                             margin: '0 auto', // מרכז אופקית
//                             textAlign: 'center', // מרכז את התוכן בטבלה
//                         }}
//                     >
//                         {/* עמודה ראשונה - School Area */}
//                         <Column
//                             field="area"
//                             header="School Area"
//                             body={(rowData) => rowData.area}
//                             style={{ width: '10%' }}
//                             className="text-center"
//                         />

//                         {/* עמודה שנייה - Manager Name */}
//                         <Column
//                             field="name"
//                             header="Manager Name"
//                             body={(rowData) => `${rowData.firstName} ${rowData.lastName}`}
//                             style={{ width: '10%' }}
//                             className="text-center"
//                         />

//                         {/* עמודה שלישית - כפתור Change */}
//                         <Column
//                             header="change Manager"
//                             body={(rowData) => (
//                                 <div style={{ display: 'flex', justifyContent: 'center' }}>
//                                     <Button
//                                         icon="pi pi-pencil"
//                                         className="p-button-warning"
//                                         style={{
//                                             width: '6rem',
//                                             backgroundColor: 'black',
//                                             color: 'white',
//                                             border: 'none', // Ensures no border from the inline style
//                                         }}
//                                         onClick={setVisibleChange(true)}
//                                     // onClick={() => console.log(`Change clicked for ${rowData.area}`)}
//                                     />
//                                 </div>
//                             )}
//                             style={{ width: '10%' }}
//                             className="text-center"
//                         />

//                         {/* עמודה רביעית - כפתור Delete */}
//                         <Column
//                             header="Delete School"
//                             body={(rowData) => (
//                                 <div style={{ display: 'flex', justifyContent: 'center' }}>
//                                     <Button
//                                         icon="pi pi-trash"
//                                         className="p-button-danger"
//                                         style={{
//                                             width: '6rem',
//                                             backgroundColor: 'black',
//                                             color: 'white',
//                                             border: 'none', // Ensures no border from the inline style
//                                         }}
//                                         onClick={setVisibleChange(true)}
//                                     />
//                                 </div>
//                             )}
//                             style={{ width: '10%' }}
//                             className="text-center"
//                         />
//                     </DataTable>
//                 </div>

//                 <Button
//                     // label="Manager Update"
//                     icon="pi pi-user-plus"
//                     severity="success"
//                     className="w-10rem"
//                     onClick={setVisibleChange(true)}
//                 />
//             </div>
//             {visibleAdd && (
//                 <ADFormgAdd
//                     setVisibleAdd={setVisibleAdd}
//                     visibleAdd={visibleAdd}
//                 />
//             )}

//             {visibleChange && (
//                 <ADFormgChange
//                     setVisibleChange={setVisibleChange}
//                     visibleChange={visibleChange}
//                 />
//             )}
//         </>
//     );
// };

// export default ADHome;



import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import ADFormgAdd from "./ADFormgAdd";
import ADFormgChange from "./ADFormgChange";
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const ADHome = () => {
    const [visibleAdd, setVisibleAdd] = useState(false); // ניהול חלון הוספה
    const [visibleChange, setVisibleChange] = useState(false); // ניהול חלון שינוי
    const [managers, setManagers] = useState([]); // רשימת המנהלים
    const [selectedManager, setSelectedManager] = useState(null); // מנהל שנבחר לשינוי
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;

    useEffect(() => {
        const getAllManagers = async () => {
            try {
                const managerres = await axios.get('http://localhost:7000/manager/getAllManagers', {
                    headers: { Authorization: "Bearer " + accesstoken },
                });
                if (managerres.status === 200) {
                    setManagers(managerres.data.managers);
                }
            } catch (e) {
                console.error("Error fetching managers:", e);
            }
        };

        if (accesstoken) {
            getAllManagers();
        }
    }, [accesstoken]);

    const openChangeDialog = (manager) => {
        setSelectedManager(manager); // שמירת המנהל שנבחר
        setVisibleChange(true); // פתיחת חלון שינוי
    };

    return (
        <>
            {/* כפתור הוספת מנהל */}
            <Button
                label="Manager Register"
                icon="pi pi-user-plus"
                severity="success"
                className="w-10rem"
                onClick={() => setVisibleAdd(true)}
            />

            <div className="card" style={{ padding: '1rem' }}>
                {/* טבלת מנהלים */}
                <DataTable
                    value={managers}
                    header="Managers List"
                    paginator
                    rows={10}
                    style={{ margin: '0 auto', maxWidth: '80%', textAlign: 'center' }}
                >
                    <Column
                        field="area"
                        header="School Area"
                        style={{ textAlign: 'center' }}
                    />
                    <Column
                        field="name"
                        header="Manager Name"
                        body={(rowData) => `${rowData.firstName} ${rowData.lastName}`}
                        style={{ textAlign: 'center' }}
                    />
                    <Column
                        header="Change Manager"
                        body={(rowData) => (
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-warning"
                                onClick={() => openChangeDialog(rowData)}
                            />
                        )}
                        style={{ textAlign: 'center' }}
                    />
                    <Column
                        header="Delete Manager"
                        body={(rowData) => (
                            <Button
                                icon="pi pi-trash"
                                className="p-button-danger"
                                onClick={() => console.log(`Delete manager with ID: ${rowData.id}`)}
                            />
                        )}
                        style={{ textAlign: 'center' }}
                    />
                </DataTable>
            </div>

            {/* חלון הוספה */}
            {visibleAdd && (
                <ADFormgAdd
                    setVisibleAdd={setVisibleAdd}
                    visibleAdd={visibleAdd}
                />
            )}

            {/* חלון שינוי */}
            {visibleChange && selectedManager && (
                <ADFormgChange
                    setVisibleChange={setVisibleChange}
                    visibleChange={visibleChange}
                    manager={selectedManager} // העברת המנהל שנבחר
                />
            )}
        </>
    );
};

export default ADHome;
// //----------------------------------