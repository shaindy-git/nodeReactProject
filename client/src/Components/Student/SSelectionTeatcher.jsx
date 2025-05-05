// // import React, { useState, useEffect } from 'react';
// // import { Galleria } from 'primereact/galleria';
// // import { Dropdown } from 'primereact/dropdown';
// // import axios from 'axios';
// // import { useSelector } from 'react-redux';
// // import { jwtDecode } from 'jwt-decode';

// // const SSelectionTeatcher = () => {
// //     const accesstoken = useSelector((state) => state.token.token);
// //     const decoded = accesstoken ? jwtDecode(accesstoken) : null;

// //     const [teachers, setTeachers] = useState([]);
// //     const [Areas, setAreas] = useState([]);
// //     const [selectedArea, setSelectedArea] = useState(null);
// //     const [selectedGender, setSelectedGender] = useState(null);
// //     const [loading, setLoading] = useState(false);

// //     const genders = [
// //         { label: 'Male', value: 'male' },
// //         { label: 'Female', value: 'female' }
// //     ];

// //     const responsiveOptions = [
// //         { breakpoint: '991px', numVisible: 4 },
// //         { breakpoint: '767px', numVisible: 3 },
// //         { breakpoint: '575px', numVisible: 1 }
// //     ];

// //     // שמירת כל האזורים
// //     useEffect(() => {
// //         const fetchAreas = async () => {
// //             try {
// //                 const res = await axios.get('http://localhost:7000/admin/getAllAreas');
// //                 console.log(res.data.areas); // Debugging line
// //                 if (res.status === 200) {
// //                     setAreas(res.data.areas.map(area => ({ label: area.name, value: area.id })));
// //                 }

// //             } catch (e) {
// //                 console.error("Failed to fetch areas", e);
// //                 setAreas([]);
// //             }
// //         };

// //         fetchAreas();
// //     }, []);

// //     // שמירת כל המורים
// //     useEffect(() => {
// //         const fetchTeachers = async () => {
// //             if (!accesstoken) return;

// //             setLoading(true);
// //             try {
// //                 const res = await axios.post('http://localhost:7000/teacher/getAllTeachers',
// //                     {
// //                         area: selectedArea,
// //                         gender: selectedGender
// //                     },
// //                     {
// //                         headers: { Authorization: `Bearer ${accesstoken}` }
// //                     }
// //                 );
// //                 console.log(res.data); // Debugging line
// //                 if (res.status === 200) {
// //                     setTeachers(res.data.map(teacher => ({
// //                         itemImageSrc: teacher.imageUrl,
// //                         alt: teacher.name,
// //                         description: teacher.description
// //                     })));
// //                 } else {
// //                     setTeachers([]);
// //                 }
// //             } catch (e) {
// //                 console.error("Failed to fetch teachers", e);
// //                 setTeachers([]);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchTeachers();
// //     }, [selectedArea, selectedGender, accesstoken]);

// //     const itemTemplate = (item) => {
// //         return (
// //             <div style={{ position: 'relative', textAlign: 'center' }}>
// //                 <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block', borderRadius: '8px' }} />
// //                 <div style={{
// //                     position: 'absolute',
// //                     bottom: '10px',
// //                     left: '50%',
// //                     transform: 'translateX(-50%)',
// //                     color: '#fff',
// //                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //                     padding: '5px 10px',
// //                     borderRadius: '5px'
// //                 }}>
// //                     {item.alt}
// //                 </div>
// //             </div>
// //         );
// //     };

// //     const thumbnailTemplate = (item) => {
// //         return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block', borderRadius: '8px' }} />;
// //     };

