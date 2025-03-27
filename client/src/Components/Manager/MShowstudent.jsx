import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { useSelector } from 'react-redux';


const MShowstudent = (props) => {
    const idS = props.student ? props.student._id : null;
    const accesstoken = useSelector((state) => state.token.token);
    const [teacher, setTeacher] = useState([]);

    useEffect(() => {
        if (props.student) {
            Teacher();
        }
    }, [idS]);

    const Teacher = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: 'http://localhost:7000/teacher/getAllTeachers',
                headers: { Authorization: "Bearer " + accesstoken },
            });
            if (res.status === 200) {
                const teacherfilter = res.data.filter(teacher => teacher._id === props.student.myTeacher);
                setTeacher(teacherfilter);
            }
        } catch (e) {
            if (e.response && e.response.status === 400) {
                setTeacher([]);
            } else {
                console.error(e);
                alert("Unauthorized user - S");
            }
        }
    };

    return (
        <div className="card flex justify-content-center">
            <Dialog
                header={`${props.student ? `${props.student.firstName} ${props.student.lastName}` : "No student selected."}`}
                visible={props.visibleS}
                style={{ width: '25vw', height: "25vw" }}
                onHide={() => { props.setVisibleS(false); }}
                dir="ltr"
                // footer={<footer className="dialog-footer"><button onClick={() => props.setVisibleS(false)}>Close</button></footer>}
            >
                {props.student ? (
                    <div className="student-details">
                        <div className="student-info" ><span style={{fontWeight:"bold"}}>Name: </span> <span className="info-value">{props.student.firstName} {props.student.lastName}</span></div>
                        <div className="student-info" ><span style={{fontWeight:"bold"}}>Email: </span><span className="info-value">{props.student.email}</span></div>
                        <div className="student-info" ><span style={{fontWeight:"bold"}}>Phone: </span><span className="info-value">{props.student.phone}</span></div>
                        <div className="student-info" ><span style={{fontWeight:"bold"}}>Teacher: </span><span className="info-value">{teacher.length > 0 ? `${teacher[0].firstName} ${teacher[0].lastName}` : "Not assigned"}</span></div>
                    </div>
                ) : (
                    <div>No student selected.</div>
                )}
            </Dialog>
        </div>
    );
}

export default MShowstudent;