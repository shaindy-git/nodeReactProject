
import React, { useEffect, useRef, useState } from "react";
import axios from 'axios'
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut } from '../../redux/tokenSlice'
import { useNavigate } from 'react-router-dom';
import { Link, Route, Routes } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
import FormRegT from "./FormRegT";
import FormRegS from "./FormRegS";




const Auth = () => {
    const [visible, setVisible] = useState(false);

    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accesstoken = useSelector((state) => state.token.token)


    const login = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: 'http://localhost:7000/auth/login',
                headers: {},
                data: {
                    userName: userName,
                    password: password // שליחת שם משתמש וסיסמה
                }
            });
    
            if (res.status === 200) {
                const token = res.data.accessToken; 
                dispatch(setToken(token)); 
                const decoded = jwtDecode(token); 
                const userRole = decoded.role; 
    
                // ניווט לפי התפקיד
                switch (userRole) {
                    case 'M':
                        navigate('/Manager/MHome');
                        break;
                    case 'T':
                        navigate('/Teacher/THome');
                        break;
                    case 'S':
                        navigate('/Student/SHome');
                        break;
                    case 'A':
                        navigate('/Admin/ADHome');
                        break;
                    default:
                        alert("Unauthorized user role");
                }
            }
        } catch (e) {
            console.error(e);
            alert("Unauthorized user"); // הודעה על כשלון
        }
    };

    const [visibleS, setVisibleS] = useState(false);
    const [visibleT, setVisibleT] = useState(false);



    return (

        // <div className="flex justify-content-center align-items-center min-h-screen">
        <div className="card">
            <div className="flex flex-row md:flex-row ">
                {/* Login Section */}
                <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">User Name</label>
                        <InputText id="username" type="text" className="w-12rem" onChange={(e) => { setuserName(e.target.value); }} />
                    </div>
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Password</label>
                        <InputText id="password" type="password" className="w-12rem" onChange={(e) => { setPassword(e.target.value); }} />
                    </div>
                    <Button label="Login" icon="pi pi-user" className="w-10rem mx-auto" onClick={login} ></Button>
                </div>

                {/* Divider Section */}
                <div className="w-full md:w-2" >
                    <Divider layout="vertical" className="hidden md:flex" />
                    <Divider layout="horizontal" className="flex md:hidden" align="center" />
                </div>

                {/* Registration Section */}
                <div className="md:w-5 flex flex-column align-items-center gap-3 py-5 mt-5">
                    <Button label="Student Register" icon="pi pi-user-plus" severity="success" className="w-10rem" onClick={() => { setVisibleS(visibleS === false ? true : false); setVisibleT(false); }}></Button>
                    <Button label="Teacher Register" icon="pi pi-user-plus" severity="success" className="w-10rem" onClick={() => { setVisibleT(visibleT === false ? true : false); setVisibleS(false); }}></Button>
                    {visibleT && <FormRegT setVisibleT={setVisibleT} visibleT={visibleT} />}
                    {visibleS && <FormRegS setVisibleS={setVisibleS} visibleS={visibleS} />}
                </div>
            </div>

           </div>

        // </div>
    )
}

export default Auth

//קבלת הטוקן בכל מקום רצוי
// const accesstoken=useSelector((state)=>state.token.token)

//יציאת משתמש מסקנה: להפעיל רק ע"י כפתור ולא ע"י רפשרוש
// useEffect(()=>{
//     dispatch(logOut())

// },[])
 //חילוץ
//  const decodeToken = (token) => {
//     if (!token) {
//         throw new Error('No token provided');
//     }
    
//     try {
//         const decoded = jwtDecode(token);
//         return decoded; // Returns the content of the token
//     } catch (error) {
//         console.error('Token is invalid or expired', error);
//         return null;
//     }
// };


// import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { logOut, setToken } from '../../redux/tokenSlice';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// function Auth() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // מתבצעת התנתקות בכל כניסה למסך ההתחברות
//     dispatch(logOut());
//   }, [dispatch]);

//   const handleLogin = () => {
//     // טוקן לדוגמה שמכיל מידע על המשתמש
//     const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
//       "eyJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UiLCJyb2xlIjoiTWFuYWdlciJ9." +
//       "fake-signature";

//     dispatch(setToken(fakeToken));

//     const decoded = jwtDecode(fakeToken);
//     if (decoded.role === 'Manager') navigate('/Manager/MHome');
//     else if (decoded.role === 'Teacher') navigate('/Teacher/THome');
//     else if (decoded.role === 'Student') navigate('/Student/SHome');
//   };

//   return (
//     <div className="auth-container">
//       <h2>Login Page</h2>
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }

// export default Auth;


