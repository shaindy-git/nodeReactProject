import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import ADFormgAdd from "./ADFormgAdd";
import ADFormgChange from "./ADFormgChange";
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const ADHome = () => {
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleChange, setVisibleChange] = useState(false);
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    const [change, setChange] = useState(null);
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
    }, [accesstoken, change]);

    const openChangeDialog = (manager) => {
        setSelectedManager(manager);
        setVisibleChange(true);
    };

    return (
        <>
            {/* כפתור הוספת מנהל */}
            <div className="add-button-wrapper">
                <Button
                    label=" Add Manager"
                    icon="pi pi-user-plus"
                    className="w-10rem custom-black-button"
                    onClick={() => setVisibleAdd(true)}
                />
            </div>

            <div className="card table-wrapper">
                <DataTable
                    value={managers}
                    header="Managers List"
                    paginator
                    rows={5}
                    style={{ margin: '0 auto' }}
                >
                    <Column
                        field="area"
                        header="School Area"
                        style={{ textAlign: 'center' }}
                        headerStyle={{ textAlign: 'center', justifyContent: 'center' }}
                        bodyStyle={{ textAlign: 'center' }}
                    />
                    <Column
                        field="name"
                        header="Manager Name"
                        body={(rowData) => `${rowData.firstName} ${rowData.lastName}`}
                        style={{ textAlign: 'center' }}
                        headerStyle={{ textAlign: 'center', justifyContent: 'center' }}
                        bodyStyle={{ textAlign: 'center' }}
                    />
                    <Column
                        header="Change Manager"
                        body={(rowData) => (
                            <Button
                                icon="pi pi-pencil"
                                className="custom-black-button"
                                onClick={() => openChangeDialog(rowData)}
                            />
                        )}
                        style={{ textAlign: 'center' }}
                        headerStyle={{ textAlign: 'center', justifyContent: 'center' }}
                        bodyStyle={{ textAlign: 'center' }}
                    />
                </DataTable>
            </div>

            {visibleAdd && (
                <ADFormgAdd
                    setVisibleAdd={setVisibleAdd}
                    visibleAdd={visibleAdd}
                    setChange={setChange}
                    setManagers={setManagers}
                />

            )}

            {visibleChange && selectedManager && (
                <ADFormgChange
                    setVisibleChange={setVisibleChange}
                    visibleChange={visibleChange}
                    setManagers={setManagers}
                    manager={selectedManager}
                    setChange={setChange}
                />
            )}

            <style jsx="true">{`
                .custom-black-button {
                    background-color: black !important;
                    color: white !important;
                    border: none !important;
                }

                .custom-black-button:hover {
                    background-color: #333 !important;
                }

                .add-button-wrapper {
                    display: flex;
                    justify-content: center;
                    margin-top: 6rem;
                    margin-bottom: 1rem;
                }

                .table-wrapper {
                    max-width: 800px;
                    margin: 0 auto;
                    overflow-x: auto;
                }

                .p-datatable .p-column-header-content {
                    justify-content: center;
                    text-align: center;
                }

                .p-datatable .p-column-title {
                    width: 100%;
                    text-align: center;
                }

                .p-datatable .p-column-header,
                .p-datatable .p-column-body {
                    text-align: center !important;
                }

                .p-datatable {
                    table-layout: fixed;
                    width: 800px !important;
                }

                ..p-datatable th,
                .p-datatable td {
                white-space: normal;
                overflow-wrap: break-word;
                 word-wrap: break-word;

                 .card {
    overflow-x: hidden !important;
}

.p-datatable {
    width: 800px; /* קובע רוחב קבוע */
    margin: 0 auto;
    table-layout: fixed; /* מונע שינוי גודל עמודות לפי תוכן */
}

.p-datatable th,
.p-datatable td {
    white-space: normal; /* מרשה ירידת שורה */
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: center;
}

}.p-datatable {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    table-layout: fixed;
}

.p-datatable th,
.p-datatable td {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: center;
}

.card {
    overflow-x: hidden !important;
    padding: 1rem;
}

@media screen and (max-width: 600px) {
    .p-datatable {
        font-size: 0.9rem;
    }
}

            `}</style>
        </>
    );
};

export default ADHome;

