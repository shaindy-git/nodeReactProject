import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from "primereact/button";

const SShowHoures = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const toast = useRef(null);
    const op = useRef(null);

    const [selectedHourType, setSelectedHourType] = useState('');
    const [selectedHourToSet, setSelectedHourToSet] = useState('');
    const [selectedHoursByDate, setSelectedHoursByDate] = useState({});
    const [mySelectedHour, setMySelectedHour] = useState(null);

    const hours = [
        "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00",
        "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
        "21:00", "22:00", "23:00", "24:00"
    ];

    const currentDate = props.date instanceof Date ? props.date : new Date(props.date);
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const isValidDate = currentDate && !isNaN(currentDate);

    const selectedHoursForCurrentDate =
        isValidDate
            ? selectedHoursByDate[currentDate.toLocaleDateString()] || { hoursFull: [], hoursEmpty: [], hoursLessons: [], hoursTests: [] }
            : { hoursFull: [], hoursEmpty: [], hoursLessons: [], hoursTests: [] };

    useEffect(() => {
        const fetchSelectedHours = async () => {
            try {
                const HourRes = await axios({
                    method: 'get',
                    url: `http://localhost:7000/teacher/getClassesByDate/${formattedDate}`,
                    headers: { Authorization: "Bearer " + accesstoken },
                });

                if (HourRes.status === 200) {
                    const { hoursFull, hoursEmpty, hoursLessons, hoursTests } = HourRes.data;

                    setSelectedHoursByDate((prev) => ({
                        ...prev,
                        [currentDate.toLocaleDateString()]: {
                            hoursFull,
                            hoursEmpty,
                            hoursLessons,
                            hoursTests,
                        },
                    }));

                    setMySelectedHour(hoursFull);
                }
            } catch (e) {
                if (e.response?.status === 404) {
                    setSelectedHoursByDate((prev) => ({
                        ...prev,
                        [currentDate.toLocaleDateString()]: {
                            hoursFull: [],
                            hoursEmpty: [],
                            hoursLessons: [],
                            hoursTests: [],
                        },
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

    const handleHourClick = async (hour) => {
        if (!isValidDate) return;

        const selectedDate = currentDate;
        const isoDateUTC = new Date(
            selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
        ).toISOString().replace("Z", "+00:00");

        try {
            const HourRes = await axios({
                method: 'put',
                url: 'http://localhost:7000/student/settingLesson',
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    date: isoDateUTC,
                    hour: hour,
                },
            });

            if (HourRes.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Hour selected successfully',
                });

                setSelectedHoursByDate((prev) => {
                    const prevDateData = prev[currentDate.toLocaleDateString()];
                    return {
                        ...prev,
                        [currentDate.toLocaleDateString()]: {
                            ...prevDateData,
                            hoursFull: [...prevDateData.hoursFull, hour],
                            hoursEmpty: prevDateData.hoursEmpty.filter(h => h !== hour),
                            hoursLessons: [...prevDateData.hoursLessons, hour],
                        },
                    };
                });

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

    const getHourType = (hour) => {
        if (selectedHoursForCurrentDate.hoursLessons.includes(hour)) return 'Lesson';
        if (selectedHoursForCurrentDate.hoursTests.includes(hour)) return 'Test';
        return '';
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog
                header={`${isValidDate ? currentDate.toLocaleDateString() : 'Invalid Date'}`}
                visible={props.visible}
                style={{ width: '25vw', height: 'auto' }}
                modal
                onHide={() => {
                    props.setVisible(false);
                }}
                dir="ltr"
                footer={null}
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', padding: '10px' }}>
                    {hours.map((hour) => {
                        const isMyHour = mySelectedHour?.includes(hour);
                        const isEmpty = selectedHoursForCurrentDate.hoursEmpty.includes(hour);
                        const hourType = getHourType(hour);

                        return (
                            <div
                                key={hour}
                                style={{
                                    color: isMyHour ? 'green' : isEmpty ? 'blue' : '#999',
                                    cursor: (isEmpty || isMyHour) ? 'pointer' : 'default',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    padding: '5px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    opacity: isEmpty || isMyHour ? 1 : 0.5,
                                }}
                                onClick={(e) => {
                                    setSelectedHourToSet('');
                                    setSelectedHourType('');
                                    op.current?.hide();
                                    setTimeout(() => {
                                        if (isEmpty) {
                                            setSelectedHourToSet(hour);
                                            op.current?.toggle(e);
                                        } else if (isMyHour) {
                                            const type = getHourType(hour);
                                            setSelectedHourType(type);
                                            op.current?.toggle(e);
                                        }
                                    }, 0);
                                }}
                                title={isMyHour ? `Type: ${hourType}` : ''}
                            >
                                {hour}
                            </div>
                        );
                    })}
                </div>
                <OverlayPanel ref={op}>
                    {selectedHourToSet ? (
                        <div style={{ padding: '5px', fontSize: '14px' }} dir='ltr'>
                            <p>date: {formattedDate}</p>
                            <p>hour: {selectedHourToSet}</p>
                            <Button
                                label="Set a lesson"
                                icon="pi pi-clock"
                                onClick={() => {
                                    handleHourClick(selectedHourToSet);
                                    op.current?.hide();
                                    setSelectedHourToSet('');
                                }}
                                style={{
                                    marginTop: "0.5rem",
                                    width: "100%",
                                    backgroundColor: "#000",
                                    color: "#fff",
                                    fontSize: "0.8rem",
                                    textTransform: "none",
                                    borderRadius: "12px",
                                    border: "none"
                                }}
                            />
                        </div>
                    ) : (
                        <div style={{ padding: '5px', fontSize: '14px' }}>
                            <p><strong>Type:</strong> {selectedHourType || 'unknown'}</p>
                        </div>
                    )}
                </OverlayPanel>
            </Dialog>
        </div>
    );
};

export default SShowHoures;

