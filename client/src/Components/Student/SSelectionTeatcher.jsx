import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

const SSelectionTeatcher = (props) => {
  const styles = {
    teacherSelection: {
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    title: {
      textAlign: "center",
      color: "#222",
    },
    filters: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "20px",
      flexWrap: "wrap", 
    },
    select: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #000", 
      backgroundColor: "white", 
      color: "black", 
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s",
      width: "100%", 
      maxWidth: "250px", 
    },
    teacherList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
      gap: "20px",
      justifyItems: "center",
    },
    teacherCard: {
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      textAlign: "center",
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "pointer",
      width: "200px", 
      height: "250px", 
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      backgroundColor: "white",
      color: "black",
    },
    teacherCardHover: {
      transform: "scale(1.05)",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)", 
    },
    teacherCardSelected: {
      borderColor: "#666", 
      backgroundColor: "#f5f5f5", 
    },
    teacherPreview: {
      marginTop: "20px",
      padding: "20px",
      border: "1px solid #666", 
      borderRadius: "10px",
      backgroundColor: "#f5f5f5",
      color: "black",
    },
    button: {
      marginTop: "20px",
      padding: "10px 20px",
      backgroundColor: "#000", 
      color: "white", 
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#333", 
    },
    unavailable: {
      backgroundColor: "#ccc", 
      color: "#666", 
      cursor: "not-allowed",
    },
  
    
    "@media (max-width: 1200px)": {
      teacherSelection: {
        padding: "15px", 
      },
      select: {
        width: "100%", 
      },
      teacherCard: {
        width: "90%", 
        height: "auto",
      },
    },
  
    "@media (max-width: 768px)": {
      filters: {
        flexDirection: "column", 
        gap: "15px", 
      },
      teacherList: {
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
      },
      teacherCard: {
        width: "100%", 
      },
      button: {
        width: "100%", 
      },
    },
  
    "@media (max-width: 480px)": {
      teacherSelection: {
        padding: "10px",
      },
      select: {
        width: "100%", 
      },
      teacherCard: {
        width: "100%",
      },
      button: {
        width: "100%", 
      },
    },
  };
  
  
  
  

  const [teachers, setTeachers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const accesstoken = useSelector((state) => state.token.token);
  const toast = useRef(null);
  const navigate = useNavigate();

  const teacherSelection = async () => {
    if (!selectedTeacher) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please select a teacher before proceeding.",
        life: 3000,
      });
      return;
    }
   
    try {
      const res = await axios.put(
        "http://localhost:7000/student/teacherSelection",
        JSON.stringify({ teacherId: selectedTeacher._id }),
        {
          headers: {
            Authorization: "Bearer " + accesstoken,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `You have successfully registered with teacher ${selectedTeacher.firstName} ${selectedTeacher.lastName}!`,
          life: 2000,
        });
        setTimeout(() => {
          navigate('/Student/SHome');
      }, 2000);
      } else {
        throw new Error("Unexpected response status: " + res.status);
      }
    } catch (e) {
      console.error("Error Status:", e.response?.status);
      console.error("Error Data:", e.response?.data);
      console.error("Error Message:", e.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: e.response?.data?.message || "Failed to register with the teacher. Please try again.",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await axios.get("http://localhost:7000/admin/getAllAreas", {
          headers: { Authorization: "Bearer " + accesstoken },
        });
        setAreas(res.data?.areas || []);
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

        setTeachers(res.data || []);
        if (
          selectedTeacher &&
          !res.data.some((teacher) => teacher._id === selectedTeacher._id)
        ) {
          setSelectedTeacher(null);
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

  const handleSelectTeacher = (teacher) => {
    if (teacher.listOfStudent.length > 3) {
  
      toast.current.show({
        severity: "warn",
        summary: "Unavailable",
        detail: "This teacher cannot accept more students.",
        life: 3000,
      });
      return;
    }
    setSelectedTeacher(teacher);
  };

  return (
    <div style={styles.teacherSelection}>
      <Toast ref={toast} />
      <h1 style={styles.title}>Select a Teacher</h1>

      <div style={styles.filters}>
        <select
          id="area-select"
          onChange={(e) => setSelectedArea(e.target.value)}
          value={selectedArea}
          style={styles.select}
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
          style={styles.select}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {loading ? (
        <p>Loading teachers...</p>
      ) : error ? (
        <p style={{ color: "black", textAlign: "center" }}>{error}</p>
      ) : teachers.length > 0 ? (
        <div style={styles.teacherList}>
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              style={{
                ...styles.teacherCard,
                ...(teacher.listOfStudent.length > 3 ? styles.unavailable : {}),
              }}
              onClick={() => handleSelectTeacher(teacher)}
            >
              <h2>
                {teacher.firstName} {teacher.lastName}
              </h2>
              {teacher.listOfStudent.length > 3 && (
                <p style={{ color: "black", fontWeight: "bold" }}>
                  This teacher is unavailable.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No teachers found for the selected filters.</p>
      )}

      {selectedTeacher && (
        <div style={styles.teacherPreview}>
          <h2>
            {selectedTeacher.firstName} {selectedTeacher.lastName}
          </h2>
          <p>Area: {selectedTeacher.area}</p>
          <p>Gender: {selectedTeacher.gender}</p>
          <p>Email: {selectedTeacher.email}</p>
          <p>Phone: {selectedTeacher.phone}</p>
          <button
            style={{
              ...styles.button,
              ...(selectedTeacher.listOfStudent.length > 3 ? styles.unavailable : {}),
            }}
            onClick={teacherSelection}
            disabled={selectedTeacher.listOfStudent.length > 3}
          >
            Select this Teacher
          </button>
        </div>
      )}
    </div>
  );
};

export default SSelectionTeatcher;