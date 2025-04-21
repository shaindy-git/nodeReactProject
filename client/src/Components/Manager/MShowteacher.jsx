import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';


const MShowteacher = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const [studetByTeacher, setStudetByTeacher] = useState([]);
    const toast = useRef(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        if (props.teacher) {
            Studentlist(); // קריאה לפונקציה כדי להביא תלמידים
            
            
        }
    }, [props.teacher]); // ההשפעה תקרה כאשר המורה משתנה

    const Studentlist = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: 'http://localhost:7000/student/getAllStudents',
                headers: { Authorization: "Bearer " + accesstoken },
                data: {}
            });

            if (res.status === 200) {
                
                const filteredStudents = res.data.filter(student => student.myTeacher === props.teacher._id);
                setStudetByTeacher(filteredStudents);
                
            }
        } catch (e) {
            if (e.response && e.response.status === 400) {
                setStudetByTeacher([]);
            } else {
                console.error(e);
            }
        }
    };

    const deleteTeacher = async () => {
        try {
            const res = await axios({
                method: 'DELETE',
                url: `http://localhost:7000/teacher/deleteTeacher`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    teacherID: props.teacher._id
                }
            });

            if (res.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'The teacher was successfully deleted',
                    life: 3000
                });

                // עדכון הרשימה במסך הראשי (MHome)
                props.removeTeacher(props.teacher._id);

                setTimeout(() => {
                    props.setVisibleT(false);
                }, 3000);
            }

        } catch (e) {
            console.error(e);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: e.response?.data?.message || 'Failed to delete teacher',
                life: 3000
            });
        }
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog 
                header={`${props.teacher ? props.teacher.firstName : "No teacher selected."} ${props.teacher && props.teacher.lastName ? props.teacher.lastName : ""}`}
                visible={props.visibleT}
                style={{ width: '25vw', height: "25vw" }}
                onHide={() => { props.setVisibleT(false); }}
                dir="ltr"
                footer={
                                    <div className="dialog-footer">
                                        <Button
                                            icon="pi pi-trash"
                                            style={{
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                border: '2px solid #000000',
                                                color: 'white',
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: 'auto',
                                            }}
                                            aria-label="Delete"
                                            onClick={deleteTeacher}
                                        />
                                    </div>
                                }
            >
                {props.teacher ? (
                    <>
                        <div className="student-info" ><span style={{fontWeight:"bold"}}>Name: </span> <span className="info-value">{props.teacher.firstName} {props.teacher.lastName}</span></div>
                        <div className="student-info" ><span style={{fontWeight:"bold"}}>Email: </span><span className="info-value">{props.teacher.email}</span></div>
                        <div className="student-info" ><span style={{fontWeight:"bold"}}>Phone: </span><span className="info-value">{props.teacher.phone}</span></div>
                        <div>
                            <label htmlFor=""><span style={{fontWeight:"bold"}}>Students: </span></label>
                            {studetByTeacher.map((s) => (
                                <div key={s.id}>{s.firstName} {s.lastName}</div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div>No teacher selected.</div>
                )}
            </Dialog>
        </div>
    );
}

export default MShowteacher