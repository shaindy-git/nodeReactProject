import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import axios from "axios";

const TShowRequest = (props) => {
    const accesstoken = useSelector((state) => state.token.token);
    const toast = useRef(null);

    const AddTest = async () => {
        // Validate that the request contains necessary data
        if (!props.request || !props.request.studentId || !props.request.date) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Invalid request data",
                life: 2000,
            });
            return;
        }

        try {
            const res = await axios({
                method: "PUT",
                url: "http://localhost:7000/teacher/settingTest",
                headers: { Authorization: "Bearer " + accesstoken },
                data: {
                    "studentId": props.request.studentId,
                    "date": props.request.date,
                    "hour": "13:00", // Fixed test hour
                },
            });
            console.log("hhh");
            

            if (res.status === 200) {
                // Remove the request from the list
                props.setRequests((prevRequests) =>
                    prevRequests.filter((req) => req._id !== props.request._id)
                );

                // Trigger additional updates if necessary
                props.setChangeRequests((prev) => [...prev, res.data]);

                // Show success message
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Test was successfully added to the request",
                    life: 2000,
                });

                // Close the dialog after a short delay
                setTimeout(() => props.setVisibleR(false), 2000);
            }
        } catch (e) {
            console.error(e);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: e.response?.data?.message || e.message || "Failed to add test",
                life: 2000,
            });
        }
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog
                header={`Request Details`}
                visible={props.visibleR}
                style={{ width: "30vw" }}
                onHide={() => props.setVisibleR(false)} // Close dialog
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
                            aria-label="AddTest"
                            onClick={AddTest}
                        />
                    </div>
                }
            >
                {props.request ? (
                    <div className="Testrequest-details">
                        <div className="request-info">
                            <span style={{ fontWeight: "bold" }}>First Name: </span>
                            <span className="info-value">{props.request.studentId?.firstName || "N/A"}</span>
                        </div>
                        <div className="request-info">
                            <span style={{ fontWeight: "bold" }}>Last Name: </span>
                            <span className="info-value">{props.request.studentId?.lastName || "N/A"}</span>
                        </div>
                        <div className="request-info">
                            <span style={{ fontWeight: "bold" }}>Date: </span>
                            <span className="info-value">{new Date(props.request.date).toLocaleDateString() || "N/A"}</span>
                        </div>
                    </div>
                ) : (
                    <div>No request selected.</div>
                )}
            </Dialog>
        </div>
    );
};

export default TShowRequest;