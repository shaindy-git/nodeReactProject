import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const TShowHours = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const toast = useRef(null);
    const [selectedHoursByDate, setSelectedHoursByDate] = useState({});

    const hours = [
        "01:00", "02:00", "03:00", "04:00", "05:00",
        "06:00", "07:00", "08:00", "09:00", "10:00",
        "11:00", "12:00", "13:00", "14:00", "15:00",
        "16:00", "17:00", "18:00", "19:00", "20:00",
        "21:00", "22:00", "23:00", "24:00"
    ];

    const handleHourClick = async (hour) => {
        const currentDate = props.date ? props.date.toLocaleDateString() : null;

        if (!currentDate) {
            return;
        }

        const currentSelection = selectedHoursByDate[currentDate] || [];
        

        // אם השעה כבר נבחרה, אל תעשה כלום
        if (currentSelection.includes(hour)) {
            return;
        }

        try {
            const HourRes = await axios({
                method: 'put',
                url: 'http://localhost:7000/teacher/addAvailableClasses',
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    "date": currentDate,
                    "hour": hour
                }
            });

            if (HourRes.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Hour added successfully' });
            }
        } catch (e) {
            if (e.response?.status === 400) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Bad request' });
            } else {
                console.error("Error in TShowHours");
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred' });
            }
        }

        setSelectedHoursByDate(prev => ({
            ...prev,
            [currentDate]: [...currentSelection, hour] // הוספת השעה
        }));
    };

    const currentDate = props.date ? props.date.toLocaleDateString() : null;
    const selectedHoursForCurrentDate = currentDate ? selectedHoursByDate[currentDate] || [] : [];

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog
                header={`${currentDate}`}
                visible={props.visibleD}
                style={{ width: '15vw', height: "auto" }}
                onHide={() => { props.setVisibleD(false); }}
                dir="ltr"
                footer={null}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {hours.map((hour) => (
                        <div
                            key={hour}
                            style={{
                                color: selectedHoursForCurrentDate.includes(hour) ? 'red' : 'black',
                                cursor: 'pointer',
                                margin: '5px',
                                fontSize: '16px'
                            }}
                            onClick={() => handleHourClick(hour)}
                        >
                            {hour}
                        </div>
                    ))}
                </div>
            </Dialog>
        </div>
    );
}

export default TShowHours;



