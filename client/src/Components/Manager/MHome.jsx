import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListBox } from 'primereact/listbox';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Button } from 'primereact/button';
import MShowteacher from './MShowteacher';
import MShowstudent from './MShowstudent';

const MHome = () => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;
    const ID = decoded ? decoded.numberID : null;
    const [selectteacher, setSelectedteacher] = useState(null);
    const [selectstudent, setSelectedstudent] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [relevantteacher, setRelevantteacher] = useState(null);
    const [relevantstudent, setRelevantstudent] = useState(null);
    const [visibleT, setVisibleT] = useState(false);
    const [visibleS, setVisibleS] = useState(false);

    useEffect(() => {
        const Teacherlist = async () => {
            try {
                const res = await axios({
                    method: 'get',
                    url: 'http://localhost:7000/teacher/getAllTeachers',
                    headers: { Authorization: "Bearer " + accesstoken },
                    data: {}
                });
                if (res.status === 200) {
                    setTeachers(res.data);
                }
            } catch (e) {
                if (e.response && e.response.status === 400) {
                    setTeachers([]);
                }
                else {
                    console.error(e);
                    alert("Unauthorized user - T");
                }
            }
        };


        const Studentlist = async () => {
            try {
                const res = await axios({
                    method: 'get',
                    url: 'http://localhost:7000/student/getAllStudents',
                    headers: { Authorization: "Bearer " + accesstoken },
                    data: {}
                });
                if (res.status === 200) {
                    setStudents(res.data);
                }

            } catch (e) {
                if (e.response && e.response.status === 400) {
                    setStudents([]);
                }
                else {
                    console.error(e);
                    alert("Unauthorized user - S");
                }
            }
        };

        Teacherlist();

        Studentlist();
    }, [ID]);


    const itemTemplateteacher = (teacher) => {
        return (
            <div>
                <div>{teacher.firstName} {teacher.lastName}</div>
            </div>
        );
    };


    const itemTemplatestudent = (student) => {
        return (
            <div>
                <div>{student.firstName} {student.lastName}</div>
            </div>
        );
    };

    const itemTemplateEmpty = (label) => {
        return (
            <div style={{ color: 'gray', fontStyle: 'italic', textAlign: 'center' }}>
                {label}
            </div>
        );
    };



    return (
        <div className="card">
            <div className="flex flex-row md:flex-row" >

                <div className="card flex justify-content-center" >
                    <ListBox

                        filter
                        value={selectteacher}
                        onChange={(e) => {
                            setSelectedteacher(e.value);
                            setRelevantteacher((e.value) === null ? relevantteacher : e.value)
                            setVisibleT(true)
                        }}
                        options={teachers.length > 0 ? teachers : [{ label: 'No Teachers Available', value: null }]}
                        itemTemplate={teachers.length > 0 ? itemTemplateteacher : () => itemTemplateEmpty('No Teachers Available')}
                        className="w-full md:w-14rem"
                        listStyle={{ maxHeight: '500px' }}
                        filterBy="firstName"
                    />

                    {<MShowteacher setVisibleT={setVisibleT} visibleT={visibleT} teacher={relevantteacher} />}
                </div>


                <div className="card flex justify-content-center" >
                    <ListBox
                        filter
                        value={selectstudent}
                        onChange={(e) => {
                            setSelectedstudent(e.value);
                            setRelevantstudent((e.value) === null ? relevantstudent : e.value);
                            setVisibleS(true);
                        }}
                        options={students.length > 0 ? students : [{ label: 'No Students Available', value: null }]}
                        itemTemplate={students.length > 0 ? itemTemplatestudent : () => itemTemplateEmpty('No Students Available')}
                        className="w-full md:w-14rem"
                        listStyle={{ maxHeight: '500px' }}
                        filterBy="firstName"
                    />

                    {<MShowstudent setVisibleS={setVisibleS} visibleS={visibleS} student={relevantstudent} />}
                </div>

            </div>
        </div>

    );
}

export default MHome;