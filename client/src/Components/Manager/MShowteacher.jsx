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
            console.log(studetByTeacher);
            console.log(accesstoken);
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
                console.log(props.teacher.numberID);
                const filteredStudents = res.data.filter(student => student.myTeacher === props.teacher.numberID);
                setStudetByTeacher(filteredStudents);
                console.log(studetByTeacher);
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
                style={{ width: '25vw', height: "30vw" }}
                onHide={() => { props.setVisibleT(false); }}
                dir="ltr"
            >
                {props.teacher ? (
                    <>
                        <div>{props.teacher.firstName}</div>
                        <div>{props.teacher.numberID}</div>
                        <div>
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