// //     return (
// //         <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
// //             <div style={{
// //                 display: 'flex',
// //                 flexDirection: 'row',
// //                 gap: '1rem',
// //                 alignItems: 'center',
// //                 justifyContent: 'flex-start',
// //                 padding: '1rem',
// //                 backgroundColor: '#ffffff',
// //                 borderRadius: '12px',
// //                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
// //                 width: '100%',
// //                 marginBottom: '1.5rem'
// //             }}>
// //                 <Dropdown
// //                     value={selectedGender}
// //                     onChange={(e) => setSelectedGender(e.value)}
// //                     options={genders}
// //                     placeholder="Select Gender"
// //                     style={{
// //                         flex: 'none',
// //                         width: '220px',
// //                         padding: '0.5rem',
// //                         borderRadius: '8px',
// //                         border: '1px solid #ddd',
// //                         fontSize: '1rem',
// //                         height: '3.5rem',
// //                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
// //                         backgroundColor: '#f9f9f9',
// //                         color: '#333',
// //                         fontWeight: 'bold',
// //                         textAlign: 'center'
// //                     }}
// //                 />
// //                 <Dropdown
// //                     value={selectedArea}
// //                     onChange={(e) => setSelectedArea(e.value)}
// //                     options={Areas}
// //                     placeholder={Areas.length > 0 ? "Select Area" : "No Areas Available"}
// //                     style={{
// //                         flex: 'none',
// //                         width: '220px',
// //                         padding: '0.5rem',
// //                         borderRadius: '8px',
// //                         border: '1px solid #ddd',
// //                         fontSize: '1rem',
// //                         height: '3.5rem',
// //                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
// //                         backgroundColor: '#f9f9f9',
// //                         color: '#333',
// //                         fontWeight: 'bold',
// //                         textAlign: 'center'
// //                     }}
// //                 />
// //             </div>

// //             <div className="card" style={{
// //                 backgroundColor: '#ffffff',
// //                 borderRadius: '12px',
// //                 padding: '1rem',
// //                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
// //                 textAlign: 'center'
// //             }}>
// //                 {loading ? (
// //                     <p style={{ color: '#666', fontSize: '1.2rem' }}>טוען נתונים...</p>
// //                 ) : teachers.length > 0 ? (
// //                     <Galleria
// //                         style={{ maxWidth: '640px', margin: '0 auto' }}
// //                         value={teachers}
// //                         responsiveOptions={responsiveOptions}
// //                         numVisible={5}
// //                         item={itemTemplate}
// //                         thumbnail={thumbnailTemplate}
// //                     />
// //                 ) : (
// //                     <p style={{ marginTop: '1rem', color: '#666', fontSize: '1rem' }}>No suitable teachers were found</p>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default SSelectionTeatcher;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./SSelectionTeatcher.css";
// import { useSelector } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';

// const SSelectionTeatcher = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [areas, setAreas] = useState([]); // Initial value is an empty array
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedGender, setSelectedGender] = useState("");
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const accesstoken = useSelector((state) => state.token.token);
//   const decoded = accesstoken ? jwtDecode(accesstoken) : null;

//   useEffect(() => {
//     const fetchAreas = async () => {

//         console.log(decoded.firstName);
//       try {
//         const res = await axios.get("http://localhost:7000/admin/getAllAreas");
//         if (res.data?.areas && Array.isArray(res.data.areas)) {
//           setAreas(res.data.areas); // Update areas if valid
//         } else {
//           console.error("Unexpected response format:", res.data);
//           setAreas([]); // Default value if response is invalid
//         }
//       } catch (err) {
//         console.error("Error fetching areas:", err);
//         setAreas([]); // Default value on error
//       }
//     };

//     const fetchTeachers = async () => {
//         console.log(   "area" ,selectedArea ,
//             "gender" ,selectedGender );

//             const params = {
//                 area: selectedArea || undefined,
//                 gender: selectedGender || undefined,
//             };
//         try {
//           const res = await axios({
//             method: 'get',
//             url: `http://localhost:7000/teacher/getAllTeachers`,
//             headers: { Authorization: "Bearer " + accesstoken },
//             params: params,
//         });
//           if (Array.isArray(res.data)) {
//             console.log("111111", res.data);
//             setTeachers(res.data); // Update teachers list
//           } else {
//             console.error("Unexpected teacher response format:", res.data);
//             setTeachers([]);
//           }
//         } catch (err) {
//           console.error("Error fetching teachers:", err);
//           setTeachers([]);
//         }
//       };

//     // 
//     fetchAreas();
//     fetchTeachers();
//   }, [selectedArea, selectedGender]);

//   return (
//     <div className="teacher-selection">
//       <h1>Select a Teacher</h1>
//       <div className="filters">
//         {/* Area Selection */}
//         <select
//           id="area-select"
//           onChange={(e) => setSelectedArea(e.target.value)}
//           value={selectedArea}
//         >
//           <option value="" disabled hidden>
//             Select Area
//           </option>
//           {areas.map((area, index) => (
//             <option key={index} value={area}>
//               {area}
//             </option>
//           ))}
//         </select>

