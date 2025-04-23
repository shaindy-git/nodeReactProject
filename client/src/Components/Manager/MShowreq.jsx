import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useDispatch } from 'react-redux';
import { setToken, logOut } from '../../redux/tokenSlice'
import { jwtDecode } from 'jwt-decode';
import { useRef } from 'react';

const MShowreq = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const toast = useRef(null);
    const dispatch = useDispatch()



    useEffect(() => {
        // כאן אפשר להוסיף לוגויקה כדי להציג פרטי הבקשה לפי הצורך
    }, [props.req]);

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
                    life: 3000

                });
                //------------------------------------------
                try {
                    const res = await axios({
                        method: 'post',
                        url: 'http://localhost:7000/auth/login',
                        headers: {},
                        data: {
                            userName: props.oldtoken.userName,
                            password: props.oldtoken.password// This is the body part
                        }
                    });

                    if (res.status === 200) {
                        dispatch(setToken(res.data.accessToken))
                        const decoded = accesstoken ? jwtDecode(accesstoken) : null;
                        const Reqlist = decoded ? decoded.RequestList : null;
                        props.setQues(Reqlist)


                    }
                } catch (e) {
                    console.error(e);
                    alert("Unauthorized user")

                }

                //------------------------------------

                props.removeQues(props.req._id);
                props.setVisibleQ(false);



            }
        } catch (e) {
            console.error(e);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete request',
                life: 3000
            });
        }
    };

    const addRequest = async () => {
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
                    detail: 'Teacher added successfully',
                    life: 3000
                });

                props.removeQues(props.req._id);
                props.setVisibleQ(false);

            }
        } catch (e) {
            console.error(e);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add teacher',
                life: 3000
            });
        }
    };


    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog
                header={`${props.req ? `Request Details` : "No request selected."}`}
                visible={props.visibleQ}
                style={{ width: '25vw', height: "25vw" }}
                onHide={() => { props.setVisibleQ(false); }}
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
                                marginRight: '10px', // רווח בין הכפתורים
                            }}
                            aria-label="Delete"
                            onClick={deleteRequest}
                        />

                        <Button
                            icon="pi pi-user-plus" // ניתן לשים סמל אחר אם תרצה
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
                            onClick={addRequest} // פונקציה לסגירת הדיאלוג
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

export default MShowreq;