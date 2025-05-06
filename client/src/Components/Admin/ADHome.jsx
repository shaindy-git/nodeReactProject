
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
