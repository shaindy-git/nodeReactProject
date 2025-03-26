import React from "react";
import { Dialog } from 'primereact/dialog';

const MShowstudent = (props) => {
    return (
        <div className="card flex justify-content-center">
            <Dialog
                header={`${props.student ? `${props.student.firstName} ${props.student.lastName}` : "No student selected."}`}
                visible={props.visibleS}
                style={{ width: '25vw', height: "30vw" }}
                onHide={() => { props.setVisibleS(false); }}
                dir="ltr"
            >
                {props.student ? (
                    <>
                        <div>ID: {props.student.numberID}</div>
                        <div>Name: {props.student.firstName} {props.student.lastName}</div>
                        
                    </>
                ) : (
                    <div>No student selected.</div>
                )}
            </Dialog>
        </div>
    );
}

export default MShowstudent;