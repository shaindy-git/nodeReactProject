// import React, { useState, useEffect } from 'react';
// import { Galleria } from 'primereact/galleria';
// import { Dropdown } from 'primereact/dropdown';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';

// const SSelectionTeatcher = () => {
//     const accesstoken = useSelector((state) => state.token.token);
//     const decoded = accesstoken ? jwtDecode(accesstoken) : null;

//     const [teachers, setTeachers] = useState([]);
//     const [Areas, setAreas] = useState([]);
//     const [selectedArea, setSelectedArea] = useState(null);
//     const [selectedGender, setSelectedGender] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const genders = [
//         { label: 'Male', value: 'male' },
//         { label: 'Female', value: 'female' }
//     ];

//     const responsiveOptions = [
//         { breakpoint: '991px', numVisible: 4 },
//         { breakpoint: '767px', numVisible: 3 },
//         { breakpoint: '575px', numVisible: 1 }
//     ];

//     // שמירת כל האזורים
//     useEffect(() => {
//         const fetchAreas = async () => {
//             try {
//                 const res = await axios.get('http://localhost:7000/admin/getAllAreas');
//                 if (res.status === 200) {
//                     setAreas(res.data.areas.map(area => ({ label: area.name, value: area.id })));
//                 }
//             } catch (e) {
//                 console.error("Failed to fetch areas", e);
//                 setAreas([]);
//             }
//         };

//         fetchAreas();
//     }, []);

//     // שמירת כל המורים
//     useEffect(() => {
//         if (!accesstoken) return;

//         const fetchTeachers = async () => {
//             setLoading(true);
//             try {
//                 const res = await axios.post('http://localhost:7000/teacher/getAllTeachers',
//                     {
//                         area: selectedArea,
//                         gender: selectedGender
//                     },
//                     {
//                         headers: { Authorization: `Bearer ${accesstoken}` }
//                     }
//                 );
//                 console.log(res.data);
//                 if (res.status === 200) {
//                     setTeachers(res.data.map(teacher => ({
//                         itemImageSrc: teacher.imageUrl,
//                         alt: teacher.name,
//                         description: teacher.description
//                     })));
//                 }
//             } catch (e) {
//                 console.error("Failed to fetch teachers", e);
//                 setTeachers([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTeachers();
//     }, [selectedArea, selectedGender, accesstoken]);

//     const itemTemplate = (item) => {
//         return (
//             <div style={{ position: 'relative', textAlign: 'center' }}>
//                 <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block', borderRadius: '8px' }} />
//                 <div style={{
//                     position: 'absolute',
//                     bottom: '10px',
//                     left: '50%',
//                     transform: 'translateX(-50%)',
//                     color: '#fff',
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     padding: '5px 10px',
//                     borderRadius: '5px'
//                 }}>
//                     {item.alt}
//                 </div>
//             </div>
//         );
//     };

//     const thumbnailTemplate = (item) => {
//         return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block', borderRadius: '8px' }} />;
//     };

//     return (
//         <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 gap: '1rem',
//                 alignItems: 'center',
//                 justifyContent: 'flex-start',
//                 padding: '1rem',
//                 backgroundColor: '#ffffff',
//                 borderRadius: '12px',
//                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                 width: '100%',
//                 marginBottom: '1.5rem'
//             }}>
//                 <Dropdown
//                     value={selectedGender}
//                     onChange={(e) => setSelectedGender(e.value)}
//                     options={genders}
//                     placeholder="Select Gender"
//                     style={{
//                         flex: 'none',
//                         width: '220px',
//                         padding: '0.5rem',
//                         borderRadius: '8px',
//                         border: '1px solid #ddd',
//                         fontSize: '1rem',
//                         height: '3.5rem',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                         backgroundColor: '#f9f9f9',
//                         color: '#333',
//                         fontWeight: 'bold',
//                         textAlign: 'center'
//                     }}
//                 />
//                 {/* <Dropdown
//                     value={selectedArea}
//                     onChange={(e) => setSelectedArea(e.value)}
//                     options={Areas}
//                     placeholder="Select Area"
//                     style={{
//                         flex: 'none',
//                         width: '220px',
//                         padding: '0.5rem',
//                         borderRadius: '8px',
//                         border: '1px solid #ddd',
//                         fontSize: '1rem',
//                         height: '3.5rem',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                         backgroundColor: '#f9f9f9',
//                         color: '#333',
//                         fontWeight: 'bold',
//                         textAlign: 'center'
//                     }}
//                 /> */}
//                 <Dropdown
//                     value={selectedArea}
//                     onChange={(e) => setSelectedArea(e.value)}
//                     options={Areas}
//                     placeholder={Areas.length > 0 ? "Select Area" : "No Areas Available"}
//                     style={{
//                         flex: 'none',
//                         width: '220px',
//                         padding: '0.5rem',
//                         borderRadius: '8px',
//                         border: '1px solid #ddd',
//                         fontSize: '1rem',
//                         height: '3.5rem',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                         backgroundColor: '#f9f9f9',
//                         color: '#333',
//                         fontWeight: 'bold',
//                         textAlign: 'center'
//                     }}
//                 />
//             </div>

