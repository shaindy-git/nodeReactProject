// import React, { useState, useEffect, useRef } from 'react';
// import { Galleria } from 'primereact/galleria';
// import { RadioButton } from 'primereact/radiobutton';
// import axios from 'axios';
// import { ListBox } from 'primereact/listbox';
// import { useDispatch, useSelector } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';
// import { Toast } from 'primereact/toast';
// import { Dropdown } from 'primereact/dropdown';

// const SSelectionTeatcher = () => {

//     const accesstoken = useSelector((state) => state.token.token);
//     const decoded = accesstoken ? jwtDecode(accesstoken) : null;
//     //const ID = decoded ? decoded.numberID : null;

//     const [teachers, setTeachers] = useState(null);
//     const [position, setPosition] = useState('left');
//     const [Areas, setAreas] = useState(null)
//     const [selectedArea, setSelectedArea] = useState(null)
//     const [selectedGender, setSelectedGender] = useState(null);
//     const genders = ['male', 'female']



//     const positionOptions = [
//         {
//             label: 'Bottom',
//             value: 'bottom'
//         },
//         {
//             label: 'Top',
//             value: 'top'
//         },
//         {
//             label: 'Left',
//             value: 'left'
//         },
//         {
//             label: 'Right',
//             value: 'right'
//         }
//     ];
//     const responsiveOptions = [
//         {
//             breakpoint: '991px',
//             numVisible: 4
//         },
//         {
//             breakpoint: '767px',
//             numVisible: 3
//         },
//         {
//             breakpoint: '575px',
//             numVisible: 1
//         }
//     ];

//     useEffect(() => {
//         if (!accesstoken) return;

//         const Techer = async () => {
//             try {
//                 const teacherRes = await axios({
//                     method: 'get',
//                     url: 'http://localhost:7000/teacher/getAllTeachers',
//                     headers: { Authorization: "Bearer " + accesstoken },
//                     data: {
//                         "area": selectedArea,
//                         "gender": selectedGender
//                     }
//                 });
//                 if (teacherRes.status === 200) setTeachers(teacherRes.data);
//             } catch (e) {
//                 if (e.response?.status === 400) setTeachers([]);
//                 else console.error("Unauthorized user - T / MHome"); // אפשר גם Toast
//             }
//         };

//         const Areas = async () => {
//             try {
//                 const res = await axios({
//                     method: 'get',
//                     url: 'http://localhost:7000/admin/getAllAreas',
//                     headers: {},
//                     data: {}
//                 });
//                 if (res.status === 200) setAreas(res.data.areas);
//             } catch (e) {
//                 if (e.response?.status === 400) setAreas([]);
//                 else console.error("Unauthorized user - T / SSelctionTeatcher"); // אפשר גם Toast
//             }
//         };

// console.log(teachers);

//         Techer()
//         Areas()

//     }, [selectedArea, selectedGender]);

//     const itemTemplate = (item) => {
//         return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />
//     }

//     const thumbnailTemplate = (item) => {
//         return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />
//     }

//     return (
//         <>

//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 gap: '0.5rem',
//                 alignItems: 'center',
//                 justifyContent: 'flex-start', // יישור לצד שמאל
//                 padding: '0.5rem',
//                 backgroundColor: '#f9f9f9',
//                 borderRadius: '8px',
//                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                 width: '100%'
//             }}>
//                 <Dropdown
//                     value={selectedGender}
//                     onChange={(e) => setSelectedGender(e.value)}
//                     options={genders}
//                     optionLabel="name"
//                     placeholder="Gender"
//                     style={{
//                         flex: 'none',
//                         width: '200px',
//                         padding: '0.25rem',
//                         borderRadius: '5px',
//                         border: '1px solid #ccc',
//                         fontSize: '0.9rem',
//                         height: '3rem',
//                         boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
//                         backgroundColor: '#204392', // רקע כחול כהה
//                         color: '#FFD700', // טקסט בצבע צהוב
//                         fontWeight: 'bold', // טקסט עבה
//                         textAlign: 'center'
//                     }}
//                 />
//                 <Dropdown
//                     value={selectedArea}
//                     onChange={(e) => setSelectedArea(e.value)}
//                     options={Areas}
//                     optionLabel="name"
//                     placeholder="Area"
//                     style={{
//                         flex: 'none',
//                         width: '200px',
//                         padding: '0.25rem',
//                         borderRadius: '5px',
//                         border: '1px solid #ccc',
//                         fontSize: '0.9rem',
//                         height: '3rem',
//                         boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
//                         backgroundColor: '#204392', // רקע כחול כהה
//                         color: '#FFD700', // טקסט בצבע צהוב
//                         fontWeight: 'bold', // טקסט עבה
//                         textAlign: 'center'
//                     }}
//                 />
//             </div>


