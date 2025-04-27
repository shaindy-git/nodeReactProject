import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ListBox } from 'primereact/listbox';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import TShowStudent from './TShowStudent';


const THome = () => {

    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const ID = decoded ? decoded.numberID : null;

    const [selectstudent, setSelectedstudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [relevantstudent, setRelevantstudent] = useState(null);
    const [visibleS, setVisibleS] = useState(false);

    const toast = useRef(null);

    useEffect(() => {
        if (!accesstoken || !ID) return;

        const Student = async () => {
            try {
                const studentRes = await axios({
                    method: 'get',
                    url: 'http://localhost:7000/student/getAllStudents',
                    headers: { Authorization: "Bearer " + accesstoken },
                });
                if (studentRes.status === 200) setStudents(studentRes.data);
            } catch (e) {
                if (e.response?.status === 400) setStudents([]);
                else console.error("Unauthorized user - S / MHome");
            }
        };
        
        Student();
        
    }, [accesstoken, ID]); 

   

    const itemTemplatestudent = (student) => (
        <div>{student.firstName} {student.lastName}</div>
    );

   

    const itemTemplateEmpty = (label) => (
        <div style={{ color: 'gray', fontStyle: 'italic', textAlign: 'center' }}>{label}</div>
    );

   

    const removeStudentFromList = (idToRemove) => {
        setStudents(prev => prev.filter(s => s._id !== idToRemove));
    };

   

    return (
        <>
            <Toast ref={toast} />
            <div className="card" style={{ display: 'flex', height: '75vh' }}>

                <div className="flex-item" style={{ flex: 1, margin: '20px' }}>
                    <ListBox

                        filter
                        filterPlaceholder="Search Student"
                        filterInputProps={{
                            style: {
                                direction: 'ltr',
                                opacity: 0.5,
                                color: '#666'
                            }
                        }}
                        value={selectstudent}
                        onChange={(e) => {
                            setSelectedstudent(e.value);
                            setRelevantstudent(e.value ?? relevantstudent);
                            setVisibleS(true);
                        }}
                        options={students.length > 0 ? students : [{ label: 'No Students Available', value: null }]}
                        itemTemplate={students.length > 0 ? itemTemplatestudent : () => itemTemplateEmpty('No Students Available')}
                        className="w-full"
                        listStyle={{ maxHeight: '100vh', overflowY: 'auto', height: '57vh' }}
                        filterBy={["firstName", "lastName"]}
                    />
                    <TShowStudent
                        setVisibleS={setVisibleS}
                        visibleS={visibleS}
                        student={relevantstudent}
                        removeStudent={removeStudentFromList}
                        // setTeachers={setTeachers}
                        setStudents={setStudents}
                    />
                </div>
                <div className="flex-item" style={{ flex: 1, margin: '20px' }}></div>
                <div className="flex-item" style={{ flex: 1, margin: '20px' }}></div>

                
            </div>
        </>
    );

}
export default THome