//             <div className="card" style={{
//                 backgroundColor: '#ffffff',
//                 borderRadius: '12px',
//                 padding: '1rem',
//                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                 textAlign: 'center'
//             }}>
//                 {loading ? (
//                     <p style={{ color: '#666', fontSize: '1.2rem' }}>טוען נתונים...</p>
//                 ) : teachers.length > 0 ? (
//                     <Galleria
//                         style={{ maxWidth: '640px', margin: '0 auto' }}
//                         value={teachers}
//                         responsiveOptions={responsiveOptions}
//                         numVisible={5}
//                         item={itemTemplate}
//                         thumbnail={thumbnailTemplate}
//                     />
//                 ) : (
//                     <p style={{ marginTop: '1rem', color: '#666', fontSize: '1rem' }}>No suitable teachers were found</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SSelectionTeatcher;

import React, { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const SSelectionTeatcher = () => {
    const accesstoken = useSelector((state) => state.token.token);
    const decoded = accesstoken ? jwtDecode(accesstoken) : null;

    const [teachers, setTeachers] = useState([]);
    const [Areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [loading, setLoading] = useState(false);

    const genders = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ];

    const responsiveOptions = [
        { breakpoint: '991px', numVisible: 4 },
        { breakpoint: '767px', numVisible: 3 },
        { breakpoint: '575px', numVisible: 1 }
    ];

    // שמירת כל האזורים
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const res = await axios.get('http://localhost:7000/admin/getAllAreas');
                console.log(res.data.areas); // Debugging line
                if (res.status === 200) {
                    setAreas(res.data.areas.map(area => ({ label: area.name, value: area.id })));
                }

            } catch (e) {
                console.error("Failed to fetch areas", e);
                setAreas([]);
            }
        };

        fetchAreas();
    }, []);

    // שמירת כל המורים
    useEffect(() => {
        const fetchTeachers = async () => {
            if (!accesstoken) return;

            setLoading(true);
            try {
                const res = await axios.post('http://localhost:7000/teacher/getAllTeachers',
                    {
                        area: selectedArea,
                        gender: selectedGender
                    },
                    {
                        headers: { Authorization: `Bearer ${accesstoken}` }
                    }
                );
                console.log(res.data); // Debugging line
                if (res.status === 200) {
                    setTeachers(res.data.map(teacher => ({
                        itemImageSrc: teacher.imageUrl,
                        alt: teacher.name,
                        description: teacher.description
                    })));
                } else {
                    setTeachers([]);
                }
            } catch (e) {
                console.error("Failed to fetch teachers", e);
                setTeachers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [selectedArea, selectedGender, accesstoken]);

    const itemTemplate = (item) => {
        return (
            <div style={{ position: 'relative', textAlign: 'center' }}>
                <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block', borderRadius: '8px' }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '5px 10px',
                    borderRadius: '5px'
                }}>
                    {item.alt}
                </div>
            </div>
        );
    };

    const thumbnailTemplate = (item) => {
        return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block', borderRadius: '8px' }} />;
    };

    return (
        <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '1rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '100%',
                marginBottom: '1.5rem'
            }}>
                <Dropdown
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.value)}
                    options={genders}
                    placeholder="Select Gender"
                    style={{
                        flex: 'none',
                        width: '220px',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        height: '3.5rem',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f9f9f9',
                        color: '#333',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                />
                <Dropdown
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.value)}
                    options={Areas}
                    placeholder={Areas.length > 0 ? "Select Area" : "No Areas Available"}
                    style={{
                        flex: 'none',
                        width: '220px',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        height: '3.5rem',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f9f9f9',
                        color: '#333',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                />
            </div>

            <div className="card" style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                {loading ? (
                    <p style={{ color: '#666', fontSize: '1.2rem' }}>טוען נתונים...</p>
                ) : teachers.length > 0 ? (
                    <Galleria
                        style={{ maxWidth: '640px', margin: '0 auto' }}
                        value={teachers}
                        responsiveOptions={responsiveOptions}
                        numVisible={5}
                        item={itemTemplate}
                        thumbnail={thumbnailTemplate}
                    />
                ) : (
                    <p style={{ marginTop: '1rem', color: '#666', fontSize: '1rem' }}>No suitable teachers were found</p>
                )}
            </div>
        </div>
    );
};

export default SSelectionTeatcher;