import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { setToken, logOut } from '../../redux/tokenSlice'


const MShowstudent = (props) => {
    const idS = props.student ? props.student._id : null;
    const accesstoken = useSelector((state) => state.token.token);
    const [teacher, setTeacher] = useState([]);
    const toast = useRef(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        if (props.student) {
            Teacher();
        }
    }, [idS]);

    const Teacher = async () => {
        try {

            const res = await axios({
                method: 'get',
                url: `http://localhost:7000/teacher/getTeacherById/${props.student.myTeacher}`,
                headers: {},
            });
            if (res.status === 200) {

                setTeacher([res.data]);
            }

        } catch (e) {
            if (e.response && e.response.status === 400) {
                setTeacher([]);
            } else {
                console.error(e);
                alert("Unauthorized user - S / MShowStudent");
            }
        }


    };

    const deleteStudent = async () => {
        try {
            const res = await axios({
                method: 'DELETE',
                url: `http://localhost:7000/student/deleteStudent`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    studentID: props.student._id
                }
            });

            if (res.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'The student was successfully deleted',
                    life: 2000
                });

                  await props.fetchData();

                props.removeStudent(props.student._id);

                setTimeout(() => {
                    props.setVisibleS(false);
                }, 2000);



                try {
                    const teacherRes = await axios({
                        method: 'get',
                        url: 'http://localhost:7000/teacher/getAllTeachers',
                        headers: { Authorization: "Bearer " + accesstoken },
                    });
                    if (teacherRes.status === 200) {
                        props.setTeachers(teacherRes.data);
                    }
                } catch (e) {
                    if (e.response && e.response.status === 400) {
                        props.setTeachers([]);
                    } else {
                        console.error(e);
                        alert("Unauthorized user - T / MShowStudent");
                    }
                }
            }

        } catch (e) {
            console.error(e);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete student',
                life: 2000
            });
        }
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog
                header={`${props.student ? `${props.student.firstName} ${props.student.lastName}` : "No student selected."}`}
                visible={props.visibleS}
                style={{ width: '25vw', height: "25vw" }}
                onHide={() => { props.setVisibleS(false); }}
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
                            onClick={deleteStudent}
                        />
                    </div>
                }
            >
                {props.student ? (
                    <div className="student-details">
                        <div className="student-info" ><span style={{ fontWeight: "bold" }}>Name: </span> <span className="info-value">{props.student.firstName} {props.student.lastName}</span></div>
                        <div className="student-info" ><span style={{ fontWeight: "bold" }}>Email: </span><span className="info-value">{props.student.email}</span></div>
                        <div className="student-info" ><span style={{ fontWeight: "bold" }}>Phone: </span><span className="info-value">{props.student.phone}</span></div>
                        <div className="student-info" ><span style={{ fontWeight: "bold" }}>Teacher: </span><span className="info-value">{teacher.length > 0 ? `${teacher[0].firstName} ${teacher[0].lastName}` : "Not assigned"}</span></div>
                    </div>
                ) : (
                    <div>No student selected.</div>
                )}
            </Dialog>
        </div>
    );
}

export default MShowstudent;