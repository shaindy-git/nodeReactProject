import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { setToken, logOut } from '../../redux/tokenSlice'


const MShowsreq = (props) => {

    const accesstoken = useSelector((state) => state.token.token);
    const [req, setReq] = useState([]);
    const toast = useRef(null);



    const deleteRequest = async () => {
        try {
            const res = await axios({
                method: 'put',
                url: `http://localhost:7000/manager/removeReqest`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    firstName: props.req.firstName,
                    lastName: props.req.lastName,
                    userName: props.req.userName,
                    numberID: props.req.numberID,
                    dateOfBirth: props.req.dateOfBirth,
                    phone: props.req.phone,
                    email: props.req.email,
                    password: props.req.password,
                    area: props.req.area,
                    gender: props.req.gender
                }
            });

            if (res.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'The request was successfully deleted',
                    life: 2000

                });

                // await props.fetchData();
                props.removeReq(props.req._id);
                setTimeout(() => {
                    props.setVisibleR(false);
                }, 2000);

            }
        } catch (e) {
            console.error(e);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete request',
                life: 2000
            });
        }
    };

    const addTeacher = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: `http://localhost:7000/teacher/addTeacher`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    firstName: props.req.firstName,
                    lastName: props.req.lastName,
                    userName: props.req.userName,
                    numberID: props.req.numberID,
                    dateOfBirth: props.req.dateOfBirth,
                    phone: props.req.phone,
                    email: props.req.email,
                    password: props.req.password,
                    area: props.req.area,
                    gender: props.req.gender
                }
            });

            if (res.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'The request was successfully deleted',
                    life: 2000

                });

                await props.fetchData();
                props.removeReq(props.req._id);
                setTimeout(() => {
                    props.setVisibleR(false);
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
                        alert("Unauthorized user - T / MShowSreq");
                    }
                }

            }
        } catch (e) {
            console.error(e);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete request',
                life: 2000
            });
        }
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog
                header={`${props.req ? `Request Details` : "No request selected."}`}
                visible={props.visibleR}
                style={{ width: '25vw', height: "25vw" }}
                onHide={() => { props.setVisibleR(false); }}
                dir="ltr"
                footer={
                    <div className="dialog-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                                marginRight: '10px',
                            }}
                            aria-label="Delete"
                            onClick={deleteRequest}
                        />

                        <Button
                            icon="pi pi-user-plus"
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
                            }}
                            aria-label="Add"
                        onClick={addTeacher} 
                        />
                    </div>
                }
            >
                {props.req ? (
                    <div className="req-details">
                        <div className="req-info"><span style={{ fontWeight: "bold" }}>Name: </span> <span className="info-value">{props.req.firstName} {props.req.lastName}</span></div>
                        <div className="req-info"><span style={{ fontWeight: "bold" }}>Email: </span><span className="info-value">{props.req.email}</span></div>
                        <div className="req-info"><span style={{ fontWeight: "bold" }}>Phone: </span><span className="info-value">{props.req.phone}</span></div>
                    </div>
                ) : (
                    <div>No Requests selected.</div>
                )}
            </Dialog>
        </div>
    );
}

export default MShowsreq;