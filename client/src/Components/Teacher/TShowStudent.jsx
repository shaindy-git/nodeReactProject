import React, { useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import axios from "axios";

const TShowStudent = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const toast = useRef(null);

    const AddLesson = async () => {
        if (!props.student || !props.student._id) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "No student selected",
                life: 2000,
            });
            return;
        }

        try {
            const res = await axios({
                method: "put",
                url: `http://localhost:7000/teacher/addLessonToStudent`,
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    studentId: props.student._id,
                },
            });

            if (res.status === 200) {
                const updatedStudent = res.data.student;
                const updatedStudentsList = res.data.students; 

              
                props.setRelevantStudent(updatedStudent);
                props.setStudents(updatedStudentsList);
                props.setChangeStudents(updatedStudentsList)
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Lesson was successfully added to the student",
                    life: 2000,
                });

                
                setTimeout(() => {
                    props.setVisibleS(false);
                }, 2000);
            }
        } catch (e) {
            console.error(e);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to add lesson",
                life: 2000,
            });
        }
    };
    const deleteStudent = async () => {
        if (!props.student || !props.student._id) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "No student selected",
                life: 2000,
            });
            return;
        }

        try {
            const res = await axios({
                method: "DELETE",
                url: `http://localhost:7000/student/deleteStudent/${props.student._id}`,
                headers: { Authorization: "Bearer " + accesstoken },
            });

            if (res.status === 200) {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "The student was successfully deleted",
                    life: 1000,
                });

                props.removeStudent(props.student._id);
                props.setStudents(res.data.studentByTeacher);

                setTimeout(() => {
                    props.setVisibleS(false);
                }, 2000);
            }
        } catch (e) {
            console.error(e);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete student",
                life: 2000,
            });
        }
    };
    useEffect(() => {
        console.log(props.student);
    }, [])
    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog
                header={`${props.student ? `${props.student.firstName} ${props.student.lastName}` : "No student selected."}`}
                visible={props.visibleS}
                style={{ width: "25vw", height: "25vw" }}
                onHide={() => {
                    props.setVisibleS(false);
              
                }}
                dir="ltr"
                footer={
                    <div className="dialog-footer" style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            icon="pi pi-calendar-plus"
                            style={{
                                width: "2.5rem",
                                height: "2.5rem",
                                borderRadius: "50%",
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                border: "2px solid #000000",
                                color: "white",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            aria-label="AddLesson"
                            onClick={AddLesson}
                        />

                        <Button
                            icon="pi pi-trash"
                            style={{
                                width: "2.5rem",
                                height: "2.5rem",
                                borderRadius: "50%",
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                border: "2px solid #000000",
                                color: "white",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "10px",
                            }}
                            aria-label="Delete"
                            onClick={deleteStudent}
                        />
                    </div>
                }
            >
                {props.student ? (
                    <div className="student-details">
                        <div className="student-info">
                            <span style={{ fontWeight: "bold" }}>Name: </span>
                            <span className="info-value">{props.student.firstName} {props.student.lastName}</span>
                        </div>
                        <div className="student-info">
                            <span style={{ fontWeight: "bold" }}>Email: </span>
                            <span className="info-value">{props.student.email}</span>
                        </div>
                        <div className="student-info">
                            <span style={{ fontWeight: "bold" }}>Phone: </span>
                            <span className="info-value">{props.student.phone}</span>
                        </div>
                        <div className="student-info">
                            <span style={{ fontWeight: "bold" }}>Lessons Learned: </span>
                            <span className="info-value">{props.student.lessonsLearned}</span>
                        </div>
                        <div className="student-info">
                            <span style={{ fontWeight: "bold" }}>Lessons Remaining: </span>
                            <span className="info-value">{props.student.lessonsRemaining}</span>
                        </div>
                    </div>
                ) : (
                    <div>No student selected.</div>
                )}
            </Dialog>
        </div>
    );
};

export default TShowStudent;