//         {/* Gender Selection */}
//         <select
//           id="gender-select"
//           onChange={(e) => setSelectedGender(e.target.value)}
//           value={selectedGender}
//         >
//           <option value="" disabled hidden>
//             Select Gender
//           </option>
//           <option value="male">male</option>
//           <option value="female">female</option>
//         </select>
//       </div>

//       {/* Teacher List */}
//       {teachers.length > 0 ? (
//         <div className="teacher-list">
//           {teachers.map((teacher) => (
//             <div
//               key={teacher.id}
//               className={`teacher-card ${selectedTeacher === teacher ? "selected" : ""}`}
//               onMouseEnter={() => setSelectedTeacher(teacher)}
//             >
//               <h2>{teacher.firstName} {teacher.lastName}</h2>
//               <p>{teacher.email}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="no-teachers">No teachers to display.</p>
//       )}

//       {/* Selected Teacher Details */}
//       {selectedTeacher && (
//         <div className="teacher-preview">
//           <h2>{selectedTeacher.firstName} {selectedTeacher.lastName}</h2>
//           <p>Area: {selectedTeacher.area}</p>
//           <p>Gender: {selectedTeacher.gender}</p>
//           <p>Email: {selectedTeacher.email}</p>
//           <p>Phone: {selectedTeacher.phone}</p>
//           <div className="recommendations">
//             <h3>Recommendations</h3>
//             <ul>
//               {selectedTeacher.recommendations?.length > 0 ? (
//                 selectedTeacher.recommendations.map((rec, index) => (
//                   <li key={index}>{rec.rec}</li>
//                 ))
//               ) : (
//                 <p>No recommendations available.</p>
//               )}
//             </ul>
//           </div>
//           <button onClick={() => alert(`You selected ${selectedTeacher.name}`)}>
//             Select this Teacher
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SSelectionTeatcher;


import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SSelectionTeatcher.css";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
const SSelectionTeatcher = () => {
  const [teachers, setTeachers] = useState([]);
  const [areas, setAreas] = useState([]); // רשימת אזורים
  const [selectedArea, setSelectedArea] = useState(""); // אזור שנבחר
  const [selectedGender, setSelectedGender] = useState(""); // מין שנבחר
  const [loading, setLoading] = useState(false); // מצב טעינה
  const [error, setError] = useState(null); // שגיאה
  const accesstoken = useSelector((state) => state.token.token); // טוקן גישה
  const decoded = accesstoken ? jwt_decode(accesstoken) : null;

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await axios.get("http://localhost:7000/admin/getAllAreas", {
          headers: { Authorization: "Bearer " + accesstoken },
        });
        if (res.data?.areas && Array.isArray(res.data.areas)) {
          setAreas(res.data.areas);
        } else {
          setAreas([]);
          console.error("Unexpected response format:", res.data);
        }
      } catch (err) {
        console.error("Error fetching areas:", err);
        setAreas([]);
      }
    };

    fetchAreas();
  }, [accesstoken]);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          area: selectedArea || undefined,
          gender: selectedGender || undefined,
        };

        const res = await axios.get("http://localhost:7000/teacher/getAllTeachers", {
          headers: { Authorization: "Bearer " + accesstoken },
          params,
        });

        if (Array.isArray(res.data)) {
          setTeachers(res.data);
        } else {
          setTeachers([]);
          console.error("Unexpected response format:", res.data);
        }
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError("Failed to fetch teachers. Please try again later.");
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [selectedArea, selectedGender, accesstoken]);

  return (
    <div className="teacher-selection">
      <h1>Select a Teacher</h1>

      <div className="filters">
        <select
          id="area-select"
          onChange={(e) => setSelectedArea(e.target.value)}
          value={selectedArea}
        >
          <option value="">Select Area</option>
          {areas.map((area, index) => (
            <option key={index} value={area}>
              {area}
            </option>
          ))}
        </select>

        <select
          id="gender-select"
          onChange={(e) => setSelectedGender(e.target.value)}
          value={selectedGender}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {loading ? (
        <p>Loading teachers...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : teachers.length > 0 ? (
        <div className="teacher-list">
          {teachers.map((teacher) => (
            <div key={teacher._id} className="teacher-card">
              <h2>
                {teacher.firstName} {teacher.lastName}
              </h2>
              <p>Email: {teacher.email}</p>
              <p>Phone: {teacher.phone}</p>
              <p>Area: {teacher.area}</p>
              <p>Gender: {teacher.gender}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No teachers found for the selected filters.</p>
      )}
    </div>
  );
};

export default SSelectionTeatcher;

