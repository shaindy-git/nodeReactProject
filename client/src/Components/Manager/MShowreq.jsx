import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';


const MShowreq = (props) => {

    const accesstoken = useSelector((state) => state.token.token);
    const toast = useRef(null); 
    const navigate = useNavigate(); 


    const deleteReq = async () => {
        // try {
        //     const res = await axios({
        //         method: 'DELETE',
        //         url: `http://localhost:7000/student/deleteStudent`,
        //         headers: { Authorization: "Bearer " + accesstoken },
        //         data: {
        //             studentID: props.student._id
        //         }
        //     });

        //     if (res.status === 200) {
        //         toast.current.show({
        //             severity: 'success',
        //             summary: 'Success',
        //             detail: 'The student was successfully deleted',
        //             life: 3000
        //         });

        //         props.removeStudent(props.student._id);

        //         setTimeout(() => {
        //             props.setVisibleS(false);
        //         }, 3000);
        //     }

        // } catch (e) {
        //     console.error(e);
        //     toast.current.show({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: 'Failed to delete student',
        //         life: 3000
        //     });
        // }
    };
    

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog
                header={`${props.req ? `${props.req.firstName} ${props.req.lastName}` : "No req selected."}`}
                visible={props.visibleQ}
                style={{ width: '25vw', height: "25vw" }}
                onHide={() => { props.setVisibleQ(false); }}
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
                            // onClick={deleteReq}
                        />
                    </div>
                }
            >
                {props.req ? (
                    <div className="req-details">
                        <div className="req-info" ><span style={{ fontWeight: "bold" }}>Name: </span> <span className="info-value">{props.req.firstName} {props.req.lastName}</span></div>
                        <div className="req-info" ><span style={{ fontWeight: "bold" }}>Email: </span><span className="info-value">{props.req.email}</span></div>
                        <div className="req-info" ><span style={{ fontWeight: "bold" }}>Phone: </span><span className="info-value">{props.req.phone}</span></div>
                    </div>
                ) : (
                    <div>No Requests selected.</div>
                )}
            </Dialog>
        </div>
    );
}

export default MShowreq;