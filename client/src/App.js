import './App.css';
import Auth from './Components/Auth/Auth';
import Logout from './Components/Auth/Logout';
import TermsPage from './Components/Auth/TermsPage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { Link, Route, Routes } from 'react-router-dom';
import './index.css';
import './flags.css';
import ADHome from './Components/Admin/ADHome';
import MHome from './Components/Manager/MHome';
import THome from './Components/Teacher/THome';
import SHome from './Components/Student/SHome';
import SSelectionTeatcher from './Components/Student/SSelectionTeatcher'
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode }from 'jwt-decode';
import Logo from './Pictures/Ministry of Transportation.jpg';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState, useEffect, useRef } from 'react';
import FormUpdate from './Components/Auth/FromUpdate'
import { setToken } from './redux/tokenSlice';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from "primereact/inputtext";
import ImageCarousel from "./Components/images/ImageCarousel"

import './styles/global.css'; 

import axios from 'axios';
import { Toast } from 'primereact/toast';

const App = () => {


  const [visibleU, setVisibleU] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accesstoken = useSelector((state) => state.token.token)
  const overlayPanel = useRef(null);

  const decoded = accesstoken ? jwtDecode(accesstoken) : null;

  const [text, setText] = useState("user");
  const [role, setRole] = useState("");


  const [oldpassword, setOldPassword] = useState("");
  const [newpassword1, setNewPassword1] = useState("");
  const [newpassword2, setNewPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // סטייט להודעת השגיאה

  const toast = useRef(null);



  const passwordChange = async () => {
    debugger
    setErrorMessage("")
    if (newpassword1 !== newpassword2 || newpassword1 === "" || newpassword2 === "") {
      setErrorMessage("The new passwords do not match");
      return;
    }
    if (oldpassword === "") {
      setErrorMessage("Please enter your old password");
      return;
    }

    let url;

    if (accesstoken) {

      const decoded = jwtDecode(accesstoken);
      if (decoded.role === 'M') {
        url = 'http://localhost:7000/manager/changePassword';
      } else if (decoded.role === 'T') {
        url = 'http://localhost:7000/teacher/changePassword';
      } else if (decoded.role === 'S') {
        url = 'http://localhost:7000/student/changePassword';
      }
      else if (decoded.role === 'A') {
        url = 'http://localhost:7000/admin/changePassword';
      }


      try {
        const change = await axios({
          method: 'put',
          url: url,
          headers: { Authorization: "Bearer " + accesstoken },
          data: {
            "oldPassword": oldpassword,
            "newPassword": newpassword1,
          },
        });
        if (change.status === 200) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Password changed successfully',
          });
          overlayPanel.current.hide(); // Hide the OverlayPanel after successful password change
        }
      } catch (e) {
        if (e.response?.status === 400) {
          setErrorMessage("Invalid old password");
        } else {
          setErrorMessage("An error occurred while changing the password");
        }
      }


    }
  }
  const showDetails = (event) => {
    if (overlayPanel.current) {
      overlayPanel.current.toggle(event); // מציג את ה-OverlayPanel
    }
  };
  

  // const text = decoded ? `${decoded.firstName} ${decoded.lastName}` : "user";

  useEffect(() => {
    if (accesstoken) {
      const decoded = jwtDecode(accesstoken);
      if (decoded.role === 'M') {
        setRole("director")
      } else if (decoded.role === 'T') {
        setRole("teacher")
      } else if (decoded.role === 'S') {
        setRole("student")
      }
      else if (decoded.role === 'A') {
        setRole("Admin")
        setText(role)
      }

      if (decoded.role != 'A')
        setText(`${role} ${decoded.firstName} ${decoded.lastName}`);
    } else {
      setText("user");
    }

  }, [accesstoken, decoded]);

  const items = [
    {
      label: <img src={Logo} alt="Logo" style={{ height: '60px', width: 'auto' }} />, // Image on the right
      command: () => { },
    },
    {
      label: 'Login',
      icon: 'pi pi-sign-in',
      command: () => {
        if (overlayPanel.current) {
          overlayPanel.current.hide(); // סגירת ה-OverlayPanel
        }
       
        setText("user");
       
        navigate('/Auth/Auth');
        dispatch(setToken(null));

      }
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        if (overlayPanel.current) {
          overlayPanel.current.hide(); // סגירת ה-OverlayPanel
        }
        navigate('/Auth/Logout');
      },
    },
    {
      label: <p style={{ fontWeight: "bold" }}>Hello <b>{text}</b></p>,
      icon: 'pi pi-user',
      command: () => {
        if (decoded) {
          setVisibleU(true);
        }
        if (overlayPanel.current) {
          overlayPanel.current.hide(); // סגירת ה-OverlayPanel  
        }
      }

    }

  ];


  const end = (decoded ?
    <div className="flex align-items-center gap-2">
      <div
        className="p-menuitem-link"
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={(event) => {
          if (decoded) {
            showDetails(event); // מעביר את האירוע לפונקציה
          }
        }}
      >
        {/* <span className="pi pi-barcode" style={{ marginRight: "0.5rem" }}></span> */}
        <span style={{ fontWeight: "bold" }}>Password change</span>
      </div>
    </div> : null
  );

  
  return (
    <div className="App">
      {<div className="card">
       

        <div className="navbar">
          <Menubar model={items} end={end} dir="ltr" />
        </div>
       

      </div>}
      <Routes>
        <Route path="/Auth/Logout" element={<Logout />} />
        <Route path="/Auth/Auth" element={<Auth />} />
        <Route path="/Admin/ADHome" element={<ADHome />} />
        <Route path="/Manager/MHome" element={<MHome />} />
        <Route path="/Teacher/THome" element={<THome />} />
        <Route path="/Student/SHome" element={<SHome />} />
        <Route path="/Auth/terms" element={<TermsPage />} />
        <Route path="/Student/SSelectionTeatcher" element={<SSelectionTeatcher />} />
      </Routes>

     
      <OverlayPanel ref={overlayPanel}
        style={{ width: '300px', padding: '1rem', textAlign: 'center' }}
        onHide={() => {
          // איפוס הנתונים כאשר ה-OverlayPanel נסגר
          setOldPassword("");
          setNewPassword1("");
          setNewPassword2("");
          setErrorMessage("");
        }}
      >


        <div
          className="card flex flex-column gap-3"
          style={{
            textAlign: 'center', // יישור אופקי
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // יישור אנכי
          }}
        >
          <InputText
            type="text"
            className="p-inputtext-sm"
            placeholder="old password"
            value={oldpassword} // קישור לסטייט
            onChange={(e) => setOldPassword(e.target.value)} // עדכון הסטייט
          />
          <InputText
            type="text"
            className="p-inputtext-sm"
            placeholder="new password"
            value={newpassword1} // קישור לסטייט
            onChange={(e) => setNewPassword1(e.target.value)} // עדכון הסטייט
          />
          <InputText
            type="text"
            className="p-inputtext-sm"
            placeholder="new password"
            value={newpassword2} // קישור לסטייט
            onChange={(e) => setNewPassword2(e.target.value)} // עדכון הסטייט
          />

          {errorMessage && ( // הצגת הודעת השגיאה אם קיימת
            <p
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: "0.8rem", // גודל אותיות קטן יותר
                //marginTop: "0.25rem",
                whiteSpace: "nowrap", // מניעת שבירת שורה
              }}
            >
              {errorMessage}
            </p>
          )}

          <Button
            label="Password change"
            onClick={() => {
              if (accesstoken) {
                const decoded = jwtDecode(accesstoken);
                if (decoded.role) {
                  passwordChange()
                }
              }
            }}
            className="p-button"
            style={{
              marginTop: "0.5rem",
              width: "75%",
              backgroundColor: "#000",
              color: "#fff",
              fontSize: "0.8rem",
              textTransform: "none",
              borderRadius: "12px",
              border: "none",
            }}
          />

        </div>
      </OverlayPanel>
      <Toast ref={toast} />
     


      {visibleU && accesstoken && (
        <FormUpdate visibleU={visibleU} setVisibleU={setVisibleU} />
      )}

      <ImageCarousel></ImageCarousel>



    </div>


  );
}

export default App;