//             <div className="card">
//                 <div className="flex flex-wrap gap-3 mb-5">
//                     {positionOptions.map((option) => {
//                         const { label, value } = option;

//                         return (
//                             <div className="flex align-items-center" key={label}>
//                                 <RadioButton value={value} onChange={(e) => setPosition(e.value)} checked={position === value} />
//                                 <label htmlFor={label} className="ml-2">
//                                     {label}
//                                 </label>
//                             </div>
//                         );
//                     })}
//                 </div>
//                 <Galleria style={{ maxWidth: '640px' }} value={teachers} responsiveOptions={responsiveOptions} numVisible={5} item={itemTemplate} thumbnailsPosition={position} thumbnail={thumbnailTemplate} />
//             </div>
//         </>
//     )

// }

// export default SSelectionTeatcher

import React, { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const SSelectionTeatcher = () => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;

    const [teachers, setTeachers] = useState(null);
    const [Areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);

    const genders = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ];

    const responsiveOptions = [
        { breakpoint: '991px', numVisible: 4 },
        { breakpoint: '767px', numVisible: 3 },
        { breakpoint: '575px', numVisible: 1 }
    ];

    // Fetch all areas once when the component mounts
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const res = await axios.get('http://localhost:7000/admin/getAllAreas');
                if (res.status === 200) {
                    setAreas(res.data.areas);
                }
            } catch (e) {
                console.error("Failed to fetch areas", e);
                setAreas([]);
            }
        };

        fetchAreas();
    }, []);

    // Fetch teachers when selectedArea or selectedGender changes
    useEffect(() => {
        if (!accesstoken) return;

        const fetchTeachers = async () => {
            try {
                const res = await axios.get('http://localhost:7000/teacher/getAllTeachers', {
                    headers: { Authorization: `Bearer ${accesstoken}` },
                    params: {
                        "area": selectedArea,
                        "gender": selectedGender
                    }
                });

                if (res.status === 200) {
                    setTeachers(res.data);
                }
            } catch (e) {
                console.error("Failed to fetch teachers", e);
                setTeachers([]);
            }
        };

        fetchTeachers();

        console.log(teachers);
        
    }, [selectedArea, selectedGender, accesstoken]);

    const itemTemplate = (item) => {
        return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
    };

    const thumbnailTemplate = (item) => {
        return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
    };

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '0.5rem',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '0.5rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '100%'
            }}>
                <Dropdown
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.value)}
                    options={genders}
                    placeholder="Gender"
                    style={{
                        flex: 'none',
                        width: '200px',
                        padding: '0.25rem',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '0.9rem',
                        height: '3rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#204392',
                        color: '#FFD700',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                />
                <Dropdown
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.value)}
                    options={Areas}
                    placeholder="Area"
                    style={{
                        flex: 'none',
                        width: '200px',
                        padding: '0.25rem',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '0.9rem',
                        height: '3rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#204392',
                        color: '#FFD700',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                />
            </div>

            <div className="card">
                <Galleria
                    style={{ maxWidth: '640px' }}
                    value={teachers}
                    responsiveOptions={responsiveOptions}
                    numVisible={5}
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                />
            </div>
        </>
    );
};

export default SSelectionTeatcher;
