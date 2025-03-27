import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';

const MShowteacher = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const [studetByTeacher, setStudetByTeacher] = useState([]);

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

    return (
        <div className="card flex justify-content-center">
            <Dialog 
                header={`${props.teacher ? props.teacher.firstName : "No teacher selected."} ${props.teacher && props.teacher.lastName ? props.teacher.lastName : ""}`}
                visible={props.visibleT}
                style={{ width: '25vw', height: "25vw" }}
                onHide={() => { props.setVisibleT(false); }}
                dir="ltr"
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